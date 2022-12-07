# statc export

Instructions for preparing the static export

```bash
# cd to/this/folder

docker-compose up -d

cd server
nano .env                   # uncomment static mode + ensure production bucket
nano app-config.json        # make sure everything is final
npm run dev fetch-schedule
npm run dev export-schedule
cp -R static ..

cd ../client
nano public/config.js       # uncomment static mode
npm run build
cp -R dist/* ../static

# commit to git to deploy to GitHub pages
```

# todo

- Investigate lack of links
- Get the live attendance into the export
- Can the notion assets be embedded in the static export too?
- Check the 404 "hack" works
