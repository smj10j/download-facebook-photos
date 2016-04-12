download-facebook-photos
========================


Usage Notes
-----------

Install the Google App Engine Flexible Environment
https://cloud.google.com/sdk/

Run the server with
dev_appserver.py download-data-uri/app.yaml

Go to Facebook
https://www.facebook.com/smj10j/photos_of

Scroll to the bottom of the page until no more photos load

Open up the Chrome Developer console and paste in the contents of the script named
chrome-console-script.js

If needed, using Cisdem DuplicateFinder.app to remove duplicates or running a rename can help with cleanup. ie. 
rename --dry-run 's/ \(\d\)//' **/*
