#!/usr/bin/env python
# coding: utf-8

# In[1]:


import ete3 as et # phylogenetics library that provides tree data structure with nice methods for inspection and manipulation
import json # necessary to read in exported nextstrain JSON file
# from pprint import pprint
from itertools import combinations
import argparse
import datetime


# # Load and parse the tree

# In[2]:


def make_node(data_dict):
    '''
    data_dict: portion of the nextstrain tree JSON representing either an internal node or leaf
    returns: ete3 TreeNode object with all attributes and relationships populated from the nextstrain JSON
    '''
    node = et.TreeNode()
    node.name = data_dict['name'] # copy name
    node.dist = 0.    # initialize for the root node
    
    def parse_decimal_date(dec_date):
        '''KNOWN BUG: WILL NOT HANDLE LEAP YEARS'''
        year = int(dec_date)
        try:
            ordinal_day = datetime.date.fromordinal(round((dec_date - year)*365))
        except ValueError:
            print('potential bad date', dec_date)
            ordinal_day = datetime.date.fromordinal(1)
        date = datetime.date(year, ordinal_day.month, ordinal_day.day)
        return date.strftime('%Y-%M-%D')

    def add_features(attrs, node):
        '''
        attrs: dictionary of either `branch_attrs` or `node_attrs` from the nextstrain json
        node: node to attach these two
        side effect: modifies node in place to attach these attributes as `node.features` per ETE3 convention.
                     these can later be referenced via `node.attribute_name => value`
        '''
        for k,v in attrs.items():
            if not isinstance(v, dict): # not a dictionary / no nesting present
                if 'date' in k and type(v) == float:
                    v = parse_decimal_date(v)
                node.add_feature(k, v)
            elif len(v) == 0: # empty dict
                continue
            elif len(v) == 1 and 'value' in v: # only dictionary element is 'value'
                if 'date' in k and type(v) == float:
                    v = parse_decimal_date(v['value'])
                else:
                    v = v['value']
                node.add_feature(k, v)
            else: # unpack nested dictionary with multiple items
                for k2,v2 in v.items():
                    if k2 == 'value':
                        k2 = k
                    else:
                        k2 = k+'_'+k2
                    if 'date' in k2 and type(v2) == float:
                        v2 = parse_decimal_date(v2)
                    node.add_feature(k2, v2)

    if 'branch_attrs' in data_dict:
        add_features(data_dict['branch_attrs'], node)        
        
    if 'node_attrs' in data_dict:
        cumulative_div = data_dict['node_attrs'].pop('div') # pop out the divergence value to store as `node.dist`, rather than as a metadata feature
        add_features(data_dict['node_attrs'], node)

    
    if 'children' in data_dict and len(data_dict['children']) > 0: # recursively visit each of the children of the node to build out the full tree structure with the right parental relationships
        for c in data_dict['children']:
            if 'node_attrs' in c and 'div' in c['node_attrs']:
                d = c['node_attrs']['div']
            else:
                d = 0.
            node.add_child(make_node(c), 
                           dist = d - cumulative_div) # nextstrain records each node/leaf's *total distance* from the root, not the incremental distance from its parent
    return node
        
def make_tree(json_file):
    '''
    json_file: filehandle to read or pre-parsed JSON file as a dictionary
    returns: ete3.Tree object. NB that ete3.Tree and ete3.TreeNode objects are synonymous; see their docs for more
    '''
    if type(json_file) == str:
        json_dict = json.load(open(json_file, 'r'))
    else:
        assert(type(json_file)==dict)
        json_dict = json_file
        
    tree = make_node(json_dict['tree'])
    return tree

# # Define and inspect the clade (unit of analysis)

# In[4]:


def get_clade_mrca(targets, tree):
    '''
    targets: a single internal node that represents the most recent common ancestor of the clade of interest OR
           an iterable containing multiple leaves/samples of interest
    tree: root node of the tree that contains `nodes`
    returns: single internal node that represents the most recent common ancestor of the clade of interest 
    (i.e., the smallest subtree that still contains all of the leaves/samples of interest).
    
    N.B.: ETE toolkit does not distinguish between a node and a tree, as any node with children can be considered 
    a subtree. 
    '''
    if isinstance(targets, et.TreeNode): 
        assert(len(targets.children) > 0)
        return targets
    else:
        samples = [tree.get_nodes_by_name(s) if type(s) == str else s for s in targets]
        return tree.get_common_ancestor(samples)

    
# def samples_form_monophyletic_clade(samples, mrca=None):
#     '''
#     samples: list of leaf nodes of interest that are in the clade
#     returns: boolean indicator of whether these samples form a monophyletic clade 
#             (i.e., all more closely related to each other than to anything else)
#     '''
#     if mrca is None:
#         mrca = get_clade_mrca(samples) # find the smallest subtree that contains all of the samples
#     return(len(mrca) == len(samples)) # return whether there are other samples that are also part of the clade

def get_parent(node, min_parent_muts=None):
    '''
    node: internal node, should be the mrca of the clade of interest
    min_muts (optional): optionally, find the first parent that is at least min_muts away from `node` 
                        (may be the great-/grandparent, etc.)
    '''
    parent = node.up
    
    if min_parent_muts:
        while node.get_distance(parent) < min_parent_muts:
            parent = parent.up
        
    return parent

def get_cousins(node, min_parent_muts=None):
    '''
    node: node representing the most recent common ancestor of the clade of interest
    min_muts: passed as parameter to `get_parent` used to define siblings
    returns: all leaves that descend from the `node`s siblings
    '''
    parent = get_parent(node, min_parent_muts)
    cousins = [s for s in node.up if s not in node]
    return cousins


# # Contextualize the clade

# In[26]:


# def get_tmrca(mrca):
#     '''
#     node: node representing the most recent common ancestor of the clade of interest
#     returns: decimal date
#     '''
#     return {k:getattr(mrca, k) for k in mrca.features if 'num_date' in k}

def clade_is_monophyletic_wrt_attr(node, attr = 'location'):
    '''
    clade: root node of (sub)tree being investigated
    attr: attribute to test monophyly with respect to
    returns: boolean indicator of whether all samples in the clade have the same non-null value for `attr`. 
    '''
    
    values_seen = set()
    for sample in node.iter_leaves():
        if attr not in sample.features:
            return False
        
        value = getattr(sample, attr)
        values_seen.add(value)
        if len(values_seen) > 1 or value is None:
            return False
        
    return True

def get_subclades(node, attr, attr_values):
    '''
    node: mrca of subtree to search
    attr: attribute to search by
    attr_values: valid attr values for a subtree to be included 
    returns: list of dictionaries, each describing a subclade
    '''
    
    def get_first_leaf_attr_value(node, attr):
        '''wrapping an iterator to avoid traversing the same subtree a gazillion times just to get one value'''
        for leaf in node.iter_leaves(): # grab just the first leaf; use an iterator anyway for efficiency 
            return getattr(leaf, attr)
    
    def is_subclade(node, attr, attr_values):
        '''split off a node if either:
        (1) it is a single leaf with a valid attr value, 
            meaning none of its parents were monophyletic and it is a one-off
        (2) it is a monophyletic subclade where all descendent leaves have the same valid attr value
        '''
        if get_first_leaf_attr_value(node, attr) not in attr_values: # is the first (or only) value a valid value?
            return False        
        if node.is_leaf(): # a leaf can be its own subclade
            return True
        return clade_is_monophyletic_wrt_attr(node, attr) # if >1 leaves, do they all have the same value as the first value?
    
    subclades = [sc for sc in node.iter_leaves(is_leaf_fn=lambda s: is_subclade(s, attr, attr_values))] # built in tree traversal function that tests each node and returns it as a subtree if the `is_leaf_fn` returns True
    
    return [{'n_samples': len(sc), attr: get_first_leaf_attr_value(sc, attr), 'subtree': sc} for sc in subclades]
    
    
def min_transmissions_across_demes(node, niblings, attr_value, attr = 'location'):
    '''
    node: mrca of the clade of interest
    niblings: niblings that "flank" the clade of interest
    attr_value: Ignore subclades with this value. Usually the "home location" for the clade of interest. 
    attr: usually 'location' or another geographic descriptor
    returns: list of dictionaries, each describing a putative introduction into the "home location."
    '''
    nibling_values = set([getattr(n, attr) for n in niblings])
    if attr_value in nibling_values:
        set.remove(attr_value)
    return get_subclades(node, attr, nibling_values)
    
def clade_uniqueness(node):
    '''
    node: node representing the most recent common ancestor of the clade of interest
    returns: N mutations between node and its immediate parent
    '''
    parent = get_parent(node)
    return node.get_distance(parent)
    
def pairwise_dist_minmax(samples):
    
    combos = list(combinations(samples, 2))
    init = combos[0][0].get_distance(combos[0][1])
    min_dist = init
    max_dist = init
    
    for s1,s2 in combos[1:]:
        d = s1.get_distance(s2)
        min_dist = min(d, min_dist)
        max_dist = max(d, max_dist)
    return (min_dist, max_dist)
        

# def n_onward_with_accumulated_muts(node, min_muts, min_nodes_between=None):
#     '''
#     node (required): internal node, should be the mrca of the clade of interest
#     min_muts (required): minimum number of mutations (branch length) between the internal node and each sample
#     min_nodes_between (optional): number of internal nodes along the path between `node` and each sample
#     returns: N descendent samples that satisfy requirements 
#             (if min_nodes_bewteen is specified, must satisfy *both* requirements
#     '''
    
#     descendents_with_accumulated_muts = []
#     for s in node.iter_leaves():
#         n_muts = node.get_distance(s) # summed branch length along path between node and leaf
        
#         if n_muts < min_muts: # not enough mutations
#             continue
#         elif not min_nodes_between:
#             descendents_with_accumulated_muts.append(s) # enough mutations and no topology requirement
#         else: 
#             n_nodes_between = node.get_distance(s, topology_only = True) 
#             if n_nodes_between >= min_nodes_between: # enough mutations and enough nodes in between
#                 descendents_with_accumulated_muts.append(s)
        
#     return len(descendents_with_accumulated_muts)


# In[39]:


def describe_sample(sample, mrca=None):
    standard_attrs = ['name', 'location', 'division', 'country', 'region']
    description = {}
    for attr in standard_attrs:
        if attr in sample.features:
            description[attr] = getattr(sample, attr)
        else:
            description[attr] = None
    description['collection_date'] = getattr(sample, 'num_date')
    description['metadata'] = {attr: getattr(sample, attr) for attr in sample.features if attr not in description}
    if mrca is None:
        description['muts_from_mrca'] = None
    else:
        description['muts_from_mrca'] = sample.get_distance(mrca)
    return description

def describe_clade(selected_samples, tree,
                   min_parent_muts = None, 
                   min_trans_per_mut= 0, 
                   max_trans_per_mut= 3,
                   home_geo = {'location': 'Humboldt county', 'division': 'California', 'country': 'USA', 'region': 'North America'}): 
    
    '''
    samples: list of samples of interest
    tree: json or pre-parsed et.TreeNode object
    min_parent_muts: HEURISTIC how far back in the tree to look for "cousins"
    TEMP-NOT-USED: min_onward_nodes_bwn: HEURISTIC threshold for N intermediate nodes req'd to consider a sample the likely result of onward transmission
    '''
    
    if type(tree) == str:
        tree = make_tree(tree)
    assert(isinstance(tree, et.TreeNode))
    try:
        assert(all([s in tree for s in samples]))
    except:
        print([type(s) for s in samples])
        raise(AssertionError)

    desc = {}
    
    desc['home_geo'] = home_geo
    desc['muts_per_trans_minmax'] = [min_trans_per_mut, max_trans_per_mut]
    
    mrca = get_clade_mrca(selected_samples, tree)
    desc['mrca'] = describe_sample(mrca, None)
    desc['selected_samples'] = [describe_sample(s, mrca) for s in selected_samples]
    desc['unselected_samples_in_cluster'] = [describe_sample(s, mrca) for s in mrca.get_children() 
                                             if s not in selected_samples]
    
    desc['muts_from_parent'] = clade_uniqueness(mrca)
    desc['cousins'] = [describe_sample(c, mrca) for c in get_cousins(mrca, min_parent_muts)]
    
    desc['muts_bn_selected_minmax'] = pairwise_dist_minmax(samples)
    ###### BROKEN! TODO: SWITCH TO MATUTILS INTRODUCE #########
    desc['transmissions_across_demes'] = {
    'location': [],
    'division': [],
    'country': [],
    'region': [],
    }
    
    return desc


def describe_dataset(tree):
    return {'all_samples': [describe_sample(s) for s in tree.get_children()]}
    
def write_as_ts(clade_description, dataset_description, filepath):
    ofile = open(filepath, 'w')
    
    header = 'import { CladeDescription, DatasetDescription } from "../src/d";'
    clade_header = 'const clade_description: CladeDescription = '
    dataset_header = 'const dataset_description: DatasetDescription = '
    footer = 'export default { clade_description, dataset_description };'
    
    ofile.write(header+'\n\n'+clade_header)
    json.dump(clade_description, ofile, indent=1)
    ofile.write('\n\n'+dataset_header)
    json.dump(dataset_description, ofile, indent=1)
    ofile.write('\n\n'+footer)


# In[40]:
parser = argparse.ArgumentParser()
parser.add_argument('-samples', type=str, nargs='+', help='list of sample names to explore or filepath to file with 1 name per line')
parser.add_argument('-tree', type=str, nargs=1, help='Path to JSON file with nextstrain tree')
parser.add_argument('-location', type=str, help="Location (county) to consider 'home' for analyzing introductions")
parser.add_argument('-division', default='California', type=str, help="Division (state) to consider 'home' for analyzing introductions")
parser.add_argument('-country', default='USA', type=str, help="Country to consider 'home' for analyzing introductions")
parser.add_argument('-region', default='North America', type=str, help="global region to consider 'home' for analyzing introductions")
parser.add_argument('-min_trans_per_mut', default=0, type=int, help="lower bound of how many transmissions we expect to have occurred per 1 mutation observed")
parser.add_argument('-max_trans_per_mut', default=3, type=int, help="lower bound of how many transmissions we expect to have occurred per 1 mutation observed")
parser.add_argument('-min_parent_muts', default=None, type=int, help="minimum number of mutations between mrca and parent when looking for cousins")
parser.add_argument('-output_path', type=str, help="file path for output")

args = parser.parse_args()

# In[41]:

tree = make_tree(args.tree[0])
tree.ladderize() # sort / rotate nodes for a tidy looking tree
tree.describe() # basic facts to check we did it right

if type(args.samples) == str:
    sample_names = [s.strip() for s in open(args.samples, 'r').readline()]
else:
    sample_names = [s.strip() for s in args.samples]
samples = [tree.get_leaves_by_name(s)[0] for s in args.samples]

clade_description = describe_clade(samples, tree, min_parent_muts=args.min_parent_muts,
min_trans_per_mut=args.min_trans_per_mut, max_trans_per_mut=args.max_trans_per_mut, 
home_geo = {'location': args.location, 'division': args.division, 'country': args.country, 'region': args.region})
dataset_description = describe_dataset(tree)


# In[46]:


write_as_ts(clade_description, dataset_description, args.output_path)


# In[ ]:




