/* 云顶助手：Service Worker 注册 + 「装到桌面/手机主屏」引导（按设备给对应步骤） */
(function(){
  if (!('serviceWorker' in navigator)) return;

  if (location.protocol === 'https:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  // 已经是独立应用形态，不再打扰
  var standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (standalone) return;

  var ua = navigator.userAgent || '';
  var isWeixin = /MicroMessenger/i.test(ua);
  var isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isIOSChrome = isIOS && /CriOS|FxiOS|EdgiOS/i.test(ua);
  var isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);

  var deferred = null, bar = null;
  var DISMISS_KEY = 'tft_install_dismiss';

  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    deferred = e;
    scheduleShow();
  });
  window.addEventListener('appinstalled', function(){
    try { localStorage.setItem(DISMISS_KEY + '_forever', '1'); } catch(e){}
    removeBar();
  });
  /* 已安装的（Chrome/Edge 可直接查到）绝不再提示 */
  if (navigator.getInstalledRelatedApps) {
    navigator.getInstalledRelatedApps().then(function(apps){
      if (apps && apps.length) {
        try { localStorage.setItem(DISMISS_KEY + '_forever', '1'); } catch(e){}
        removeBar();
      }
    }).catch(function(){});
  }

  // 登录门盖在最上层（z-index 9999），等它消失再提示
  function afterGate(cb){
    if (!document.getElementById('authGate')) return cb();
    var n = 0;
    var iv = setInterval(function(){
      if (!document.getElementById('authGate')) { clearInterval(iv); cb(); }
      else if (++n > 150) { clearInterval(iv); }   // 最多等 60 秒
    }, 400);
  }

  function dismissed(){
    try {
      /* 安装过（或关过两次）就永久不再弹，只留 appinstalled 兼底 */
      if (localStorage.getItem(DISMISS_KEY + '_forever')) return true;
      var n = parseInt(localStorage.getItem(DISMISS_KEY + '_n') || '0', 10);
      if (n >= 2) return true;
      var t = parseInt(localStorage.getItem(DISMISS_KEY) || '0', 10);
      return t && (Date.now() - t < 72 * 3600 * 1000);   // 关掉后隔三天再提示
    } catch(e){ return false; }
  }
  function markDismissed(){
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
      var n = parseInt(localStorage.getItem(DISMISS_KEY + '_n') || '0', 10);
      localStorage.setItem(DISMISS_KEY + '_n', String(n + 1));
    } catch(e){}
  }

  function scheduleShow(){
    if (dismissed()) return;
    afterGate(function(){
      setTimeout(function(){
        if (!bar) build();
      }, deferred ? 800 : 2500);
    });
  }

  // 判断该显示哪种文案
  function scenario(){
    if (isWeixin) return 'weixin';
    if (isIOSChrome) return 'ios-other';
    if (isIOS) return 'ios';
    if (deferred) return 'native';
    if (/Android/i.test(ua)) return 'android';
    return 'desktop';
  }

  var COPY = {
    'native':     ['把「云顶助手」装到桌面', '独立窗口打开，像软件一样双击图标', '安装'],
    'weixin':     ['微信里装不了桌面图标', '点右上角 ··· → 在浏览器打开，再添加到主屏幕', '看步骤'],
    'ios':        ['添加到手机桌面', '点下方「分享」→ 选「添加到主屏幕」', '看步骤'],
    'ios-other':  ['用 Safari 才能添加', '复制链接到 Safari 打开，再 分享 → 添加到主屏幕', '看步骤'],
    'android':    ['添加到手机桌面', '点浏览器右上角菜单 →「添加到主屏幕」', '看步骤'],
    'desktop':    ['把「云顶助手」装到桌面', '在浏览器地址栏右侧点「安装」图标，或 Edge 菜单 → 应用', '看步骤']
  };

  function build(){
    var key = scenario();
    var c = COPY[key] || COPY.desktop;
    bar = document.createElement('div');
    bar.id = 'pwaInstallBar';
    bar.innerHTML = '<img src="app-icon-192.png" alt="">' +
      '<div class="ptxt"><b></b><span></span></div>' +
      '<button class="pgo"></button><button class="pskip">\u00d7</button>';
    bar.querySelector('.ptxt b').textContent = c[0];
    bar.querySelector('.ptxt span').textContent = c[1];
    var go = bar.querySelector('.pgo');
    go.textContent = c[2];

    if (!document.getElementById('pwaInstallStyle')) {
      var st = document.createElement('style');
      st.id = 'pwaInstallStyle';
      st.textContent = [
        '#pwaInstallBar{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);',
        'display:flex;align-items:center;gap:12px;z-index:960;max-width:520px;',
        'background:rgba(18,24,36,.97);border:1px solid rgba(240,181,68,.45);border-radius:14px;',
        'padding:10px 12px 10px 14px;box-shadow:0 10px 34px rgba(0,0,0,.55);',
        'font-family:"PingFang SC","Microsoft YaHei",system-ui,sans-serif;animation:pwaIn .3s ease;}',
        '#pwaInstallBar img{width:38px;height:38px;border-radius:9px;flex:0 0 auto;}',
        '#pwaInstallBar .ptxt{display:flex;flex-direction:column;line-height:1.4;min-width:0;}',
        '#pwaInstallBar .ptxt b{color:#f5d888;font-size:13px;font-weight:600;}',
        '#pwaInstallBar .ptxt span{color:#8b96ad;font-size:11.5px;}',
        '#pwaInstallBar .pgo{border:0;border-radius:9px;padding:8px 16px;cursor:pointer;white-space:nowrap;',
        'background:linear-gradient(120deg,#f6d67c,#f0b544);color:#241a04;font-size:13px;font-weight:700;font-family:inherit;}',
        '#pwaInstallBar .pskip{border:0;background:transparent;color:#5c6478;font-size:17px;cursor:pointer;padding:2px 4px;font-family:inherit;}',
        '@keyframes pwaIn{from{opacity:0;transform:translate(-50%,14px);}to{opacity:1;transform:translate(-50%,0);}}',
        '@media (max-width:560px){#pwaInstallBar{width:calc(100% - 20px);bottom:12px;gap:9px;}',
        '#pwaInstallBar .ptxt span{font-size:11px;}}'
      ].join('');
      document.head.appendChild(st);
    }
    document.body.appendChild(bar);

    go.onclick = function(){
      if (key === 'native' && deferred) {
        deferred.prompt();
        deferred.userChoice.then(function(r){ if (r && r.outcome === 'accepted') removeBar(); }).catch(function(){});
        return;
      }
      // 其余场景：跳到图文步骤页，照着点就行（务必带上分享码，否则会显示「链接不完整」）
      markDismissed();
      var sc = window.TFT_SHARECODE || '';
      location.href = 'install.html' + (sc ? '?sharecode=' + encodeURIComponent(sc) : '');
    };
    bar.querySelector('.pskip').onclick = removeBar;
  }

  function fallbackCopy(text, cb){
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-1000px;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch(e){}
    ta.remove();
    cb();
  }

  function removeBar(){
    if (bar) { bar.remove(); bar = null; }
    markDismissed();
  }

  // 安卓/桌面等 beforeinstallprompt 会主动触发；其余场景（iOS/微信）没有该事件，直接按场景提示
  if (isWeixin || isIOS || /Android/i.test(ua)) {
    scheduleShow();
  } else {
    // 桌面浏览器：给 beforeinstallprompt 一点机会，没有就按菜单安装提示
    setTimeout(function(){ if (!bar && !deferred) scheduleShow(); }, 4000);
  }
})();
