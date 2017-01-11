'use strict';

const fs = require('fs');
const path = require('path');
const filename = process.env.FILENAME;
let count = 0;
const content = fs.readFileSync(path.join(__dirname, './' + filename + '_urls'));
let result = {};
let domain;

content.toString().split('\n').forEach((url) => {
  url = url.trim();
  if (url.length > 0) {
    let fullpath = url.split('://');
    let protocol = fullpath[0];
    let path = fullpath[1];
    //console.log(`#${++count} ${protocol} ${path}`);
    let p = path.split('/');
    switch (protocol) {
      case 'http':
      case 'https':
        domain = p[0].split('.');
        let len = domain.length;
        domain = [].concat(domain[len - 2], domain[len - 1]).join('.');
        break;
      default:
        domain = p[0];
        break;
    }
    if (!result[protocol]) {
      result[protocol] = {};
    }
    if (!result[protocol]['.domains']) {
      result[protocol]['.domains'] = [];
    }
    if (result[protocol]['.domains'].indexOf(domain) === -1) {
      result[protocol]['.domains'].push(domain);
    }
    if (!result[protocol][domain]) {
      result[protocol][domain] = [];
    }
    result[protocol][domain].push(path);
  }
  //console.log(`#${++count} ${domain}`);
});
console.log(`${JSON.stringify(result, null, 2)}`);

fs.writeFileSync(path.join(__dirname, './' + filename + '_result'), JSON.stringify(result, null, 2));
