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

  // 3) 给站内链接补参数（支持 page.html#anchor：参数放在 # 前面）
  var HTML_RE = /^[^\/:?#]+\.html(\?.*)?$/i;
  function fixHref(h){
    if (!h) return h;
    if (/^(https?:|mailto:|tel:|javascript:|#|\/\/)/i.test(h)) return h;
    var hash = '';
    var hi = h.indexOf('#');
    if (hi >= 0) { hash = h.slice(hi); h = h.slice(0, hi); }
    if (!HTML_RE.test(h)) return h + hash;
    if (/[?&]sharecode=/.test(h)) return h + hash;
    return h + (h.indexOf('?') >= 0 ? '&' : '?') + 'sharecode=' + encodeURIComponent(code) + hash;
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

  /* 5) 悬浮键：回到顶部 / 回主页（所有页面共用）
     长页面翻到底一直往回滑太累；滑动手势在某些容器上也会被吃掉，
     所以固定两个实体按钮，任何时候点一下就行。 */
  function initFab(){
    if (document.getElementById('tftFab')) return;
    var path = location.pathname;
    var isHome = /\/$/.test(path) || /index\.html$/i.test(path);

    var st = document.createElement('style');
    st.id = 'tftFabStyle';
    st.textContent =
      '#tftFab{position:fixed;right:14px;bottom:18px;z-index:95;display:flex;flex-direction:column;gap:10px}'
      + '#tftFab button{width:46px;height:46px;border-radius:50%;border:1px solid rgba(240,181,68,.42);'
      + 'background:rgba(24,31,45,.9);color:#f0b544;font-size:19px;line-height:1;font-family:inherit;'
      + 'display:flex;align-items:center;justify-content:center;cursor:pointer;'
      + 'backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 8px 22px rgba(0,0,0,.5);'
      + 'transition:transform .15s,opacity .2s}'
      + '#tftFab button:active{transform:scale(.92)}'
      + '#tftFab .fab-top{opacity:0;pointer-events:none;transform:translateY(8px)}'
      + '#tftFab .fab-top.on{opacity:1;pointer-events:auto;transform:none}'
      + '#tftFab .fab-home{font-size:17px}'
      + '@media (max-width:520px){#tftFab{right:11px;gap:8px}#tftFab button{width:43px;height:43px}}';
    document.head.appendChild(st);

    var fab = document.createElement('div');
    fab.id = 'tftFab';
    fab.innerHTML =
      '<button class="fab-top" type="button" aria-label="回到顶部" title="回到顶部">↑</button>'
      + (isHome ? '' : '<button class="fab-home" type="button" aria-label="回主页" title="回主页">⌂</button>');
    document.body.appendChild(fab);

    var topBtn = fab.querySelector('.fab-top');
    var homeBtn = fab.querySelector('.fab-home');

    topBtn.addEventListener('click', function(){
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); }
      catch(e){ window.scrollTo(0, 0); }
    });
    if (homeBtn) homeBtn.addEventListener('click', function(){
      window.tftGo('./index.html');
    });

    var raf = 0;
    function sync(){
      raf = 0;
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      topBtn.classList.toggle('on', y > 300);
      /* 底部有「安装到桌面」条时把悬浮键抬上去，别互相压住 */
      var off = 0;
      var bar = document.getElementById('pwaInstallBar');
      if (bar && bar.getBoundingClientRect().height > 0){
        var r = bar.getBoundingClientRect();
        if (r.bottom > window.innerHeight - 140) off = r.height + 16;
      }
      fab.style.bottom = (18 + off) + 'px';
    }
    function onScroll(){ if (!raf) raf = requestAnimationFrame(sync); }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    sync();
    setTimeout(sync, 1200);
    setTimeout(sync, 3000);
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initFab);
  } else {
    initFab();
  }
})();
