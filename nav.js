/* 云顶助手：分享码守护
   这个站点必须带 ?sharecode= 才能访问（缺了会显示「链接不完整」）。
   本脚本保证：进入任意页面后，站内跳转、刷新、加到主屏幕都不会丢这个参数。 */
(function(){
  var KEY = 'tft_sharecode';
  var DEFAULT_CODE = 'WMGGSW3OBW';

  function readStore(){
    try { return localStorage.getItem(KEY) || sessionStorage.getItem(KEY) || ''; } catch(e){ return ''; }
  }
  function writeStore(v){
    try { localStorage.setItem(KEY, v); } catch(e){}
    try { sessionStorage.setItem(KEY, v); } catch(e){}
  }

  // 1) 从地址栏取码，取到就记住
  var code = '';
  try {
    var m = location.search.match(/[?&]sharecode=([^&#]+)/);
    if (m) code = decodeURIComponent(m[1]);
  } catch(e){}
  if (code) writeStore(code);
  else code = readStore();

  // 2) 万一码也丢了，用默认码兜底跳回来（比显示「链接不完整」强）
  if (!code && location.protocol.indexOf('http') === 0) {
    var guard = 'tft_guard_' + location.pathname;
    var tried = false;
    try { tried = sessionStorage.getItem(guard) === '1'; } catch(e){}
    if (!tried) {
      try { sessionStorage.setItem(guard, '1'); } catch(e){}
      location.replace(location.pathname + '?sharecode=' + DEFAULT_CODE);
      return;
    }
    code = DEFAULT_CODE;
  }
  if (!code) code = DEFAULT_CODE;

  window.TFT_SHARECODE = code;
  window.TFT_DEFAULT_SHARECODE = DEFAULT_CODE;

  // 3) 给站内链接补参数
  var HTML_RE = /^[^\/:?#]+\.html(\?.*)?$/i;
  function fixHref(h){
    if (!h) return h;
    if (/^(https?:|mailto:|tel:|javascript:|#|\/\/)/i.test(h)) return h;
    if (!HTML_RE.test(h)) return h;
    if (/[?&]sharecode=/.test(h)) return h;
    return h + (h.indexOf('?') >= 0 ? '&' : '?') + 'sharecode=' + encodeURIComponent(code);
  }
  function patchLinks(){
    var as = document.querySelectorAll('a[href]');
    for (var i = 0; i < as.length; i++){
      var h = as[i].getAttribute('href');
      var n = fixHref(h);
      if (n && n !== h) as[i].setAttribute('href', n);
    }
  }

  // 4) 统一生成「完整分享链接」，供复制按钮使用
  window.tftShareLink = function(){
    var origin = location.origin === 'null' ? '' : location.origin;
    return origin + '/?sharecode=' + encodeURIComponent(code || DEFAULT_CODE);
  };
  // 带参数跳转
  window.tftGo = function(page){
    location.href = fixHref(page);
  };

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', patchLinks);
  } else {
    patchLinks();
  }
  // 有些链接是后渲染出来的，晚一点再补一次
  setTimeout(patchLinks, 600);
  setTimeout(patchLinks, 2000);
})();
