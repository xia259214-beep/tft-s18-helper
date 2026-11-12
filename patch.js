/* ============================================================
   patch.js · S18 版本平衡改动速查（18.6 正式版 + 18.5 热补丁）
   数据源：官方 18.6 版本更新公告（2026-11-05，lol.qq.com）
           + 10-29 热更公告（卡兹克/绯红印记树怪/正义之手）
   dir: 1=增强  -1=削弱  0=混合（有增有削）
   ============================================================ */
(function () {
  const UNITS = {
    '可酷伯':     { dir: 1,  tag: '18.6 增强', lines: ['技能治疗量(法术加成)：285/335/480 → 300/350/550'] },
    '雷克塞':     { dir: 1,  tag: '18.6 增强', lines: ['技能治疗量(法术加成)：10/14/20 → 10/16/24'] },
    '暗影狼':     { dir: 1,  tag: '18.6 增强', lines: ['强化攻击伤害：65/100/160 → 65/100/180（利好追三星）'] },
    '墨菲特':     { dir: 1,  tag: '18.6 增强', lines: ['护盾值(法术加成)：735/885/2000 → 750/925/2000', '技能伤害(法术加成)：40/60/2000 → 100/150/2000'] },
    '奈德丽':     { dir: 1,  tag: '18.6 双形态增强', lines: ['物理形态 治疗量：300/450/2000 → 325/550/2000', '物理形态 第三次施放额外伤害：125% → 140%', '魔法形态 强化攻击伤害：185/275/2000 → 195/295/2000', '魔法形态 第三次攻击伤害：330/500/3000 → 350/525/3000'] },
    '苍蓝雕纹魔像': { dir: 1, tag: '18.6 增强', lines: ['护盾值生命值收益率：10% → 12%（狂徒更香）'] },
    '卡兹克':     { dir: -1, tag: '18.5 热补丁削弱', lines: ['基础伤害：250/345/500 → 230/310/450', '孤立无援伤害：280/390/590 → 250/350/530'] },
    '绯红印记树怪': { dir: 0, tag: '18.5 热补丁 有削有增', lines: ['每次攻击治疗量：5% → 4%（削弱）', '无视护甲(法术加成)：25% → 10%（削弱）', '基础无视护甲：25% → 30%（增强）'] }
  };
  const TRAITS = [
    { n: '灵魂莲华', dir: 1,  lines: ['物理加成/法术加成：12/30/50/55% → 12/30/55/65%'] },
    { n: '永恒之森', dir: -1, lines: ['(9) 层级生命值加成：25% → 10%'] },
    { n: '约德尔人和朋友', dir: 1, lines: ['毛茸茸大朋友 远程加成：15/28/33% → 15/30/38%'] }
  ];
  const ITEMS = [
    { n: '正义之手', dir: -1, lines: ['全能吸血：15% → 12%', '光明版全能吸血：30% → 25%'] }
  ];

  const CSS =
    '.pbadge{position:absolute; top:-5px; right:-5px; width:17px; height:17px; border-radius:50%;' +
    'font-size:11px; font-weight:800; line-height:15px; text-align:center; z-index:6;' +
    'border:1.5px solid rgba(0,0,0,.45); box-shadow:0 1px 4px rgba(0,0,0,.5); cursor:pointer; font-style:normal;}' +
    '.pbadge.up{background:#123f26; color:#4ade80; border-color:#2f7a4d;}' +
    '.pbadge.dn{background:#46161a; color:#f87171; border-color:#8a3a3f;}' +
    '.pbadge.mix{background:#3c3413; color:#fbbf24; border-color:#8a6d1f;}' +
    '.pmini{font-size:10px; font-weight:700; margin-left:4px; white-space:nowrap;}' +
    '.pmini b.up{color:#4ade80;} .pmini b.dn{color:#f87171; margin-left:3px;}' +
    '.patchline{cursor:pointer; color:#9fb2c9; font-size:12px;}' +
    '.patchline b.up{color:#4ade80;} .patchline b.dn{color:#f87171;}' +
    '#tftPatchOv{position:fixed; inset:0; z-index:10080; background:rgba(4,8,16,.72); display:none;' +
    'align-items:center; justify-content:center; padding:18px; backdrop-filter:blur(3px);}' +
    '#tftPatchOv.on{display:flex;}' +
    '.pcard{background:#101724; border:1px solid #2a3247; border-radius:14px; max-width:420px; width:100%;' +
    'max-height:80vh; overflow:auto; padding:16px 16px 14px; box-shadow:0 18px 50px rgba(0,0,0,.6);}' +
    '.pcard h4{margin:0 0 4px; font-size:15px; color:#f0b544; display:flex; align-items:center; gap:8px;}' +
    '.pcard .ptag{font-size:11px; font-weight:600; border-radius:999px; padding:2px 9px;}' +
    '.ptag.up{background:#123f26; color:#4ade80;} .ptag.dn{background:#46161a; color:#f87171;}' +
    '.ptag.mix{background:#3c3413; color:#fbbf24;}' +
    '.pcard ul{margin:8px 0 0; padding-left:2px; list-style:none;}' +
    '.pcard li{font-size:12.5px; color:#c3cbdb; line-height:1.7; padding-left:12px; position:relative;}' +
    '.pcard li::before{content:"·"; position:absolute; left:0; color:#5a6578;}' +
    '.pcard .psec{margin-top:10px; font-size:11px; color:#6b7894; letter-spacing:1px;}' +
    '.pcard .prow{display:flex; align-items:baseline; gap:7px; margin-top:5px;}' +
    '.pcard .prow b{font-size:12.5px; color:#e8eef7; white-space:nowrap;}' +
    '.pcard .prow span{font-size:12px; color:#a7b2c6; line-height:1.6;}' +
    '.pcard .pclose{margin-top:14px; width:100%; border:1px solid #2a3247; background:#1a2334; color:#c3cbdb;' +
    'border-radius:9px; padding:8px; font-size:12.5px; cursor:pointer;}' +
    '.pcard .pclose:hover{color:#f0b544; border-color:#f0b544;}';

  function dirCls(d) { return d === 1 ? 'up' : (d === -1 ? 'dn' : 'mix'); }
  function dirMark(d) { return d === 1 ? '↑' : (d === -1 ? '↓' : '±'); }

  function ensureCss() {
    if (document.getElementById('tftPatchCss')) return;
    const st = document.createElement('style');
    st.id = 'tftPatchCss';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function overlay(html) {
    ensureCss();
    let ov = document.getElementById('tftPatchOv');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'tftPatchOv';
      ov.innerHTML = '<div class="pcard" id="tftPatchCard"></div>';
      document.body.appendChild(ov);
      ov.addEventListener('click', e => { if (e.target === ov) ov.classList.remove('on'); });
    }
    document.getElementById('tftPatchCard').innerHTML = html +
      '<button class="pclose" onclick="document.getElementById(\'tftPatchOv\').classList.remove(\'on\')">关闭</button>';
    ov.classList.add('on');
  }

  /* 单个棋子的改动弹窗 */
  function show(ev, name) {
    if (ev) { ev.preventDefault(); ev.stopPropagation(); }
    const p = UNITS[name];
    if (!p) return;
    overlay(`<h4>${name}<span class="ptag ${dirCls(p.dir)}">${dirMark(p.dir)} ${p.tag}</span></h4>
      <ul>${p.lines.map(l => `<li>${l}</li>`).join('')}</ul>
      <div class="psec">数据来自官方版本公告 · 详情以游戏内实际数值为准</div>`);
  }

  /* 当前阵容的版本变动汇总（联动阵容强度分析） */
  function showComp(ev, compId) {
    if (ev) { ev.preventDefault(); ev.stopPropagation(); }
    const comp = (window.COMPS || []).find(c => c.id === compId);
    if (!comp) return;
    const rows = [];
    comp.units.forEach(u => {
      const p = UNITS[u.n];
      if (p) rows.push(`<div class="prow"><b>${u.n}</b><span class="ptag ${dirCls(p.dir)}" style="font-size:10px">${dirMark(p.dir)} ${p.tag}</span></div><ul>${p.lines.map(l => `<li>${l}</li>`).join('')}</ul>`);
    });
    const tr = TRAITS.filter(t => comp.units.some(u => (u.t || []).some(x => x.indexOf(t.n) === 0)));
    const trHTML = tr.length ? `<div class="psec">羁绊改动（与本阵容相关）</div>` + tr.map(t =>
      `<div class="prow"><b>${t.n}</b><span class="ptag ${dirCls(t.dir)}" style="font-size:10px">${dirMark(t.dir)}</span></div><ul>${t.lines.map(l => `<li>${l}</li>`).join('')}</ul>`).join('') : '';
    const itHTML = `<div class="psec">装备改动</div>` + ITEMS.map(t =>
      `<div class="prow"><b>${t.n}</b><span class="ptag ${dirCls(t.dir)}" style="font-size:10px">${dirMark(t.dir)}</span></div><ul>${t.lines.map(l => `<li>${l}</li>`).join('')}</ul>`).join('');
    overlay(`<h4>${comp.name} · 版本变动<span class="ptag ${rows.some(r => true) ? 'mix' : 'up'}" style="display:none"></span></h4>
      ${rows.length ? rows.join('') : '<ul><li>这套阵容的棋子本期没有直接改动</li></ul>'}
      ${trHTML}${itHTML}
      <div class="psec">Patch 18.6（2026-11-05）+ 18.5 热补丁（2026-10-29）</div>`);
  }

  /* 角标 HTML（放在 .slot / .savatar / .hcard 内部使用） */
  function badge(name) {
    const p = UNITS[name];
    if (!p) return '';
    const cls = dirCls(p.dir);
    return `<i class="pbadge ${cls}" onclick="TFT_PATCH.show(event,'${name}')" title="${p.tag} · 点击看详情">${dirMark(p.dir)}</i>`;
  }

  /* 一套阵容的增削统计 */
  function compChanges(comp) {
    const ups = [], dns = [];
    (comp && comp.units || []).forEach(u => {
      const p = UNITS[u.n];
      if (!p) return;
      if (p.dir === 1) ups.push(u.n); else dns.push(u.n);
    });
    return { ups, dns };
  }

  /* 强度榜/图鉴用的全局汇总行 */
  function summaryHTML() {
    const n = Object.keys(UNITS).length;
    return `<span class="patchline" onclick="TFT_PATCH.showAll(event)">Patch 18.6 版本变动：${n} 个棋子 + ${TRAITS.length} 羁绊 + ${ITEMS.length} 装备 · 点开看全表</span>`;
  }

  function showAll(ev) {
    if (ev) { ev.preventDefault(); ev.stopPropagation(); }
    const uHTML = Object.keys(UNITS).map(n => {
      const p = UNITS[n];
      return `<div class="prow"><b>${n}</b><span class="ptag ${dirCls(p.dir)}" style="font-size:10px">${dirMark(p.dir)} ${p.tag}</span></div><ul>${p.lines.map(l => `<li>${l}</li>`).join('')}</ul>`;
    }).join('');
    const tHTML = TRAITS.map(t =>
      `<div class="prow"><b>${t.n}</b><span class="ptag ${dirCls(t.dir)}" style="font-size:10px">${dirMark(t.dir)}</span></div><ul>${t.lines.map(l => `<li>${l}</li>`).join('')}</ul>`).join('');
    const iHTML = ITEMS.map(t =>
      `<div class="prow"><b>${t.n}</b><span class="ptag ${dirCls(t.dir)}" style="font-size:10px">${dirMark(t.dir)}</span></div><ul>${t.lines.map(l => `<li>${l}</li>`).join('')}</ul>`).join('');
    overlay(`<h4>S18 版本变动全表<span class="ptag mix">18.6 + 18.5 热补丁</span></h4>
      <div class="psec">弈子</div>${uHTML}
      <div class="psec">羁绊</div>${tHTML}
      <div class="psec">装备</div>${iHTML}
      <div class="psec">来源：官方版本公告，更新日期 2026-11-12</div>`);
  }

  window.TFT_PATCH = { patch: '18.6', updated: '2026-11-12', units: UNITS, traits: TRAITS, items: ITEMS, badge, compChanges, show, showComp, showAll, summaryHTML };
})();
