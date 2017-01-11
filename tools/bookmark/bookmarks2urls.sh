#!/usr/bin/env bash
grep "HREF" $1 | awk -F"\"" '{print $2}' >> $1_urls
FILENAME=$1 node ./url-analysis.js
