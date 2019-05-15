# this sends the dist folder to the staging bucket and on to cloudfront.
# https://d3tgv30cf6x3h2.cloudfront.net/

# see: https://github.com/import-io/s3-deploy

# Make a backup of the dist directory
echo "Copying dist directory to diststaging\n"
rm -r stagingdist
sleep 2s
cp -r dist stagingdist
sleep 2s

cp staging_robots.txt stagingdist/robots.txt
sleep 1


### Loop through all static js files and change routes from staging- to production-
echo "Replacing production routes with feature routes in stagingdist\n"
for file in $(grep -R 'production-' -l stagingdist/static/js);
    do $(sed -i.bak s/production-bookingapi/feature-bookingapi/g "$file");
done

for file in $(grep -R 'production-' -l stagingdist/static/js);
    do $(sed -i.bak s/production-inventoryapi/feature-inventoryapi/g "$file");
done

sleep 5s

echo "Sending to staging cloudfront\n"
s3-deploy './stagingdist/**' --cwd './stagingdist/' --region us-east-1 --bucket staging-www.takewalks.com --deleteRemoved --distId E3UHFH59IJDGSZ --invalidate '/*'

