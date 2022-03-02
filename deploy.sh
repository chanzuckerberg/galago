git checkout main
npm run build
git checkout gh-pages
# mv favicon.svg ./dist/
git rm -rf .
mv dist/* . && rmdir dist/ 
git add index.html assets/# favicon.svg
git commit -m "deploy" --no-verify
git push
git checkout main