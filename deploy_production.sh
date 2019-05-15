###################################################################################################
#
#
#
# this sends the dist folder to the production-www.takewalks.com  bucket and on to cloudfront.
# https://d6fslh6ofa0rg.cloudfront.net

# see: https://github.com/import-io/s3-deploy
echo "Sending to PRODUCTION cloudfront\n"
cp robots.txt dist/robots.txt
cp sitemap.xml dist/sitemap.xml
sleep 1
s3-deploy './dist/**' --cwd './dist/' --region us-east-1 --bucket production-www.takewalks.com --deleteRemoved --distId E2SF0GA42ME8LX --invalidate '/*'



