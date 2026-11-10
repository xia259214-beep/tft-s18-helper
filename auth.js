/* ============================================================
   云顶助手 · 账号模块（云端版）
   注册 = 邮箱验证码 + 密码；登录 = 密码 或 邮箱验证码
   棋盘存档存云端数据库（tft_profiles，按账号隔离）
   换设备 / 换浏览器：登录同一账号，进度自动跟上
   ============================================================ */
(function () {
  /* ---------- 多语言取词（i18n.js 在本文件之前加载） ---------- */
  const T = k => (window.tftT ? window.tftT(k) : k);

  /* ---------- 云服务配置（来自 activate 的 publicConfig） ---------- */
  const CLOUD = {
    endpoint: 'https://tft-s18-helper.app.workbuddy.host',
    oauthRelayBaseUrl: 'https://www.workbuddy.cn/v2/as/genie-baas/oauth',
    publishableKey: 'wbpk_UqlwTlB9IcnTvgEVE0lAdH_VmvW6qc8a6FKk12573AgxtFzwcCa8NRE'
  };
  const SDK_URL = 'https://cdn.jsdelivr.net/npm/@tencent-ai/workbuddy-cloud-sdk@dev/lib/index.global.js';
  const TABLE = 'tft_profiles';

  /* ---------- SDK 动态加载 ---------- */
  let cloudPromise = null;
  function loadCloud() {
    if (cloudPromise) return cloudPromise;
    cloudPromise = new Promise((resolve, reject) => {
      if (window.WorkBuddyCloud && window.WorkBuddyCloud.createWorkBuddyCloud) {
        resolve(makeCloud());
        return;
      }
      const s = document.createElement('script');
      s.src = SDK_URL;
      s.onload = () => {
        try { resolve(makeCloud()); } catch (e) { reject(e); }
      };
      s.onerror = () => reject(new Error('云服务脚本加载失败，请检查网络后刷新'));
      document.head.appendChild(s);
      setTimeout(() => { if (!window.WorkBuddyCloud) reject(new Error('云服务连接超时，请检查网络后刷新')); }, 20000);
    });
    return cloudPromise;
  }
  function makeCloud() {
    return window.WorkBuddyCloud.createWorkBuddyCloud({
      endpoint: CLOUD.endpoint,
      oauthRelayBaseUrl: CLOUD.oauthRelayBaseUrl,
      publishableKey: CLOUD.publishableKey
    });
  }

  /* ---------- 本地数据缓存（同步外观 + 防抖上云） ---------- */
  let cache = {};          // 云端拉回的个人数据
  let myRow = null;        // 云端行（含 id），null 表示还没建行
  let me = null;           // { uid, email, nick }
  let dirty = false, flushTimer = null;

  function dataAll() { return cache; }
  function dataGet(key, dflt) { return cache[key] === undefined ? dflt : cache[key]; }
  function dataSet(key, val) {
    cache[key] = val;
    queueFlush();
  }
  function queueFlush() {
    dirty = true;
    clearTimeout(flushTimer);
    flushTimer = setTimeout(flush, 1200);
  }
  async function flush() {
    if (!dirty || !cloud || !me) return;
    dirty = false;
    try {
      const payload = { data: cache, updated_at: new Date().toISOString() };
      if (myRow && myRow.id) {
        const { data, error } = await cloud.database.from(TABLE).update(payload).eq('id', myRow.id).select();
        if (error) { dirty = true; return; }
        if (Array.isArray(data) && data.length === 0) myRow = null; // 行没了，下次走 insert
      } else {
        const { data, error } = await cloud.database.from(TABLE).insert({ data: cache }).select();
        if (error) { dirty = true; return; }
        myRow = (data && data[0]) || null;
      }
    } catch (e) { dirty = true; }
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
  window.addEventListener('beforeunload', () => { if (dirty) flush(); });

  /* ---------- 云端账号操作 ---------- */
  let cloud = null;

  /* 第三方一键登录：跳到中转页授权，回来后由 boot() 里的回调处理收尾 */
  async function oauthSignIn(provider) {
    const err = document.getElementById('authErr');
    const go = document.getElementById('authGo');
    if (err) err.textContent = '';
    if (go) { go.disabled = true; go.textContent = T('a_wait'); }
    try {
      const r = await cloud.auth.signInWithOAuth({ provider, redirectTo: location.href });
      if (r.error) throw friendly(r.error, '登录跳转失败');
      const url = r.data && r.data.url;
      if (!url) throw new Error('没有拿到登录跳转地址');
      location.href = url;
    } catch (e) {
      if (err) err.textContent = e.message || '登录失败';
      if (go) { go.disabled = false; go.textContent = T('a_go_login'); }
    }
  }

  /* 从中转页跳回来：URL 上带着回调参数，交给 SDK 换会话 */
  async function handleOAuthReturn() {
    let q = null;
    try { q = new URLSearchParams(location.search); } catch (e) { return false; }
    if (!q || !q.get('code') || !q.get('state')) return false;
    let r = null;
    try {
      if (q.get('provider_id') === 'custom-oauth') r = await cloud.auth.handleOAuthCallback();
      else r = await cloud.auth.handleWechatWebCallback();
    } catch (e) { r = null; }
    /* 清掉地址栏里的回调参数，刷新后不会重复处理 */
    try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) {}
    return !!(r && r.data);
  }

  /* 把后端英文错误翻译成人话，并标出错误类型供界面判断 */
  function friendly(err, fallback) {
    const msg = (err && err.message) || '';
    const code = ((err && err.code) || '').toLowerCase();
    const kind = (err && err.kind) || '';
    let text = '', type = 'other';

    if (kind === 'network') {
      text = '网络没连上云端，检查一下网络再试';
    } else if (kind === 'rate-limited' || (err && err.status === 429)) {
      text = '操作太频繁了，等一分钟再试';
    } else if (kind === 'backend-unavailable') {
      text = '云端服务暂时不可用，稍等一会儿再试';
    } else if (code.includes('invalid_username_or_password') || /username|password incorrect/i.test(msg)) {
      type = 'noaccount';
      text = '云端没有这个邮箱的账号，或者密码不对。如果你之前是在旧版本注册的，那个账号没有同步到云端，需要重新注册一次。';
    } else if (code.includes('user_not_found') || /user not found|no such user/i.test(msg)) {
      type = 'noaccount';
      text = '云端没有这个邮箱的账号。之前旧版本注册的账号不会自动同步，请重新注册一次。';
    } else if (code.includes('already') || /already (registered|exists)|user_exists/i.test(msg)) {
      type = 'exists';
      text = '这个邮箱已经在云端注册过了，直接去「登录」就行';
    } else if (/verification.*(expire|invalid|wrong)|invalid.*(code|token)/i.test(msg)) {
      type = 'badcode';
      text = '验证码不对或者已经过期了，点「重新发送」拿一个新的';
    } else if (msg && !/^[\x00-\x7F]+$/.test(msg)) {
      text = msg;   // 后端已经是中文，直接用
    } else if (msg) {
      text = '出错了：' + msg + '（再试一次，或者把这句话发给我）';
    } else {
      text = fallback || '出错了，再试一次';
    }
    const e = new Error(text);
    e.type = type;
    e.raw = err;
    return e;
  }

  async function sendCode(email) {
    const sent = await cloud.auth.sendOtp({ email });
    if (sent.error) throw friendly(sent.error, '验证码发送失败');
    return sent.data; // { verificationId, isExistingUser }
  }
  async function register({ nick, email, pwd, pending }) {
    const done = await cloud.auth.verifyOtp({
      email: pending.email,
      verificationId: pending.verificationId,
      isExistingUser: pending.isExistingUser,
      token: pending.token,
      password: pending.isExistingUser ? undefined : pwd
    });
    if (done.error) throw friendly(done.error, '注册失败');
    return finishAuth(done.data && done.data.user, nick);
  }
  async function loginPwd({ email, pwd }) {
    const r = await cloud.auth.signInWithPassword({ email, password: pwd });
    if (r.error) throw friendly(r.error, '登录失败');
    return finishAuth(r.data && r.data.user, null);
  }
  async function loginOtp({ pending }) {
    const done = await cloud.auth.verifyOtp({
      email: pending.email,
      verificationId: pending.verificationId,
      isExistingUser: pending.isExistingUser,
      token: pending.token
    });
    if (done.error) throw friendly(done.error, '登录失败');
    return finishAuth(done.data && done.data.user, null);
  }
  async function resetPwd({ email, code, newPwd }) {
    const started = await cloud.auth.resetPasswordForEmail(email);
    if (started.error) throw friendly(started.error, '发送重置邮件失败');
    const done = await started.data.updateUser({ nonce: code, password: newPwd });
    if (done.error) throw friendly(done.error, '重置失败');
    return finishAuth(done.data && done.data.user, null);
  }
  async function logout() {
    try { if (cloud) await cloud.auth.signOut(); } catch (e) {}
    location.reload();
  }

  /* ---------- 登录后：拉云端存档 + 渲染 ---------- */
  async function finishAuth(user, nickInput) {
    if (!user) throw new Error('登录没有建立会话，请重试');
    const uid = user.id || user.uid || '';
    const email = user.email || '';
    await loadProfile(uid, email, nickInput);
    me = { uid, email, nick: dataGet('_nick', null) || email.split('@')[0] || '棋友' };
    onAuthed(me);
  }
  async function loadProfile(uid, email, nickInput) {
    cache = {};
    myRow = null;
    const { data, error } = await cloud.database.from(TABLE).select('*').limit(5);
    if (!error && Array.isArray(data)) {
      const mine = data.find(r => r.owner_id === uid) || data[0] || null;
      if (mine) { myRow = mine; cache = (mine.data && typeof mine.data === 'object') ? { ...mine.data } : {}; }
    }
    if (nickInput) cache._nick = nickInput;
    else if (!cache._nick && email) cache._nick = email.split('@')[0];
    // 昵称是新的，尽快写回
    if (nickInput || !myRow) { dirty = true; flush(); }
  }

  /* ---------- 门禁界面 ---------- */
  const CSS = `
  #authGate{position:fixed; inset:0; z-index:9999; display:flex; align-items:center; justify-content:center;
    background:radial-gradient(900px 500px at 50% 0%,#1b2337,#080b12 70%); padding:20px;}
  #authGate.hide{opacity:0; pointer-events:none; transition:opacity .35s;}
  .authcard{width:100%; max-width:392px; background:#141a26; border:1px solid #2a3247; border-radius:20px;
    padding:30px 26px 22px; box-shadow:0 30px 80px rgba(0,0,0,.6); font-family:"PingFang SC","Microsoft YaHei",system-ui,sans-serif;}
  .authbrand{text-align:center; margin-bottom:20px;}
  .authbrand h1{font-size:24px; letter-spacing:5px; font-weight:800; margin:0;
    background:linear-gradient(120deg,#f6d67c,#f0b544,#c98a2a); -webkit-background-clip:text; background-clip:text; color:transparent;}
  .authbrand p{color:#7d879e; font-size:12px; margin:8px 0 0; letter-spacing:1px;}
  .authtabs{display:flex; background:#0f141f; border:1px solid #232b3d; border-radius:12px; padding:4px; margin-bottom:18px;}
  .authtabs button{flex:1; padding:9px 0; border:0; border-radius:9px; background:transparent; color:#8b96ad;
    font-size:13px; cursor:pointer; font-family:inherit; transition:.15s;}
  .authtabs button.on{background:#1f2940; color:#f0b544; font-weight:600;}
  .authfield{margin-bottom:12px;}
  .authfield label{display:block; color:#828da4; font-size:11.5px; margin-bottom:6px; letter-spacing:.5px;}
  .authfield label .auth-tip{color:#5c6478; font-size:10.5px; letter-spacing:0; margin-left:6px;}
  .authfield input{width:100%; box-sizing:border-box; background:#0f141f; border:1px solid #262f44; color:#e8ecf4;
    border-radius:10px; padding:11px 12px; font-size:14px; font-family:inherit; outline:none;}
  .authfield input:focus{border-color:#f0b544; box-shadow:0 0 0 3px rgba(240,181,68,.12);}
  .otprow{display:flex; gap:8px;}
  .otprow input{flex:1; min-width:0;}
  .otprow button{flex:0 0 auto; border:1px solid #2f3a52; background:#182032; color:#f0b544; border-radius:10px;
    padding:0 12px; font-size:12.5px; cursor:pointer; font-family:inherit;}
  .otprow button:disabled{color:#5c6478; cursor:default;}
  .authlinks{display:flex; justify-content:space-between; margin-top:10px; font-size:12px;}
  .authlinks a{color:#7d879e; cursor:pointer; text-decoration:none;}
  .authlinks a:hover{color:#f0b544;}
  .authbtn{width:100%; margin-top:8px; padding:12px 0; border:0; border-radius:11px; cursor:pointer;
    background:linear-gradient(120deg,#f6d67c,#f0b544); color:#241a04; font-size:14.5px; font-weight:700; font-family:inherit;}
  .authbtn:disabled{opacity:.55; cursor:default;}
  .autherr{min-height:18px; color:#e5534b; font-size:12px; margin-top:10px; line-height:1.5;}
  .authact{margin-top:8px;}
  .authact button{width:100%; padding:10px 0; border:1px solid #3a4460; background:#1a2233; color:#f0b544;
    border-radius:10px; font-size:13px; cursor:pointer; font-family:inherit;}
  .authact button:hover{background:#212b40;}
  .authhint{margin-top:8px; color:#5c6478; font-size:11px; line-height:1.6;}
  .oauthrow{display:flex; gap:8px; margin-top:12px;}
  .oauthrow button{flex:1; padding:11px 0; border:1px solid #3a4460; background:#1a2233; color:#e8ecf4;
    border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit;}
  .oauthrow button:hover{background:#212b40; border-color:#f0b544;}
  .oauthrow button:disabled{opacity:.55; cursor:default;}
  .authdiv{display:flex; align-items:center; gap:10px; margin:14px 0 0; color:#5c6478; font-size:11px;}
  .authdiv::before,.authdiv::after{content:''; flex:1; height:1px; background:#212a3c;}
  .authnote{margin-top:14px; padding-top:14px; border-top:1px solid #212a3c; color:#66708a; font-size:11px; line-height:1.7;}
  #userChip{position:fixed; top:12px; right:14px; z-index:900; display:flex; align-items:center; gap:8px;
    background:rgba(20,26,38,.92); border:1px solid #2a3247; border-radius:999px; padding:5px 6px 5px 12px;
    font-family:"PingFang SC","Microsoft YaHei",system-ui,sans-serif; font-size:12px; color:#c3cbdb; backdrop-filter:blur(6px);}
  #userChip b{color:#f0b544; font-weight:600;}
  #userChip button{border:0; background:#1e2637; color:#8b96ad; border-radius:999px; padding:5px 10px;
    font-size:11.5px; cursor:pointer; font-family:inherit;}
  #userChip button:hover{color:#e5534b;}
  @media (max-width:520px){ .authcard{padding:24px 20px 18px;} }
  `;

  function injectCss() {
    const st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  let pendingOtp = null; // { email, verificationId, isExistingUser, token? } — 按文档保持在事件处理器外
  let mode = 'login-pwd';

  function buildGate() {
    const el = document.createElement('div');
    el.id = 'authGate';
    el.innerHTML = `
      <div class="authcard">
        <div class="authbrand">
          <h1 data-i18n="brand">云顶助手</h1>
          <p data-i18n="a_tag">S18 自然之力 · 注册后全部功能可用</p>
        </div>
        <div class="authtabs" id="tabs">
          <button data-mode="login-pwd" class="on" data-i18n="a_login">登录</button>
          <button data-mode="reg" data-i18n="a_reg">注册</button>
        </div>
        <div class="authfield" id="fNick" style="display:none">
          <label><span data-i18n="a_nick">昵称</span><span class="auth-tip" data-i18n="a_nick_tip">选填，游戏中怎么叫你</span></label>
          <input id="iNick" type="text" maxlength="12" placeholder="比如：小夏" autocomplete="nickname">
        </div>
        <div class="authfield">
          <label><span data-i18n="a_email">邮箱</span><span class="auth-tip" data-i18n="a_email_tip">QQ / 163 / Gmail 都行</span></label>
          <input id="iEmail" type="email" placeholder="12345@qq.com" autocomplete="email" inputmode="email">
        </div>
        <div class="authfield" id="fCode" style="display:none">
          <label><span data-i18n="a_code">邮箱验证码</span><span class="auth-tip" data-i18n="a_code_tip">点“获取验证码”，去邮箱收，垃圾箱也看一眼</span></label>
          <div class="otprow">
            <input id="iCode" type="text" inputmode="numeric" maxlength="8" placeholder="6 位数字" autocomplete="one-time-code">
            <button type="button" id="btnCode">获取验证码</button>
          </div>
        </div>
        <div class="authfield" id="fPwd">
          <label data-i18n="a_pwd">密码</label>
          <input id="iPwd" type="password" placeholder="至少 6 位" autocomplete="current-password">
        </div>
        <div class="authfield" id="fPwd2" style="display:none">
          <label data-i18n="a_pwd2">确认密码</label>
          <input id="iPwd2" type="password" placeholder="再输一次" autocomplete="new-password">
        </div>
        <button class="authbtn" id="authGo">登录</button>
        <div class="oauthrow">
          <button type="button" id="btnWechat">💬 <span data-i18n="a_wechat">微信一键登录</span></button>
          <button type="button" id="btnGoogle"><b style="color:#4285F4">G</b> <span data-i18n="a_google">Google 一键登录</span></button>
        </div>
        <div class="authdiv"><span data-i18n="a_or">或用邮箱</span></div>
        <div class="autherr" id="authErr"></div>
        <div class="authact" id="authAct"></div>
        <div class="authlinks" id="links"></div>
        <div class="authnote">
          <span data-i18n="a_note1">账号存在云端：注册一次，手机 / 电脑 / 换浏览器，登录同一个账号进度就都在。</span><br>
          <span data-i18n="a_note2">注册会用邮箱收一个验证码（垃圾箱也看一眼）；忘记密码也能用邮箱找回。</span><br>
          <span id="langNote" style="color:#8a94ab;display:none">Guides are currently written in Chinese only.</span><br>
          <span style="color:#8a94ab" data-i18n="a_note_warn">注意：旧版本（存在本机的）账号不会自动搬到云端，用原来的密码登录不上属于正常，重新注册一次就好。</span>
        </div>
      </div>`;
    document.body.appendChild(el);

    if (window.tftApplyI18n) window.tftApplyI18n();   /* 门禁是动态创建的，建完立即套用当前语言 */

    const $ = id => el.querySelector('#' + id);
    const err = $('authErr');
    const go = $('authGo');
    $('btnWechat').onclick = () => oauthSignIn('wechat');
    $('btnGoogle').onclick = () => oauthSignIn('google');

    /* 语言切换时，门禁页上的动态文字跟着换 */
    let curLinks = [];
    function relabel() {
      go.textContent = ({ 'login-pwd': T('a_go_login'), 'login-otp': T('a_go_login'), 'reg': T('a_go_reg'), 'reset': T('a_go_reset') })[mode];
      const bc = $('btnCode');
      if (bc && !bc.disabled) bc.textContent = countdown > 0 ? bc.textContent : T('a_getcode');
      const lb = $('links');
      lb.innerHTML = curLinks.map(l => `<a data-go="${l[1]}">${T(l[0])}</a>`).join('');
      lb.querySelectorAll('a').forEach(a => { a.onclick = () => setMode(a.dataset.go); });
    }
    document.addEventListener('tftlangchange', () => {
      if (window.tftApplyI18n) window.tftApplyI18n();
      const ln = el.querySelector('#langNote');
      if (ln) ln.style.display = (window.tftLang && window.tftLang() !== 'zh') ? '' : 'none';
      relabel();
    });
    const ln0 = el.querySelector('#langNote');
    if (ln0) ln0.style.display = (window.tftLang && window.tftLang() !== 'zh') ? '' : 'none';

    function setMode(m) {
      mode = m;
      err.textContent = '';
      err.style.color = '';
      $('authAct').innerHTML = '';
      pendingOtp = null;
      $('tabs').style.display = (m === 'reset') ? 'none' : '';
      $('fNick').style.display = (m === 'reg') ? '' : 'none';
      $('fPwd').style.display = (m === 'login-pwd' || m === 'reg' || m === 'reset') ? '' : 'none';
      $('fCode').style.display = (m === 'login-otp' || m === 'reg' || m === 'reset') ? '' : 'none';
      $('fPwd2').style.display = (m === 'reg') ? '' : 'none';
      $('iPwd').setAttribute('autocomplete', (m === 'login-pwd') ? 'current-password' : 'new-password');
      const t = $('tabs').querySelectorAll('button');
      t[0].classList.toggle('on', m === 'login-pwd' || m === 'login-otp');
      t[1].classList.toggle('on', m === 'reg');
      go.textContent = ({ 'login-pwd': T('a_go_login'), 'login-otp': T('a_go_login'), 'reg': T('a_go_reg'), 'reset': T('a_go_reset') })[m];
      const links = [];
      if (m === 'login-pwd') links.push(['a_link_code', 'login-otp'], ['a_link_forgot', 'reset']);
      else if (m === 'login-otp') links.push(['a_link_pwd', 'login-pwd'], ['a_link_forgot', 'reset']);
      else if (m === 'reg') links.push(['a_link_have', 'login-pwd']);
      else if (m === 'reset') links.push(['a_link_back', 'login-pwd']);
      curLinks = links;
      $('links').innerHTML = links.map(l => `<a data-go="${l[1]}">${T(l[0])}</a>`).join('');
      $('links').querySelectorAll('a').forEach(a => { a.onclick = () => setMode(a.dataset.go); });
    }
    setMode('reg');   // 门禁页出现 = 还没登录 = 大概率是第一次来，默认落在注册
    $('tabs').querySelectorAll('button').forEach(b => { b.onclick = () => setMode(b.dataset.mode); });

    let countdown = 0, cdTimer = null;
    function startCd() {
      countdown = 60;
      const btn = $('btnCode');
      btn.disabled = true;
      btn.textContent = countdown + 's';
      cdTimer = setInterval(() => {
        countdown--;
        if (countdown <= 0) { clearInterval(cdTimer); btn.disabled = false; btn.textContent = T('a_resend'); }
        else btn.textContent = countdown + 's';
      }, 1000);
    }
    $('btnCode').onclick = async () => {
      err.textContent = '';
      const email = $('iEmail').value.trim().replace(/[＠﹫]/g, '@').replace(/\s+/g, '');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = '邮箱格式不太对，检查一下'; return; }
      const btn = $('btnCode');
      btn.disabled = true; btn.textContent = '发送中…';
      try {
        const d = await sendCode(email);
        pendingOtp = { email, verificationId: d.verificationId, isExistingUser: !!d.isExistingUser };
        if (mode === 'reg' && d.isExistingUser) err.textContent = '这个邮箱已经注册过了，切回「登录」直接进';
        else err.style.color = '#7ec97e', err.textContent = '验证码已发到邮箱，注意查收（垃圾箱也看一眼）';
        startCd();
      } catch (e) {
        err.textContent = e.message || '发送失败';
        btn.disabled = false; btn.textContent = T('a_getcode');
      }
    };

    const BTN = { 'login-pwd': 'a_go_login', 'login-otp': 'a_go_login', 'reg': 'a_go_reg', 'reset': 'a_go_reset' };
    function resetBtn() { go.disabled = false; go.textContent = T(BTN[mode]); }
    function act(label, fn) {
      const box = $('authAct');
      box.innerHTML = '';
      const b = document.createElement('button');
      b.textContent = label;
      b.onclick = fn;
      box.appendChild(b);
    }

    async function submit() {
      err.style.color = '';
      err.textContent = '';
      $('authAct').innerHTML = '';
      const email = $('iEmail').value.trim().replace(/[＠﹫]/g, '@').replace(/\s+/g, '');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = '邮箱格式不太对，检查一下'; return; }
      const nick = $('iNick').value.trim();
      const pwd = $('iPwd').value;
      const code = $('iCode').value.trim();

      go.disabled = true;
      go.textContent = T('a_wait');
      try {
        if (mode === 'login-pwd') {
          if (pwd.length < 6) { err.textContent = '密码至少 6 位'; return resetBtn(); }
          await loginPwd({ email, pwd });
        } else if (mode === 'login-otp') {
          if (!pendingOtp || pendingOtp.email !== email) { err.textContent = '先点上面的「获取验证码」，再把邮箱里收到的数字填进来'; return resetBtn(); }
          if (!code) { err.textContent = '把邮箱收到的验证码填进来'; return resetBtn(); }
          pendingOtp.token = code;
          await loginOtp({ pending: pendingOtp });
        } else if (mode === 'reg') {
          if (pwd.length < 6) { err.textContent = '密码至少 6 位'; return resetBtn(); }
          if (pwd !== $('iPwd2').value) { err.textContent = '两次密码不一致'; return resetBtn(); }
          // 还没给这个邮箱发过码 → 这一次点击负责发码
          if (!pendingOtp || pendingOtp.email !== email) {
            const d = await sendCode(email);
            if (d.isExistingUser) {
              err.textContent = '这个邮箱已经在云端注册过了，不用再注册，直接登录就行。';
              act('切到登录，用这个邮箱 →', () => { $('iEmail').value = email; setMode('login-pwd'); });
              return resetBtn();
            }
            pendingOtp = { email, verificationId: d.verificationId, isExistingUser: false };
            err.style.color = '#7ec97e';
            err.textContent = `验证码已发到 ${email}（10 分钟内有效）。收到后填到上面，再点一次「注册并进入」。`;
            startCd();
            return resetBtn();
          }
          if (!code) { err.textContent = '把邮箱收到的验证码填进来，再点一次「注册并进入」'; return resetBtn(); }
          pendingOtp.token = code;
          await register({ nick, email, pwd, pending: pendingOtp });
        } else if (mode === 'reset') {
          if (pwd.length < 6) { err.textContent = '新密码至少 6 位'; return resetBtn(); }
          if (!pendingOtp || pendingOtp.email !== email || !code) { err.textContent = '先获取验证码并填入'; return resetBtn(); }
          await resetPwd({ email, code, newPwd: pwd });
        }
        pendingOtp = null;
      } catch (e) {
        err.style.color = '';
        err.textContent = e.message || '出错了，再试一次';
        resetBtn();
        if (e.type === 'noaccount') {
          act('用这个邮箱去注册 →', () => { $('iEmail').value = email; setMode('reg'); });
        } else if (e.type === 'badcode') {
          act('重新发送验证码', () => { $('btnCode').click(); });
        } else if (e.type === 'exists') {
          act('切到登录 →', () => { $('iEmail').value = email; setMode('login-pwd'); });
        }
      }
    }
    go.onclick = submit;
    el.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    return { el, show: () => { el.classList.remove('hide'); } };
  }

  let readyCbs = [];
  function onAuthed(user) {
    const gate = document.getElementById('authGate');
    if (gate) { gate.classList.add('hide'); setTimeout(() => gate.remove(), 400); }
    renderChip(user);
    readyCbs.forEach(cb => { try { cb(user); } catch (e) { console.warn(e); } });
    readyCbs = [];
  }

  function renderChip(user) {
    if (document.getElementById('userChip')) return;
    const chip = document.createElement('div');
    chip.id = 'userChip';
    chip.innerHTML = `<b>${(user.nick || '我').slice(0, 8)}</b><button id="btnLogout">${T('a_logout')}</button>`;
    document.body.appendChild(chip);
    chip.querySelector('#btnLogout').onclick = logout;
  }

  /* ---------- 启动 ---------- */
  function boot() {
    injectCss();
    const gate = document.createElement('div');
    gate.id = 'authGate';
    gate.innerHTML = '<div class="authcard" style="text-align:center;color:#8b96ad;font-size:13px;">' + T('a_connecting') + '</div>';
    document.body.appendChild(gate);
    loadCloud().then(c => {
      cloud = c;
      return handleOAuthReturn();          /* 第三方登录跳回来的先处理 */
    }).then(() => cloud.auth.getSession()).then(({ data }) => {
      const sess = data && data.session ? data.session : (data || null);
      if (sess && sess.user) {
        return finishAuth(sess.user, null);
      }
      gate.remove();
      buildGate();
    }).catch(e => {
      gate.innerHTML = '<div class="authcard" style="text-align:center;color:#e5534b;font-size:13px;line-height:1.8;">' +
        T('a_err_net') + '<br>' +
        '<span style="color:#66708a;font-size:11px;">' + (e.message || '') + '</span></div>';
    });
  }

  window.Auth = {
    boot,
    onReady(cb) {
      if (me) { try { cb(me); } catch (e) {} }
      else readyCbs.push(cb);
    },
    data: dataGet,
    save: dataSet,
    flush: flush,
    user() { return me; },
    logout
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
