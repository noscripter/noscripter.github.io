// ==UserScript==
// @name         NoScripter's Secret Power
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @match        https://*/*
// @grant        none
// ==/UserScript==

const bg = 'background: transparent !important;';

const stupidScripts = [
  'aplus',
  'alilog',
  'mlog',
  'sufei_data',
  'umscript',
  'pointman',
  'secdev',
  'analytic',
  'log',
  'cnzz',
  'pagead',
  'waterMark',
  'WaterMark',
  'watermark',
  'monitor',
];

window.checkPageHeaders = function checkPageHeaders() {
  var req = new XMLHttpRequest();
  req.open('GET', document.location.href, false);
  req.send(null);
  var headers = req.getAllResponseHeaders().toLowerCase();
  console.log('headers:\n' + headers);
};

const BLOCK_WORDS = [
  // 'log',
  'googleads',
  'analytic',
];

window.listScripts = function listScripts() {
  [].slice.call(document.querySelectorAll('script'))
    .forEach(function(script) {
      log(script.src);
    });
  performance.getEntries();
};

window.fuckAdScript = function fuckAdScript() {
  if (location.search.indexOf('noscripter') === -1) {
    setInterval(function() {
      [].slice.call(document.querySelectorAll('script')).forEach(function(script) {
        var src = script.src;
        stupidScripts.forEach(function(s) {
          if (src.indexOf(s) > -1) {
            script.remove();
            log('remove script:' + src, 'error');
          }
        });
      });
    }, 1000);
  }
};

// fuckAdScript();

window.removeCnzz = function removeCnzz() {
  [].slice.call(document.querySelectorAll('.cnzz_block')).forEach(el => {
    el.classList.remove('cnzz_block');
  });
};

// removeCnzz();

function log(message, type) {
  var style = 'font-size: 0.785rem; font-weight: bold; padding: 5px 20px;; width: 100%; line-height: 40px;';
  switch (type) {
    case undefined:
      style += 'color: white; background: blue;';
      break;
    case 'error':
      style += 'color: white; background: red;';
      break;
    case 'success':
      style += 'color: white; background: green;';
      break;
  }
  console.log(`%c ${message}`, style);
}

window._goTop = function goTop() {
  const btn = document.createElement('button');
  btn.style.background = 'lime';
  btn.style.width = '50px';
  btn.style.height = '50px';
  btn.style.display = 'block';
  btn.style.position = 'fixed';
  btn.style['border-radius'] = '50%';
  btn.style.bottom = '10px';
  btn.style.right = '10px';
  btn.style.color = 'blue';
  btn.innerText = 'TOP';
  btn.setAttribute('id', 'noscripterTop');
  btn.onclick = function() {
    window.scroll(0, 0);
  };
  document.body.appendChild(btn);
};

var BLACKLIST = [{
  hostname: 'www.aliway.com',
  url: [
    'commonAjax.php?action=log'
  ]
}, {
  hostname: 'zhihu.com',
  url: [
    'logs'
  ]
}, {
  hostname: 'casalemedia'
}];

function injectNspLink() {
  var a = document.createElement('a');
  a.setAttribute('id', 'sandboxNspLink');
  a.setAttribute('target', '_blank');
  a.href = 'http://sandbox.alibaba-inc.com/#/reports/nsp';
  a.innerText = 'NSP';
  a.style = `color: red;
    font-size: 32px;
    font-weight: bold;
    position: fixed;
    top: 50%;
    right: 20px;
    z-index: 99999999;
    background: red;
    color: white;
    border: 1px solid #CCC;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    border-radius: 20%;
    width: 60px;
    box-shadow: 2px 2px 28px 1px rgba(230,20,20,0.75);
    text-decoration: none !important;
  `;
  document.body.prepend(a);
}

function injectAnimateCss(cb) {
  var a = document.createElement('link');
  a.setAttribute('rel', 'stylesheet');
  a.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css');
  document.head.appendChild(a);
  cb();
}

function openInNewTab() {
  log('openInNewTab start');
  var links = document.querySelectorAll('a');
  links = [].slice.call(links);
  links.forEach(link => {
    link.setAttribute('target', '_blank');
    var newLink = fuckStupidParams(link.getAttribute('href'), 'spm', true);
    link.setAttribute('href', newLink);
  });
  log('openInNewTab end');
}

function tabOpenAllLinks() {
  var links = document.querySelectorAll('a');
  [].slice.call(links).forEach(link => {
    link.onclick = function(e) {
      e.preventDefault();
      open(e.target.href);
    };
  });
}

/**
 * 获取应用 Owner 信息
 */
function fetchNspOwner(vuls) {
  var queryVulApi = '/api/application.getAppFlawDetail?params=';

  function makeReq(vul) {
    return new Promise(function(resolve, reject) {
      fetch(
        queryVulApi + JSON.stringify(vul), {
          credentials: 'include'
        }
      )
        .then(data => {
          data.json()
            .then(d => {
              var result = d.result;
              var nsp = result.nsp;
              var owner = JSON.parse(result.users).owner[0].firstName;
              var s0 = 0;
              var s1 = 0;
              var s2 = 0;
              var s3 = 0;
              var s4 = 0;
              nsp.forEach(nsp => {
                if (nsp.vul_actual_overall_rank.indexOf('S0') > -1) {
                  s0++;
                } else if (nsp.vul_actual_overall_rank.indexOf('S1') > -1) {
                  s1++;
                } else if (nsp.vul_actual_overall_rank.indexOf('S2') > -1) {
                  s2++;
                } else if (nsp.vul_actual_overall_rank.indexOf('S3') > -1) {
                  s3++;
                } else if (nsp.vul_actual_overall_rank.indexOf('S4') > -1) {
                  s4++;
                }
              });
              resolve({
                owner,
                nspTotal: nsp.length,
                s0,
                s1,
                s2,
                s3,
                s4
              });
            })
            .catch(e => {
              reject(e);
            });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  Promise.all(
    vuls.map(vul => {
      return makeReq(vul);
    })
  ).then(data => {
    log(`FED TOP3 Vulnerable Apps Owners ${JSON.stringify(data)}`);
  }).catch(e => {
    log(e, 'error');
  });
}

function customNspTable() {
  var nspTopTable = document.querySelectorAll('table')[0];
  var timer;
  if (nspTopTable) {
    log('nspTopTable ready', 'success');
    clearTimeout(timer);
    openInNewTab();
    var btn = document.createElement('button');
    btn.innerText = '只看 FED 应用';
    document.querySelector('.panel-heading').appendChild(btn);
    var state;
    var originalHTML;
    btn.addEventListener('click', function() {
      var result = customNsp(nspTopTable, state, btn, originalHTML, fetchNspOwner);
      state = result.state;
      originalHTML = result.originalHTML;
    });
    tabOpenAllLinks();
  } else {
    log('trying customNspTable', 'error');
    timer = setTimeout(customNspTable, 1000);
  }
}

function blockRequest() {
  (function(open) {
    XMLHttpRequest.prototype.open = function(method, currentUrl, isAsync, user, pass) {
      var blocked = false;
      for (var j = 0, len = BLOCK_WORDS.length; j < len; j++) {
        if (currentUrl.indexOf(BLOCK_WORDS[j]) > -1) {
          blocked = true;
          break;
        }
      }
      if (!blocked) {
        for (var i = 0, l = BLACKLIST.length; i < l; i++) {
          var temp = BLACKLIST[i];
          var hostname = temp.hostname;
          var url = temp.url;
          if (location.hostname.indexOf(hostname) > -1 && url && url.length > 0) {
            for (var j = url.length - 1; j > -1; j--) {
              if (currentUrl.indexOf(url[j]) > -1) {
                blocked = true;
                break;
              }
            }
            if (blocked) {
              break;
            }
          }
        }
      }
      if (blocked) {
        log(currentUrl + ' blocked', 'error');
        this.abort();
      } else {
        log(currentUrl + ' passthrough', 'success');
        open.call(this, method, currentUrl, isAsync, user, pass);
      }
    };
  })(XMLHttpRequest.prototype.open);
}

/**
 * @param {HTMLDOMElement} nspTopTable
 * @param {Boolean} state -- false | undefined, not show custom table
 * @param {HTMLDOMElement} btn
 * @param {String} originalHTML
 * @param {Function} fetchNspOwner -- callback function
 * @return {Boolean} state
 */
function customNsp(nspTopTable, state, btn, originalHTML, fetchNspOwner) {
  var head = nspTopTable.querySelector('thead');
  var body = nspTopTable.querySelector('tbody');
  var trs = body.querySelectorAll('tr');
  trs = [].slice.call(trs);

  if (state) {
    btn.style.color = '';
    nspTopTable.innerHTML = originalHTML;
    state = false;
    log('normal nsp table');
  } else {
    btn.style.color = 'red';
    originalHTML = nspTopTable.innerHTML;

    var count = 0;
    var fedVuls = [];
    trs.forEach(tr => {
      var l = tr.querySelector('a');
      l.setAttribute('href', l.href);
      l.setAttribute('target', '_blank');
      if (tr.innerHTML.indexOf('淘宝') > -1 /* && tr.innerHTML.indexOf('异常') === -1*/) {
        count++;
        tr.querySelector('td').innerText = count;
        switch (count) {
          case 1:
            tr.style.background = 'RED';
            tr.style.color = 'WHITE !important';
            tr.style['font-weight'] = 'bolder';
            tr.querySelector('a').style = 'color: white !important; font-weight: bolder;';
            var tds = tr.querySelectorAll('td');
            var vul = {};
            tds.forEach((td, idx) => {
              td.style = 'color: white !important; font-weight: bolder;';
              // 应用名
              switch (idx) {
                case 1:
                  vul.appName = td.innerText;
                  break;
                default:
                  break;
              }
            });
            fedVuls.push(vul);
            break;
          case 2:
            tr.style.background = '#FE5200';
            tr.style.color = 'WHITE !important';
            tr.style['font-weight'] = 'bolder';
            tr.querySelector('a').style = 'color: white !important; font-weight: bolder;';
            var tds = tr.querySelectorAll('td');
            var vul = {};
            tds.forEach((td, idx) => {
              td.style = 'color: white !important; font-weight: bolder;';
              // 应用名
              switch (idx) {
                case 1:
                  vul.appName = td.innerText;
                  break;
                default:
                  break;
              }
            });
            fedVuls.push(vul);
            break;
          case 3:
            tr.style.background = 'ORANGE';
            tr.style.color = 'WHITE !important';
            tr.style['font-weight'] = 'bolder';
            tr.querySelector('a').style = 'color: white !important; font-weight: bolder;';
            var tds = tr.querySelectorAll('td');
            var vul = {};
            tds.forEach((td, idx) => {
              td.style = 'color: white !important; font-weight: bolder;';
              // 应用名
              switch (idx) {
                case 1:
                  vul.appName = td.innerText;
                  break;
                default:
                  break;
              }
            });
            fedVuls.push(vul);
            break;
          default:
            // TODO: 测试
            if (count < 10) {
              var tds = tr.querySelectorAll('td');
              var vul = {};
              tds.forEach((td, idx) => {
                // 应用名
                switch (idx) {
                  case 1:
                    vul.appName = td.innerText;
                    break;
                  default:
                    break;
                }
              });
            }
            break;
        }
      } else {
        body.removeChild(tr);
      }
    });

    state = true;
    log('custom FED table', 'success');
    log(`top 3 ${JSON.stringify(fedVuls)}`, 'error');

    fetchNspOwner(fedVuls);
  }
  return {
    state,
    originalHTML
  };
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * remove stupid querystring params appended in links
 * @param {string} url -- url to be stripped of params
 * @param {string} name -- parameter name to be stripped
 * @param {boolean} getValue -- just return new url or not
 */
function fuckStupidParams(url, name, getValue) {
  var reg = new RegExp('([?&])' + name + '(=([^&#]*)|&|#|$)');
  var oldUrl = url || location.href;
  if (!reg.test(oldUrl)) {
    if (getValue) {
      return oldUrl;
    }
    return;
  }
  var url = oldUrl.replace(reg, function(match) {
    if (match[0] === '?') {
      return '?';
    }
    return '';
  });
  url = url.replace('?&', '?');
  if (url.indexOf('?') === url.length - 1) {
    url = url.slice(0, url.indexOf('?'));
  }
  if (getValue) {
    return url;
  }
  location.replace(url);
  log('fuck spm parameters', 'success');
}

fuckStupidParams(undefined, 'spm', false);
fuckStupidParams(undefined, 'utm_source', false);
fuckStupidParams(undefined, 'utm_campaign', false);
fuckStupidParams(undefined, 'utm_medium', false);
fuckStupidParams(undefined, 'utm_content', false);

(function removeTwitterOverlay() {
  if (location.hostname.indexOf('twitter') > -1) {
    function removeOverlay() {
      var elList = [
        '#sms-codes-dialog',
        '#leadgen-confirm-dialog',
        '#auth-webview-dialog',
        '#media-edit-dialog',
        '.modal-overlay',
        '#activity-popup-dialog',
        '#copy-link-to-tweet-dialog',
        '#embed-tweet-dialog',
        '#why-this-ad-dialog',
        '#login-dialog',
        '#signup-dialog',
        '#promptbird-modal-prompt',
        '#ui-walkthrough-dialog',
        '#location-picker-dialog',
        '#block-user-dialog',
        '#quick-promote-dialog',
        '#goto-user-dialog',
        '#trends_dialog',
        '.PermalinkOverlay',
        '.PermalinkOverlay-with-background',
      ];
      elList.forEach(tag => {
        var els = document.querySelectorAll(tag);
        els.forEach(el => el.remove());
      });
    }
    window.removeTwitterOverlay = removeOverlay;
  }
})();

(function() {


  var hostname = location.hostname;

  log('secret power of noscripter');

  blockRequest();

  if (hostname.indexOf('typescriptlang') > -1) {
    var typescriptlangNav = document.getElementById('main-nav');
    typescriptlangNav.style.position = 'fixed';
    typescriptlangNav.style.left = '10px';
    typescriptlangNav.style.top = '100px';
    typescriptlangNav.style.border = '1px solid #DDD';
  } else if (hostname.indexOf('alimovie.taobao.net') > -1) {
    var alimovieContainer = document.querySelectorAll('.movie-detail')[0];
    var alimovieImg = document.querySelectorAll('.movie-detail img')[0].src;
    var alimovieFtpLink = 'ftp://10.218.145.15/' + alimovieImg.split('file=')[1];
    var alimovieFtpLinkSegs = alimovieFtpLink.split('/');
    alimovieFtpLinkSegs.splice('-1');
    alimovieFtpLink = alimovieFtpLinkSegs.join('/');
    var alimovieFtpEl = document.createElement('a');
    alimovieFtpEl.href = alimovieFtpLink;
    alimovieFtpEl.target = '_blank';
    alimovieFtpEl.innerText = 'FTP 下载地址';
    alimovieFtpEl.style = `
      width: 100%;
      height: 20px;
      color: green;
      font-size: 1.8rem;
      font-weight: bold;
      display: inline-block;
      text-align: center;
    `;
    alimovieContainer.prepend(alimovieFtpEl);
    console.log('%c alimovie ftp link appended, hacked by noscripter', 'color: red; font-size: 2rem;');
  } else if (hostname.indexOf('www.aliway.com') > -1 || hostname.indexOf('work.alibaba-inc.com') > -1) {
    var aliwayContent = document.querySelectorAll('.tpc_content');
    aliwayContent.forEach(el => {
      el.style = bg;
    });
    document.querySelectorAll('*').forEach(el => {
      el.classList.remove('watermark');
    });
    document.querySelectorAll('.score').forEach(el => {
      el.style = bg;
    });
  } else if (hostname.indexOf('web.npm.alibaba-inc.com') > -1) {
    var alinpmName = location.pathname.split('package')[1];
    var alinpmRegistry = `http://registry.npm.alibaba-inc.com${alinpmName}`;
    var alinpmRegistryLatest = `http://registry.npm.alibaba-inc.com${alinpmName}/latest`;
    var alinpmRepo = document.querySelectorAll('.pack-repo')[0];
    var aliRegistryLink = document.createElement('a');
    var aliRegistryLatestLink = document.createElement('a');
    aliRegistryLink.style.color = 'red';
    aliRegistryLink.style['font-weight'] = 'bold';
    aliRegistryLink.style.margin = '0 20px';
    aliRegistryLink.href = alinpmRegistry;
    aliRegistryLink.target = '_blank';
    aliRegistryLink.innerText = 'Registry';
    alinpmRepo.appendChild(aliRegistryLink);
    aliRegistryLatestLink.style.color = 'red';
    aliRegistryLatestLink.style['font-weight'] = 'bold';
    aliRegistryLatestLink.href = alinpmRegistryLatest;
    aliRegistryLatestLink.target = '_blank';
    aliRegistryLatestLink.innerText = 'RegistryLatest';
    alinpmRepo.appendChild(aliRegistryLatestLink);
  } else if (hostname.indexOf('google.com') > -1) {
    if (google && google.logUrl) {
      delete google.logUrl;
      log('delete google.logUrl');
    }
    // remove google redirect
    log('I\'ll hack google');
    var links = document.links;
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var attrs = [].slice.call(link.attributes);
      var toRemoveAttrs = [];
      attrs.forEach(attr => {
        if (attr.name.indexOf('data-') > -1 ||
          attr.name.indexOf('jsaction') > -1 ||
          attr.name.indexOf('on') > -1) {
          toRemoveAttrs.push(attr.name);
        }
      });
      toRemoveAttrs.forEach(name => {
        log(name, 'success');
        links[i].removeAttribute(name);
      });
    }
  } else if (hostname.indexOf('sandbox.alibaba-inc.com') > -1) {
    // custom midway-sandbox nsp report for weekly report
    if (location.hash.indexOf('nsp') > -1) {
      log('// generate weekly report');
      customNspTable();
    }
    if (location.href.indexOf('footer') > -1) {
      return;
    }
    injectNspLink();
    injectAnimateCss(function() {
      var s = document.querySelector('#sandboxNspLink');
      s.classList.add('animated');
      s.classList.add('infinite');
      s.classList.add('pulse');
      s.onmouseenter = function() {
        s.classList.remove('infinite');
      };
      s.onmouseleave = function() {
        s.classList.add('infinite');
      };
    });
  } else if (hostname.indexOf('zhihu.com') > -1) {
    var links = document.querySelectorAll('a');
    [].slice.call(links).forEach(link => {
      if (link.href.indexOf('link.zhihu.com') > -1) {
        link.setAttribute('href', decodeURIComponent(
          link.href.split('target=')[1]
        ));
        log('replace zhihu link:' + link, 'success');
      }
    });
    setInterval(function() {
      log('scan zhihu script');
      var scripts = document.querySelectorAll('script');
      scripts = [].slice.call(scripts);
      scripts.forEach(script => {
        if (script.src.indexOf('raven') > -1 ||
          script.src.indexOf('za-js-sdk') > -1
        ) {
          script.remove();
          log('fuck zhihu:' + script.src, 'error');
        }
      });
    }, 3000);
  } else if (hostname.indexOf('risingstack.com') > -1) {
    [].slice.call(document.querySelectorAll('.click-to-tweet')).forEach(el => {
      el.remove();
    });
    [].slice.call(document.querySelectorAll('.trace-in-text-cta')).forEach(el => {
      el.remove();
    });
    [].slice.call(document.querySelectorAll('.click-to-tweet-text')).forEach(el => {
      el.remove();
    });
  } else if (hostname.indexOf('sitepoint') > -1) {
    // close modal
    document.querySelector('.close-reveal-modal').click();
    [].slice.call(document.querySelectorAll('.widget')).forEach(w => {
      w.remove();
    });
  } else if (hostname.indexOf('local.yh.daily.taobao.ne') > -1) {
    // TODO: inject arbitrary test data
  } else {
    // Do something else.
  }
})();

const scripts = {
  rxjs: 'https://cdn.bootcss.com/rxjs/5.5.8/Rx.min.js'
};

function inject(s) {
  var scr = document.createElement('script');
  scr.src = scripts[s] || s;
  document.head.appendChild(scr);
}

window.inject = inject;

(function() {
  if (false) {
    var OriginTitile = document.title,
      titleTime;
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        document.title = '死鬼去哪里了！';
        clearTimeout(titleTime);
      } else {
        document.title = '(つェ⊂)咦!又好了!';
        titleTime = setTimeout(function() {
          document.title = OriginTitile;
        }, 2000);
      }
    });
  }
})();

if (location.host.indexOf('www.xia1ge.com') > -1) {
  String.prototype.replace = null;
  window.setInterval = null;
}

// fuck alimonitor
window._AliMonitor_Common_Loaded = true;
