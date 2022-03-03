set -e
git checkout main
npm run build
git checkout gh-pages
git rm -rf .
mv dist/* . && rmdir dist/ 
git add index.html assets/
git commit -m "deploy" --no-verify
git push
git checkout main