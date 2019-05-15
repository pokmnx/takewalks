# this sends the dist folder to the staging bucket and on to cloudfront.
# https://d3tgv30cf6x3h2.cloudfront.net/

# see: https://github.com/import-io/s3-deploy

# Make a backup of the dist directory
echo "Copying dist directory to stagingdist\n"
rm -r stagingdist
sleep 2s
cp -r dist stagingdist
sleep 2s

cp staging_robots.txt stagingdist/robots.txt
sleep 1

### Loop through all static js files and change routes from staging- to production-
echo "Replacing production routes with staging routes in stagingdist"
for file in $(grep -R 'production-' -l stagingdist/static/js);
    do $(sed -i.bak s/production-/staging-/g "$file");
done


