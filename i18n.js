/* ============================================================
   云顶助手 · 多语言模块（zh / en / ja / ko）
   - 静态界面文字：<el data-i18n="key">，用 tftApplyI18n() 批量套用
   - JS 动态文字：window.tftT('key') 取当前语言的词条
   - 右下角悬浮语言球，切换后存 localStorage('tft_lang')
   - 说明：攻略长文（运营节奏/阵容解说等）暂为中文，界面框架已翻
   ============================================================ */
(function () {
  var DICT = {
    zh: {
      brand:'云顶助手',
      idx_sub:'S18 自然之力 · Patch 18.6 · 开局引导 / 阵容棋盘 / 棋子更新',
      idx_ver:'S18 自然之力 · 74 弈子 · 头像实时来自官方 CDN',
      idx_getapp_t:'装到手机桌面，像 APP 一样用',
      idx_getapp_s:'点一下看 4 步图示，装完桌面多一个图标',
      idx_getapp_go:'看步骤',
      idx_card1_t:'作战台（开局引导 + 棋盘）',
      idx_card1_d:'抓到什么牌就点什么，实时告诉你该走哪套阵容；缺谁点谁，立刻给替代方案和转线按钮。',
      idx_tag1:'主打这个',
      idx_card2_t:'棋子更新 · 阵容理解',
      idx_card2_d:'每个版本棋子 / 羁绊 / 装备的详细数值变动；联动棋子所在每套全球服阵容的分段数据，加强还是减弱、克制谁，全列清楚。',
      idx_tag2:'看版本',
      idx_card3_t:'棋子更新 · 阵容理解',
      idx_card3_d:'版本棋子 / 羁绊 / 装备详细数值变动与阵容影响分析。',
      idx_tag3:'看版本',
      idx_foot1:'棋子头像为游戏内官方形象（含野怪），联网时从 Riot CDN 实时加载，游戏更新头像自动跟进。',
      idx_foot2:'阵容数据基于统计站实测（tftcodex.com，2026-11-12 拉取），版本更新后需重新校准。',

      bd_board:'作战台',
      bd_ver:'S18 自然之力 · Patch 18.6',
      bd_tip:'开局不知道走什么 → 先看「开局引导」',
      tab_guide:'开局引导', tab_new:'新', tab_lib:'阵容库 · 棋盘', tab_stats:'胜率 · 强度榜', tab_dex:'装备 · 图鉴',
      g_hand:'我的手牌', g_hand_sub:'点下面的英雄加进来，再点一次移除',
      g_snap_shot:'截屏识别', g_snap_cam:'拍照识别', g_snap_file:'本地文件',
      snap_shot_t:'截屏识别 · 三步', snap_shot_1:'切到游戏，同时按 <b>电源键 + 音量下键</b> 截一张图', snap_shot_2:'回到本页（点这个 APP）', snap_shot_3:'点下面的按钮，选中刚截的那张图', snap_shot_go:'📁 选截图',
      snap_sys:'你是云顶之弈截图识别器。你会收到两张图：第一张是全部棋子的头像对照表（头像下标着名字），第二张是用户截图。把截图里的每个棋子与对照表头像逐一视觉比对来识别。只输出 JSON 数组，不要解释、不要代码块标记。',
      snap_prompt:'第一张图是全部棋子对照表（每个头像下面写着名字），第二张是云顶之弈/金铲铲之战的对局截图（可能是商店、棋盘或战绩页）。把截图里出现的每个棋子与对照表里的头像逐一比对，输出它的名字，名字必须与名单一字不差：{names}。只认英雄棋子，不要装备名、羁绊名、野怪；同名棋子只输出一次；跟对照表头像对不上、看不清的不要输出。只输出 JSON 数组，例如 ["德莱文","茂凯"]。',
      snap_reading:'正在识别截图…', snap_reading_sub:'AI 读图中，约几秒',
      snap_done:'已加入', snap_none:'图里没认出棋子', snap_missed:'｜没对上的：',
      snap_fail:'识别失败', snap_nofind:'AI 没返回有效名单，换个更清晰的图试试',
      snap_badimg:'图片读取失败，换一张试试', snap_needlogin:'请先登录再使用识别',
      g_pool:'英雄池', g_pool_sub:'按费用分组 · 暗色的＝暂不属于任何收录阵容（打工牌 / 野怪 / 自然之力形态），悬停看原因',
      g_which:'该走哪套',
      lb_rank:'阵容强度榜', lb_rank_sub:'切换段位看该分段实测 · 名次越低越强 · 点任意行载入棋盘',
      th_comp:'阵容', th_tier:'档位', th_avg:'平均名次', th_top4:'前四率', th_win:'吃鸡率', th_win_all:'全服吃鸡率', th_games:'样本局数', th_play:'使用率',
      reg_all:'全球', fmeta_t:'外服 Meta 榜', fmeta_sub:'韩服 / 欧服 / 美服 / 太平洋 · Patch 18.6 实时统计 · 切换服务器看当地在玩什么',
      fmeta_note:'数据来源 tactics.tools（2026-11-12 抓取）。名次＝该服该阵容的平均排名，使用率＝该阵容占该服全部对局的比例；样本不足 300 局的组合已剔除。带 * 的是样本偏少的组合。',
      fmeta_empty:'这个分段 / 服务器暂时没有足够样本的阵容。',
      lb_stat_note_live:'当前显示 {rank} 分段实测（全球样本约 {n} 局）· 全服吃鸡率＝铂金+ 大盘口径（统计源最宽分段）· 数据来源 tactics.tools Patch 18.6（2026-11-12 抓取）· 档位章按该分段平均名次换算 · 未匹配到的阵容显示 — 或回落 tftcodex 数据',
      lb_stat_note:'数据源 tftcodex.com（2026-11-12，Patch 18.6）；13 套有 Diamond+ 实测数据；其余 5 套统计站未收录对应阵容家族（近 6 天样本不足 400 局），显示 —，档位章为攻略口径。',
      lb_board:'棋盘', reset:'重置棋盘',
      lb_stage:'阵容过渡', lb_stage_sub:'前期打工 → 中期补强 → 成型 · 每段标了人口 / 该存还是该花 / 该合哪件',
      lb_flow:'运营节奏', lb_more:'站位细节 / 常见错误 / 什么时候放弃',
      op_assist:'作战助手', op_carry:'主 C', op_traits:'羁绊（实时）', op_miss:'还差什么', op_code:'阵容码',
      lg_ad:'物理', lg_ap:'法系', lg_def:'防御', lg_ut:'功能', lg_em:'纹章',
      dex_item:'装备图鉴', dex_item_sub:'点装备看合成路径 · 点散件看它能合成什么',
      dex_hero:'英雄图鉴', dex_hero_sub:'74 弈子 · 点开看羁绊 / 目标星级 / 该带什么装备',
      bd_foot:'阵容数据取自国服 S18「自然之力」18.6 版本游戏内文件；强度榜取自统计站 tftcodex.com Diamond+ 近 6 天样本（2026-11-12），会随热更新变动。',

      mn_manual:'作战手册',
      mn_tab_comps:'阵容库', mn_tab_econ:'经济规划', mn_tab_aug:'海克斯', mn_tab_plan:'判断与转型',
      mn_cur:'当前局面', mn_interest:'利息档位', mn_sim:'接下来 8 回合推演', mn_todo:'该怎么做',
      mn_three:'先记住三件事', mn_rescue:'拿错了怎么救 · 替换决策表', mn_auglib:'高频符文库',
      mn_break:'纹章 / 自然之力的断点规矩', mn_win:'开局先决定：这局你怎么赢',
      mn_stage:'每个阶段该看什么数字', mn_signal:'这些信号出现，立刻换路子',
      mn_tagline:'阵容怎么拿、海克斯怎么选、拿错了怎么救、什么时候该收手',
      mn_foot1:'数据来源：国服 18.6 版本游戏内数据文件；第三方统计站 tftcodex.com Diamond+ 排位样本（2026-11-12，近 6 天）。',
      mn_foot2:'阵容强度会随热更新变动。', mn_foot3:'阵容码', mn_foot4:'可粘贴进游戏内「队伍规划器」一键导入，导入后按站位图手动摆位。',
      mn_foot:'数据来源：国服 18.6 版本游戏内数据文件；第三方统计站 tftcodex.com Diamond+ 排位样本（2026-11-12，近 6 天）。\u3000阵容强度会随热更新变动。<b>阵容码</b>可粘贴进游戏内「队伍规划器」一键导入，导入后按站位图手动摆位。',

      ec_planner:'经济规划器',
      ec_sub:'把当前局面填进去，算清这回合该存还是该花',
      mn_cur2:'当前局面',
      l_round:'阶段-回合', l_hp:'生命值', l_level:'等级', l_xp:'当前经验', l_gold:'金币',
      l_streak:'连胜 / 连败', l_target:'目标等级', l_spend:'本回合计划花费',
      k_income:'本回合总收入', k_income_n:'基础 + 利息 + 连胜',
      k_next:'下回合可用', k_next_n:'含本回合花费后',
      k_xp_pre:'升到', k_xp_suf:'还需',
      mn_interest2:'利息档位', mn_sim2:'接下来 8 回合推演', mn_todo2:'该怎么做',
      s_round:'回合', s_level:'等级', s_gold:'回合开始金币', s_income:'收入', s_interest:'利息', s_streak2:'连胜', s_slack:'容错',
      ec_hint:'花费用于算利息损失：每 10 金 1 利息，花掉可能掉档。',
      ec_foot:'收入规则：1-2/1-3 各 2 金、1-4 3 金、2-1 4 金，2-2 起每回合 5 金；PVP 胜利额外 +1；\u3000连胜/连败 2-4 连 +1、5 连 +2、6 连及以上 +3；利息每 10 金 +1、上限 5。\u3000每回合自然获得 2 点经验，买经验 4 金 = 4 点，刷新 2 金。',

      a_tag:'S18 自然之力 · 注册后全部功能可用',
      a_login:'登录', a_reg:'注册',
      a_nick:'昵称', a_nick_tip:'选填，游戏中怎么叫你',
      a_email:'邮箱', a_email_tip:'QQ / 163 / Gmail 都行',
      a_code:'邮箱验证码', a_code_tip:'点“获取验证码”，去邮箱收，垃圾箱也看一眼',
      a_getcode:'获取验证码', a_resend:'重新发送',
      a_pwd:'密码', a_pwd_ph:'至少 6 位', a_pwd2:'确认密码', a_pwd2_ph:'再输一次',
      a_go_login:'登录', a_go_reg:'注册并进入', a_go_reset:'重置密码', a_wait:'请稍候…',
      a_link_code:'用验证码登录', a_link_pwd:'用密码登录', a_link_forgot:'忘记密码？',
      a_link_have:'已有账号？去登录', a_link_back:'返回登录',
      a_wechat:'微信一键登录', a_google:'Google 一键登录', a_or:'或用邮箱', a_logout:'退出',
      a_wx_inwechat:'你现在是在微信里打开的，微信里没法扫自己的码登录。点右上角「…」→ 在浏览器打开，再点微信登录；或者直接用邮箱注册，一样能用。',
      a_wx_mobile:'手机上没法扫自己的屏幕。想用微信登录，把这个链接发到电脑上打开最快；手机上直接用邮箱验证码登录更省事。',
      a_wx_popup:'微信扫码已经在新窗口打开了，用手机微信扫一下，扫完这里会自动登录。',
      a_wx_tip:'微信登录会在新窗口里出二维码，手机微信扫一下就好。扫码页打不开、或提示「浏览器不支持」→ 换 Chrome / Edge 打开，或者直接用下面邮箱登录。',
      pos_t:'站位与拿牌', pos_t_sub:'前期怎么摆 / 成型怎么摆 · 几级拿什么牌 · 选秀优先什么',
      pos_early:'前期站位（2-1 起）', pos_final:'成型站位', pos_dim:'灰的是打工牌，来了就换',
      pos_bylevel:'几级拿什么牌（等级越低越先拿）', pos_carousel:'选秀优先', pos_levelup:'升级路线',
      a_note1:'账号存在云端：注册一次，手机 / 电脑 / 换浏览器，登录同一个账号进度就都在。',
      a_note2:'注册会用邮箱收一个验证码（垃圾箱也看一眼）；忘记密码也能用邮箱找回。',
      a_note_warn:'注意：旧版本（存在本机的）账号不会自动搬到云端，用原来的密码登录不上属于正常，重新注册一次就好。',
      a_connecting:'正在连接云服务…',
      a_err_net:'连不上云服务，请检查网络后刷新重试。'
    },

    en: {
      brand:'TFT Helper',
      idx_sub:'S18 Natural Forces · Patch 18.6 · Draft Guide / Comp Board / Patch Notes',
      idx_ver:'S18 Natural Forces · 74 units · avatars streamed live from the official CDN',
      idx_getapp_t:'Install to your home screen, works like an app',
      idx_getapp_s:'Tap for a 4-step guide — an icon appears on your home screen',
      idx_getapp_go:'How to',
      idx_card1_t:'Battle Desk (Draft Guide + Board)',
      idx_card1_d:'Tap the units you hit and it tells you in real time which comp to run — missing pieces, substitutes and pivot options included.',
      idx_tag1:'Main tool',
      idx_card2_t:'Patch Notes & Comp Insight',
      idx_card2_d:'Detailed unit / trait / item changes each patch, auto-linked to the segment stats of every global comp that fields them — who got stronger, who got weaker, and who counters whom.',
      idx_tag2:'Patch',
      idx_card3_t:'Patch Notes & Comp Insight',
      idx_card3_d:'Detailed patch changes and comp impact analysis.',
      idx_tag3:'Patch',
      idx_foot1:'Unit avatars are official in-game art (monsters included), loaded live from Riot\u2019s CDN and updated automatically with the game.',
      idx_foot2:'Comp stats measured from ranked samples (tftcodex.com, pulled 2026-11-12); recalibrated after every patch.',

      bd_board:'Battle Desk',
      bd_ver:'S18 Natural Forces · Patch 18.6',
      bd_tip:'Not sure what to run → start with the Draft Guide',
      tab_guide:'Draft Guide', tab_new:'New', tab_lib:'Comps · Board', tab_stats:'Win Rates', tab_dex:'Items · Index',
      g_hand:'My Units', g_hand_sub:'Tap a hero below to add, tap again to remove',
      g_snap_shot:'Screenshot scan', g_snap_cam:'Camera scan', g_snap_file:'Local file',
      snap_shot_t:'Screenshot scan · 3 steps', snap_shot_1:'Switch to the game and press <b>Power + Volume-down</b> to capture', snap_shot_2:'Come back to this app', snap_shot_3:'Tap the button below and pick the screenshot you just took', snap_shot_go:'📁 Pick screenshot',
      snap_sys:'You are a TFT screenshot recognizer. You receive two images: first a reference sheet of ALL unit portraits (each labeled with its name), then the user screenshot. Identify units by visually matching them against the reference sheet. Output ONLY a JSON array, no explanations, no code fences.',
      snap_prompt:'The first image is a reference sheet of ALL units (each portrait labeled with its name). The second is a TFT match screenshot (shop, board or results). Match every unit visible in the screenshot against the reference portraits and output its name, chosen ONLY from this list, spelling must match exactly: {names}. Champions only — ignore items, traits and monsters; output each once; skip anything that does not clearly match a reference portrait. Output ONLY a JSON array like ["Draven"].',
      snap_reading:'Scanning screenshot…', snap_reading_sub:'AI is reading the image, a few seconds',
      snap_done:'Added', snap_none:'No champions recognized', snap_missed:' | unmatched: ',
      snap_fail:'Scan failed', snap_nofind:'AI returned no valid list — try a clearer image',
      snap_badimg:'Failed to read image, try another', snap_needlogin:'Please sign in first to use scanning',
      g_pool:'Hero Pool', g_pool_sub:'Grouped by cost · greyed out = in no listed comp (temp / monster / Lux form) · hover for why',
      g_which:'Which comp to run',
      lb_rank:'Comp Tier Stats', lb_rank_sub:'Switch rank to see that bracket · lower is better · tap a row to load the board',
      th_comp:'Comp', th_tier:'Tier', th_avg:'Avg Place', th_top4:'Top 4', th_win:'Win', th_win_all:'All-Ranks Win', th_games:'Games', th_play:'Play Rate',
      reg_all:'Global', fmeta_t:'Server Meta', fmeta_sub:'KR / EUW / NA / OCE · live Patch 18.6 stats · switch server to see what locals play',
      fmeta_note:'Source: tactics.tools (snapshot 2026-11-12). Place = average finish of that comp on that server; play rate = share of all games there. Combos under 300 games are filtered out; * marks thin samples.',
      fmeta_empty:'Not enough games for this bracket / server yet.',
      lb_stat_note_live:'Showing {rank} ({n} games worldwide) · all-ranks win = Platinum+ pool (widest bracket of the source) · source tactics.tools patch 18.6 (snapshot 2026-11-12) · tier badge derived from that bracket\u2019s average place · comps without a match show — or fall back to tftcodex data',
      lb_stat_note:'Source: tftcodex.com (2026-11-12, Patch 18.6). 13 comps have Diamond+ data; the other 5 have no matching comp family on the site (<400 games in 6 days) and show “—”. Tier badges follow the guide\u2019s own rating.',
      lb_board:'Board', reset:'Reset board',
      lb_stage:'Comp Transitions', lb_stage_sub:'Early temp → mid-game power → final form · level, save-or-spend and item per stage',
      lb_flow:'Game Plan', lb_more:'Positioning / Common mistakes / When to bail',
      op_assist:'Assistant', op_carry:'Main Carry', op_traits:'Traits (live)', op_miss:'What\u2019s missing', op_code:'Team code',
      lg_ad:'AD', lg_ap:'AP', lg_def:'Defense', lg_ut:'Utility', lg_em:'Emblem',
      dex_item:'Item Index', dex_item_sub:'Tap an item for its recipe · tap a component to see what it builds into',
      dex_hero:'Hero Index', dex_hero_sub:'74 units · tap for traits / target stars / recommended items',
      bd_foot:'Comp data from the CN S18 \u201cNatural Forces\u201d 18.6 game files; tier stats from tftcodex.com Diamond+ over the last 6 days (2026-11-12). Numbers shift with hotfixes.',

      mn_manual:'Battle Manual',
      mn_tab_comps:'Comps', mn_tab_econ:'Economy', mn_tab_aug:'Augments', mn_tab_plan:'Reads & Pivots',
      mn_cur:'Current state', mn_interest:'Interest tiers', mn_sim:'Next 8 rounds', mn_todo:'What to do',
      mn_three:'Three rules first', mn_rescue:'Wrong item? Rescue & swap table', mn_auglib:'High-frequency augments',
      mn_break:'Emblem / Natural Forces breakpoint rules', mn_win:'Decide early: how do you win this game',
      mn_stage:'What numbers to watch each stage', mn_signal:'See these signals? Pivot immediately',
      mn_tagline:'How to draft, which augments to take, how to rescue a misdraft, and when to stop',
      mn_foot1:'Sources: CN 18.6 in-game data files; tftcodex.com Diamond+ ranked sample (2026-11-12, last 6 days).',
      mn_foot2:'Comp strength shifts with hotfixes.', mn_foot3:'Team code', mn_foot4:' pastes straight into the in-game Team Planner; place units by the board afterwards.',
      mn_foot:'Sources: CN 18.6 in-game data files; tftcodex.com Diamond+ ranked sample (2026-11-12, last 6 days).\u3000Strengths shift with hotfixes. The <b>team code</b> pastes straight into the in-game Team Planner; place units by the board afterwards.',

      ec_planner:'Economy Planner',
      ec_sub:'Fill in your situation — it tells you whether to save or spend this round',
      mn_cur2:'Current state',
      l_round:'Stage-Round', l_hp:'HP', l_level:'Level', l_xp:'Current XP', l_gold:'Gold',
      l_streak:'Streak (W/L)', l_target:'Target level', l_spend:'Planned spend this round',
      k_income:'Income this round', k_income_n:'Base + interest + streak',
      k_next:'Available next round', k_next_n:'after this round\u2019s spending',
      k_xp_pre:'To Lv.', k_xp_suf:'left',
      mn_interest2:'Interest tiers', mn_sim2:'Next 8 rounds', mn_todo2:'What to do',
      s_round:'Round', s_level:'Level', s_gold:'Gold at start', s_income:'Income', s_interest:'Interest', s_streak2:'Streak', s_slack:'Buffer',
      ec_hint:'Spending matters because interest is lost: +1 per 10 gold held, so buying may drop you a tier.',
      ec_foot:'Income rules: 2g on 1-2/1-3, 3g on 1-4, 4g on 2-1, 5g per round from 2-2; +1 for each PvP win;\u3000streak +1 at 2-4, +2 at 5, +3 at 6+; interest +1 per 10 gold, capped at 5.\u30002 XP per round naturally, 4 gold buys 4 XP, refresh costs 2 gold.',

      a_tag:'S18 Natural Forces · Sign up to unlock everything',
      a_login:'Sign in', a_reg:'Sign up',
      a_nick:'Name', a_nick_tip:'optional — what you go by',
      a_email:'Email', a_email_tip:'QQ, 163 or Gmail all work',
      a_code:'Email code', a_code_tip:'Tap \u201cGet code\u201d, then check your inbox — and spam folder',
      a_getcode:'Get code', a_resend:'Resend',
      a_pwd:'Password', a_pwd_ph:'at least 6 characters', a_pwd2:'Confirm password', a_pwd2_ph:'type it again',
      a_go_login:'Sign in', a_go_reg:'Sign up & enter', a_go_reset:'Reset password', a_wait:'Please wait…',
      a_link_code:'Use a code instead', a_link_pwd:'Use password instead', a_link_forgot:'Forgot password?',
      a_link_have:'Have an account? Sign in', a_link_back:'Back to sign in',
      a_wechat:'One-tap WeChat', a_google:'One-tap Google', a_or:'or with email', a_logout:'Sign out',
      a_wx_inwechat:"You're inside WeChat, which can't scan its own QR code. Tap ··· at the top right → Open in browser, then try again — or just register with your email.",
      a_wx_mobile:"A phone can't scan its own screen. For WeChat sign-in, open this link on a computer; on a phone, email sign-in is quicker.",
      a_wx_popup:"WeChat sign-in is open in a new window — scan it with WeChat on your phone and you'll land back here signed in.",
      a_wx_tip:'WeChat sign-in shows a QR code in a new window — scan it with WeChat on your phone. If the QR page will not open or says "browser not supported", switch to Chrome or Edge, or just use the email sign-in below.',
      pos_t:'Positions & Picks', pos_t_sub:'Early / final placement · what to pick at each level · carousel priority',
      pos_early:'Early placement (from 2-1)', pos_final:'Final placement', pos_dim:'Grey ones are tempo units — swap out when the real ones arrive',
      pos_bylevel:'What to pick at each level (lower level = higher priority)', pos_carousel:'Carousel priority', pos_levelup:'Level-up route',
      a_note1:'Your account lives in the cloud: sign up once, and your progress follows you across phone, PC and browsers.',
      a_note2:'Sign-up sends a code to your email (check spam too); password resets work the same way.',
      a_note_warn:'Note: accounts from the old local version were not migrated — if your old password fails, just sign up again.',
      a_connecting:'Connecting to cloud…',
      a_err_net:'Can\u2019t reach the cloud service. Check your network and refresh.'
    },

    ja: {
      brand:'TFTアシスタント',
      idx_sub:'S18 自然の力 · Patch 18.6 · 序盤ガイド / 構築ボード / パッチノート',
      idx_ver:'S18 自然の力 · 74ユニット · アイコンは公式CDNから即時取得',
      idx_getapp_t:'ホーム画面に追加、アプリのように使える',
      idx_getapp_s:'タップして4ステップの手順を確認。ホーム画面にアイコンが追加されます',
      idx_getapp_go:'手順を見る',
      idx_card1_t:'バトルデスク（序盤ガイド＋ボード）',
      idx_card1_d:'手に入れたユニットをタップすると、今走るべき構築をリアルタイムで提案。足りないユニット・代用案・転線先もすぐ表示します。',
      idx_tag1:'メイン',
      idx_card2_t:'チェンジログ & 構築理解',
      idx_card2_d:'ユニット／特性／アイテムの詳細な数値変更を毎パッチ収録。対象ユニットを編成する各国サーバーの構築データと自動連動し、強くなったか弱くなったか、誰に強いかまで整理。',
      idx_tag2:'パッチ',
      idx_card3_t:'チェンジログ & 構築理解',
      idx_card3_d:'パッチ変更の詳細データと構築への影響分析。',
      idx_tag3:'パッチ',
      idx_foot1:'ユニットのアイコンはゲーム内公式画像（モンスター含む）。Riot CDN から即時取得し、アップデートに自動追従します。',
      idx_foot2:'構築データはランク戦統計の実測値（tftcodex.com、2026-11-12 取得）。パッチごとに再校正されます。',

      bd_board:'バトルデスク',
      bd_ver:'S18 自然の力 · Patch 18.6',
      bd_tip:'何を回すか迷ったら → まず「序盤ガイド」',
      tab_guide:'序盤ガイド', tab_new:'新', tab_lib:'構築 · ボード', tab_stats:'勝率 · 強さ榜', tab_dex:'アイテム · 図鑑',
      g_hand:'手持ちユニット', g_hand_sub:'下のユニットをタップで追加、もう一度タップで解除',
      g_snap_shot:'スクショ識別', g_snap_cam:'カメラで識別', g_snap_file:'ローカルファイル',
      snap_shot_t:'スクショ識別 · 3ステップ', snap_shot_1:'ゲームに切り替え、<b>電源+音量下</b>を同時押しでスクリーンショット', snap_shot_2:'このアプリに戻る', snap_shot_3:'下のボタンをタップして、撮ったスクショを選ぶ', snap_shot_go:'📁 スクショを選ぶ',
      snap_sys:'あなたはTFTスクリーンショット認識器です。2枚の画像が届きます。1枚目は全ユニットの見本表（ポートレイトの下に名前）、2枚目はユーザーのスクリーンショットです。見本表のポートレイトと照合して識別してください。JSON配列のみを出力し、説明やコードフェンスは不要です。',
      snap_prompt:'1枚目は全ユニットの見本表（各ポートレイトの下に名前）、2枚目はTFTのスクリーンショット（ショップ・盤面・結果画面のいずれか）です。スクリーンショットに写っている各ユニットを見本表のポートレイトと照合し、名前を出力してください。必ず次のリストから一字一句同じ名前だけ: {names}。アイテム・特性・モンスターは無視し、同名は1回だけ、見本表とはっきり一致しないものは出力しないでください。JSON配列のみ出力（例: ["ドレイヴン"]）。',
      snap_reading:'スクショを解析中…', snap_reading_sub:'AIが画像を読み込み中、数秒かかります',
      snap_done:'追加', snap_none:'チャンピオンを認識できませんでした', snap_missed:'｜不一致: ',
      snap_fail:'認識に失敗しました', snap_nofind:'有効なリストが返されませんでした。より鮮明な画像をお試しください',
      snap_badimg:'画像を読み込めませんでした', snap_needlogin:'識別機能を使うには先にログインしてください',
      g_pool:'ヒーロープール', g_pool_sub:'コスト別 · グレー＝どの構築にも未収録（つなぎ／モンスター／ラックス形態）· 長押しで理由を表示',
      g_which:'どの構築を回すか',
      lb_rank:'構築ティア統計', lb_rank_sub:'ランクを切り替えてその層の実測を表示 · 数値が低いほど強い · 行をタップでボードに読み込み',
      th_comp:'構築', th_tier:'ティア', th_avg:'平均順位', th_top4:'トップ4率', th_win:'優勝率', th_win_all:'全体優勝率', th_games:'サンプル数', th_play:'使用率',
      reg_all:'全世界', fmeta_t:'海外サーバーMeta', fmeta_sub:'KR / EUW / NA / OCE · Patch 18.6 のライブ統計 · サーバーを切り替えて現地の流行を確認',
      fmeta_note:'出典: tactics.tools（2026-11-12 取得）。順位＝そのサーバーでの平均順位、使用率＝そのサーバー全対戦に占める割合。300戦未満の組み合わせは除外。* はサンプル少。',
      fmeta_empty:'このランク / サーバーではまだ十分なサンプルがありません。',
      lb_stat_note_live:'現在 {rank} の実測を表示（世界サンプル約 {n} 戦）· 全体優勝率＝プラチナ+ プール（出典の最広区分）· 出典 tactics.tools Patch 18.6（2026-11-12 取得）· ティアはその層の平均順位から換算 · 一致しない構築は — または tftcodex データを表示',
      lb_stat_note:'出典: tftcodex.com（2026-11-12、Patch 18.6）。13 デッキは Diamond+ 実測値あり。残り 5 デッキは該当ファミリーが未収録（6日間で400戦未満）のため「—」。ティアバッジは攻略基準。',
      lb_board:'ボード', reset:'ボードをリセット',
      lb_stage:'構築の移り変わり', lb_stage_sub:'序盤のつなぎ → 中盤の補強 → 最終形態（各段階のレベル・貯金/消費・アイテム付き）',
      lb_flow:'運営リズム', lb_more:'ポジション / よくあるミス / 撤退タイミング',
      op_assist:'アシスタント', op_carry:'メインキャリー', op_traits:'シナジー（リアルタイム）', op_miss:'あと何が足りない', op_code:'チームコード',
      lg_ad:'AD', lg_ap:'AP', lg_def:'防御', lg_ut:'補助', lg_em:'紋章',
      dex_item:'アイテム図鑑', dex_item_sub:'アイテムをタップでレシピ表示 · 素材をタップで合成先を表示',
      dex_hero:'ヒーロー図鑑', dex_hero_sub:'74ユニット · タップでシナジー／目標スター／推奨アイテムを表示',
      bd_foot:'構築データは中国サーバー S18「自然の力」18.6 のゲーム内データから。ティア統計は tftcodex.com Diamond+ 直近6日間（2026-11-12）。ホットフィックスで変動します。',

      mn_manual:'バトルマニュアル',
      mn_tab_comps:'構築', mn_tab_econ:'経済', mn_tab_aug:'オーグメント', mn_tab_plan:'判断と転線',
      mn_cur:'現在の状況', mn_interest:'利息段階', mn_sim:'この先8ラウンドの試算', mn_todo:'やるべきこと',
      mn_three:'まず覚える3つのこと', mn_rescue:'取り間違えたときの救済 · 交換表', mn_auglib:'頻出オーグメント',
      mn_break:'紋章 · 自然の力の閾値ルール', mn_win:'序盤に決める：この試合の勝ち筋',
      mn_stage:'各段階で見るべき数字', mn_signal:'これらのサインが出たら即転線',
      mn_tagline:'どう集めるか、オーグメントをどう選ぶか、取り間違えたらどう直すか、いつ引き上げるか',
      mn_foot1:'出典: 中国サーバー 18.6 ゲーム内データ、tftcodex.com Diamond+ ランク統計（2026-11-12、直近6日間）。',
      mn_foot2:'強さはホットフィックスで変動します。', mn_foot3:'チームコード', mn_foot4:'はゲーム内「チームプランナー」に貼り付ければ一発インポート、あとは配置図どおりに並べてください。',
      mn_foot:'出典: 中国サーバー 18.6 ゲーム内データ、tftcodex.com Diamond+ ランク統計（2026-11-12、直近6日間）。\u3000強さはホットフィックスで変動。<b>チームコード</b>はゲーム内「チームプランナー」に貼り付ければ一発インポート、あとは配置図どおりに並べてください。',

      ec_planner:'経済プランナー',
      ec_sub:'現在の状況を入力すると、このラウンドで貯めるか使うかを判定します',
      mn_cur2:'現在の状況',
      l_round:'ラウンド', l_hp:'HP', l_level:'レベル', l_xp:'現在のXP', l_gold:'ゴールド',
      l_streak:'連勝 / 連敗', l_target:'目標レベル', l_spend:'今ラウンドの予定支出',
      k_income:'今ラウンドの総収入', k_income_n:'基本＋利息＋連勝',
      k_next:'次ラウンドで使える', k_next_n:'今ラウンドの支出を含む',
      k_xp_pre:'Lv.', k_xp_suf:'まで',
      mn_interest2:'利息段階', mn_sim2:'この先8ラウンドの試算', mn_todo2:'やるべきこと',
      s_round:'ラウンド', s_level:'レベル', s_gold:'開始ゴールド', s_income:'収入', s_interest:'利息', s_streak2:'連勝', s_slack:'余裕',
      ec_hint:'支出は利息損失に直結：10ゴールドごとに+1、使うと段階が下がることがあります。',
      ec_foot:'収入ルール: 1-2/1-3 は各2G、1-4 は3G、2-1 は4G、2-2 から毎ラウンド5G。PVP勝利で追加+1。\u3000連勝/連敗は2-4で+1、5で+2、6以上で+3。利息は10Gごとに+1、上限5。\u3000毎ラウンド自然に2XP、XP購入は4G=4XP、リフレッシュは2G。',

      a_tag:'S18 自然の力 · 登録で全機能が使える',
      a_login:'ログイン', a_reg:'登録',
      a_nick:'ニックネーム', a_nick_tip:'任意 · ゲームでの呼び名',
      a_email:'メールアドレス', a_email_tip:'QQ / 163 / Gmail どれでも可',
      a_code:'メール認証コード', a_code_tip:'「コードを取得」をタップして、メール（迷惑フォルダも）を確認',
      a_getcode:'コードを取得', a_resend:'再送信',
      a_pwd:'パスワード', a_pwd_ph:'6文字以上', a_pwd2:'パスワード確認', a_pwd2_ph:'もう一度入力',
      a_go_login:'ログイン', a_go_reg:'登録して進む', a_go_reset:'パスワードをリセット', a_wait:'お待ちください…',
      a_link_code:'コードでログイン', a_link_pwd:'パスワードでログイン', a_link_forgot:'パスワードを忘れた？',
      a_link_have:'アカウントをお持ちの方はログイン', a_link_back:'ログインに戻る',
      a_wechat:'WeChatでログイン', a_google:'Googleでログイン', a_or:'またはメールで', a_logout:'ログアウト',
      a_wx_inwechat:'WeChat内で開いています。自分自身のQRは読み取れません。右上の「…」→「ブラウザで開く」を選んでから、もう一度お試しください。メール登録でも使えます。',
      a_wx_mobile:'スマホでは自分の画面のQRを読み取れません。WeChatログインはこのリンクをPCで開いてください。スマホならメールログインが手軽です。',
      a_wx_popup:'別ウィンドウでWeChatのQRコードを開きました。スマホのWeChatで読み取れば、ここに戻るとログイン済みになります。',
      a_wx_tip:'WeChatログインは新しいウィンドウにQRコードを表示します。スマホのWeChatで読み取ってください。QRページが開かない、「ブラウザ非対応」と出る場合は Chrome か Edge で開くか、下のメールログインをご利用ください。',
      pos_t:'立ち位置とピック', pos_t_sub:'序盤 / 最終の立ち位置 · レベルごとの狙い · ドラフト優先',
      pos_early:'序盤の立ち位置（2-1 から）', pos_final:'最終の立ち位置', pos_dim:'灰色は繋ぎのユニット、来たら交代',
      pos_bylevel:'レベル別の狙い（低レベルほど優先）', pos_carousel:'ドラフト優先', pos_levelup:'レベルアップ手順',
      a_note1:'アカウントはクラウドに保存：一度登録すれば、スマホ・PC・ブラウザを変えても同じアカウントで続きから再開できます。',
      a_note2:'登録時にはメールに認証コードを送信（迷惑フォルダも確認）。パスワードの再設定もメールでできます。',
      a_note_warn:'注意：旧バージョン（端末保存型）のアカウントは自動移行されません。旧パスワードで入れない場合は正常ですので、再度登録してください。',
      a_connecting:'クラウドに接続中…',
      a_err_net:'クラウドサービスに接続できません。ネットワークを確認して再読み込みしてください。'
    },

    ko: {
      brand:'TFT 도우미',
      idx_sub:'S18 자연의 힘 · Patch 18.6 · 초반 가이드 / 덱 보드 / 패치 노트',
      idx_ver:'S18 자연의 힘 · 유닛 74개 · 아이콘은 공식 CDN에서 실시간 로드',
      idx_getapp_t:'홈 화면에 설치해서 앱처럼 사용',
      idx_getapp_s:'눌러서 4단계 안내 보기 · 설치 후 홈 화면에 아이콘이 생깁니다',
      idx_getapp_go:'보기',
      idx_card1_t:'작전대 (초반 가이드 + 보드)',
      idx_card1_d:'가져온 유닛을 탭하면 어떤 덱을 갈지 실시간으로 알려줍니다. 부족한 유닛, 대체 카드, 전환 덱까지 바로 안내.',
      idx_tag1:'메인',
      idx_card2_t:'패치 노트 & 덱 이해',
      idx_card2_d:'매 패치의 유닛 / 특성 / 아이템 상세 수치 변경을 수록하고, 해당 유닛이 속한 글로벌 덱의 구간 데이터와 자동 연동 — 강해졌는지, 약해졌는지, 누구를 카운터하는지까지 정리.',
      idx_tag2:'패치',
      idx_card3_t:'패치 노트 & 덱 이해',
      idx_card3_d:'패치 변경 상세 데이터와 덱 영향 분석.',
      idx_tag3:'패치',
      idx_foot1:'유닛 아이콘은 게임 내 공식 이미지(몬스터 포함)이며 Riot CDN에서 실시간 로드되어 업데이트를 자동 반영합니다.',
      idx_foot2:'덱 데이터는 랭크 통계 실측값(tftcodex.com, 2026-11-12 수집)이며 패치 후 재보정됩니다.',

      bd_board:'작전대',
      bd_ver:'S18 자연의 힘 · Patch 18.6',
      bd_tip:'무엇을 갈지 모르겠으면 → 먼저 \'초반 가이드\'',
      tab_guide:'초반 가이드', tab_new:'신', tab_lib:'덱 · 보드', tab_stats:'승률 · 티어표', tab_dex:'아이템 · 도감',
      g_hand:'내 유닛', g_hand_sub:'아래 영웅을 탭해 추가, 한 번 더 탭하면 해제',
      g_snap_shot:'스크린샷 인식', g_snap_cam:'카메라 인식', g_snap_file:'로컬 파일',
      snap_shot_t:'스크린샷 인식 · 3단계', snap_shot_1:'게임으로 전환해 <b>전원+볼륨 다운</b>을 동시에 눌러 캡처', snap_shot_2:'이 앱으로 돌아오기', snap_shot_3:'아래 버튼을 눌러 방금 캡처한 이미지 선택', snap_shot_go:'📁 스크린샷 선택',
      snap_sys:'당신은 TFT 스크린샷 인식기입니다. 두 장의 이미지가 전송됩니다. 첫 번째는 전체 유닛 참조표(초상화 아래 이름), 두 번째는 사용자 스크린샷입니다. 참조표 초상화와 대조하여 식별하세요. JSON 배열만 출력하고 설명이나 코드펜스는 금지입니다.',
      snap_prompt:'첫 번째 이미지는 전체 유닛 참조표(각 초상화 아래 이름), 두 번째는 TFT 스크린샷(상점, 판, 결과 화면)입니다. 스크린샷에 보이는 각 유닛을 참조표 초상화와 대조해 이름을 출력하세요. 반드시 다음 목록에서 한 글자도 다르지 않게: {names}. 아이템·특성·몬스터는 무시하고, 같은 이름은 한 번만, 참조표와 명확히 일치하지 않으면 제외하세요. JSON 배열만 출력 (예: ["드레이븐"]).',
      snap_reading:'스크린샷 분석 중…', snap_reading_sub:'AI가 이미지를 읽는 중, 몇 초 걸립니다',
      snap_done:'추가됨', snap_none:'챔피언을 인식하지 못했습니다', snap_missed:'｜불일치: ',
      snap_fail:'인식 실패', snap_nofind:'유효한 목록이 반환되지 않았습니다. 더 선명한 이미지를 시도하세요',
      snap_badimg:'이미지를 읽지 못했습니다', snap_needlogin:'인식 기능은 로그인 후 사용할 수 있습니다',
      g_pool:'영웅 풀', g_pool_sub:'비용별 그룹 · 회색＝수록 덱에 없는 유닛(임시 / 몬스터 / 락스 형태) · 길게 눌러 이유 확인',
      g_which:'어떤 덱을 갈까',
      lb_rank:'덱 티어 통계', lb_rank_sub:'티어를 바꿔 해당 구간 실측 보기 · 숫자가 낮을수록 강함 · 행을 눌러 보드에 불러오기',
      th_comp:'덱', th_tier:'티어', th_avg:'평균 순위', th_top4:'탑4율', th_win:'우승률', th_win_all:'전체 우승률', th_games:'표본 수', th_play:'사용률',
      reg_all:'글로벌', fmeta_t:'해외 서버 Meta', fmeta_sub:'KR / EUW / NA / OCE · Patch 18.6 실시간 통계 · 서버를 바꿔 현지 메타 확인',
      fmeta_note:'출처: tactics.tools (2026-11-12 수집). 순위＝해당 서버 평균 순위, 사용률＝해당 서버 전체 대비 비율. 300판 미만 조합은 제외했고 *는 표본 부족입니다.',
      fmeta_empty:'이 티어 / 서버는 아직 표본이 충분하지 않습니다.',
      lb_stat_note_live:'현재 {rank} 실측 표시 중 (글로벌 표본 약 {n}판) · 전체 우승률 = 플래티넘+ 풀(출처의 최광 구간) · 출처 tactics.tools Patch 18.6 (2026-11-12 수집) · 티어는 해당 구간 평균 순위 기준 · 매칭 없는 덱은 — 또는 tftcodex 데이터',
      lb_stat_note:'출처: tftcodex.com (2026-11-12, Patch 18.6). 13개 덱은 Diamond+ 실측 데이터 보유. 나머지 5개는 해당 패밀리가 미수록(6일간 400전 미만)이라 \'—\' 표시. 티어 배지는 공략 기준.',
      lb_board:'보드', reset:'보드 초기화',
      lb_stage:'덱 전환', lb_stage_sub:'초반 임시 → 중반 보강 → 최종 완성 (단계별 레벨·저축/지출·아이템 표기)',
      lb_flow:'운영 리듬', lb_more:'배치 상세 / 흔한 실수 / 포기 타이밍',
      op_assist:'어시스턴트', op_carry:'메인 캐리', op_traits:'시너지 (실시간)', op_miss:'무엇이 부족한가', op_code:'덱 코드',
      lg_ad:'AD', lg_ap:'AP', lg_def:'방어', lg_ut:'유틸', lg_em:'문장',
      dex_item:'아이템 도감', dex_item_sub:'아이템을 눌러 조합 경로 확인 · 재료를 누르면 만들 수 있는 아이템 표시',
      dex_hero:'영웅 도감', dex_hero_sub:'유닛 74개 · 탭하여 시너지 / 목표 별 / 추천 아이템 확인',
      bd_foot:'덱 데이터는 CN 서버 S18 \'자연의 힘\' 18.6 게임 내 파일 기준. 티어 통계는 tftcodex.com Diamond+ 최근 6일(2026-11-12). 핫픽스에 따라 변동됩니다.',

      mn_manual:'작전 매뉴얼',
      mn_tab_comps:'덱', mn_tab_econ:'경제', mn_tab_aug:'증강체', mn_tab_plan:'판단과 전환',
      mn_cur:'현재 상황', mn_interest:'이자 구간', mn_sim:'다음 8라운드 시뮬레이션', mn_todo:'무엇을 할까',
      mn_three:'먼저 기억할 세 가지', mn_rescue:'잘못 가져왔을 때 구제 · 교체표', mn_auglib:'자주 나오는 증강체',
      mn_break:'문장 · 자연의 힘 단계 규칙', mn_win:'초반에 결정: 이 판의 승리 플랜',
      mn_stage:'단계별로 봐야 할 숫자', mn_signal:'이 신호가 보이면 즉시 전환',
      mn_tagline:'덱을 어떻게 모을지, 증강체 선택, 실수 구제, 언제 물러날지',
      mn_foot1:'출처: CN 18.6 게임 내 데이터, tftcodex.com Diamond+ 랭크 표본(2026-11-12, 최근 6일).',
      mn_foot2:'덱 강함은 핫픽스에 따라 변동합니다.', mn_foot3:'덱 코드', mn_foot4:'는 게임 내 팀 플래너에 붙여넣으면 바로 불러와집니다. 이후 배치도대로 배치하세요.',
      mn_foot:'출처: CN 18.6 게임 내 데이터, tftcodex.com Diamond+ 랭크 표본(2026-11-12, 최근 6일).\u3000강함은 핫픽스에 따라 변동. <b>덱 코드</b>는 게임 내 \'팀 플래너\'에 붙여넣으면 바로 불러와집니다. 이후 배치도대표 배치해 주세요.',

      ec_planner:'경제 플래너',
      ec_sub:'현재 상황을 입력하면 이번 라운드에 모을지 쓸지 알려줍니다',
      mn_cur2:'현재 상황',
      l_round:'라운드', l_hp:'체력', l_level:'레벨', l_xp:'현재 XP', l_gold:'골드',
      l_streak:'연승 / 연패', l_target:'목표 레벨', l_spend:'이번 라운드 예정 지출',
      k_income:'이번 라운드 총수입', k_income_n:'기본 + 이자 + 연승',
      k_next:'다음 라운드 사용 가능', k_next_n:'이번 라운드 지출 포함',
      k_xp_pre:'Lv.', k_xp_suf:'까지 남은 XP',
      mn_interest2:'이자 구간', mn_sim2:'다음 8라운드 시뮬레이션', mn_todo2:'무엇을 할까',
      s_round:'라운드', s_level:'레벨', s_gold:'시작 골드', s_income:'수입', s_interest:'이자', s_streak2:'연승', s_slack:'여유',
      ec_hint:'지출은 이자 손실로 이어집니다: 10골드마다 +1이라 쓰면 구간이 내려갈 수 있습니다.',
      ec_foot:'수입 규칙: 1-2/1-3 각 2G, 1-4 3G, 2-1 4G, 2-2부터 매 라운드 5G. PVP 승리 시 +1.\u3000연승/연패 2-4 +1, 5연 +2, 6연 이상 +3. 이자는 10골드마다 +1, 최대 5.\u3000매 라운드 자연 2XP, XP 구매 4G=4XP, 리프레시 2G.',

      a_tag:'S18 자연의 힘 · 가입하면 전체 기능 사용 가능',
      a_login:'로그인', a_reg:'회원가입',
      a_nick:'닉네임', a_nick_tip:'선택 · 게임에서 불리는 이름',
      a_email:'이메일', a_email_tip:'QQ / 163 / Gmail 모두 가능',
      a_code:'이메일 인증번호', a_code_tip:'\'코드 받기\'를 누른 뒤 메일함(스팸함 포함) 확인',
      a_getcode:'코드 받기', a_resend:'다시 보내기',
      a_pwd:'비밀번호', a_pwd_ph:'6자 이상', a_pwd2:'비밀번호 확인', a_pwd2_ph:'다시 입력',
      a_go_login:'로그인', a_go_reg:'가입하고 입장', a_go_reset:'비밀번호 재설정', a_wait:'잠시만요…',
      a_link_code:'인증번호로 로그인', a_link_pwd:'비밀번호로 로그인', a_link_forgot:'비밀번호를 잊으셨나요?',
      a_link_have:'계정이 있나요? 로그인', a_link_back:'로그인으로 돌아가기',
      a_wechat:'WeChat 간편 로그인', a_google:'Google 간편 로그인', a_or:'또는 이메일로', a_logout:'로그아웃',
      a_wx_inwechat:'위챗 안에서 열린 페이지라 자기 QR을 스캔할 수 없습니다. 오른쪽 위 "···" → 브라우저에서 열기 후 다시 시도하거나, 이메일로 가입하세요.',
      a_wx_mobile:'휴대폰으로는 자기 화면의 QR을 스캔할 수 없습니다. 위챗 로그인은 링크를 PC에서 열어 주세요. 휴대폰에서는 이메일 로그인이 더 빠릅니다.',
      a_wx_popup:'새 창에 위챗 QR 코드가 열렸습니다. 휴대폰 위챗으로 스캔하면 여기로 돌아와 로그인됩니다.',
      a_wx_tip:'위챗 로그인은 새 창에 QR 코드를 보여줍니다. 휴대폰 위챗으로 스캔하세요. QR 페이지가 안 열리거나 "브라우저 미지원"이 뜨면 Chrome/Edge로 열거나 아래 이메일 로그인을 쓰세요.',
      pos_t:'배치와 픽', pos_t_sub:'초반 / 최종 배치 · 레벨별 픽 우선순위 · 카루셀 우선',
      pos_early:'초반 배치(2-1부터)', pos_final:'최종 배치', pos_dim:'회색은 임시 유닛, 오면 교체',
      pos_bylevel:'레벨별 픽 (낮은 레벨일수록 우선)', pos_carousel:'카루셀 우선', pos_levelup:'레벨업 경로',
      a_note1:'계정은 클라우드에 저장: 한 번 가입하면 폰·PC·브라우저를 바꿔도 같은 계정으로 이어서 사용할 수 있습니다.',
      a_note2:'가입 시 이메일로 인증번호를 보냅니다(스팸함도 확인). 비밀번호 재설정도 이메일로 가능합니다.',
      a_note_warn:'주의: 구버전(로컬 저장) 계정은 자동 이전되지 않습니다. 기존 비밀번호로 로그인되지 않는 것은 정상이며 다시 가입하면 됩니다.',
      a_connecting:'클라우드에 연결 중…',
      a_err_net:'클라우드 서비스에 연결할 수 없습니다. 네트워크 확인 후 새로고침해 주세요.'
    }
  };

  var NAMES = { zh:'中文', en:'English', ja:'日本語', ko:'한국어' };
  var KEY = 'tft_lang';
  var lang = 'zh';
  try { var saved = localStorage.getItem(KEY); if (saved && DICT[saved]) lang = saved; } catch (e) {}
  if (lang === 'zh') {
    try {
      var nav = (navigator.language || 'zh').toLowerCase();
      if (nav.indexOf('en') === 0) lang = 'en';
      else if (nav.indexOf('ja') === 0) lang = 'ja';
      else if (nav.indexOf('ko') === 0) lang = 'ko';
    } catch (e) {}
  }

  function T(key) {
    var d = DICT[lang] || DICT.zh;
    return (d && d[key] !== undefined) ? d[key] : (DICT.zh[key] !== undefined ? DICT.zh[key] : key);
  }

  function apply() {
    document.documentElement.lang = (lang === 'zh') ? 'zh-CN' : lang;
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) els[i].textContent = T(els[i].getAttribute('data-i18n'));
    var phs = document.querySelectorAll('[data-i18n-ph]');
    for (var j = 0; j < phs.length; j++) phs[j].setAttribute('placeholder', T(phs[j].getAttribute('data-i18n-ph')));
    var pill = document.getElementById('tftLangPill');
    if (pill) pill.querySelector('b').textContent = NAMES[lang];
  }

  /* ---- 右下角语言球 ---- */
  var PILL_CSS = '#tftLangPill{position:fixed; right:14px; bottom:14px; z-index:10050; display:flex; align-items:center; gap:6px;' +
    'background:rgba(20,26,38,.92); border:1px solid #2a3247; color:#c3cbdb; border-radius:999px; padding:7px 12px;' +
    'font:12px "PingFang SC","Microsoft YaHei",system-ui,sans-serif; cursor:pointer; user-select:none; backdrop-filter:blur(6px);}' +
    '#tftLangPill b{color:#f0b544; font-weight:600;}' +
    '#tftLangMenu{position:fixed; right:14px; bottom:52px; z-index:10050; background:#141a26; border:1px solid #2a3247;' +
    'border-radius:12px; padding:6px; display:none; min-width:120px; box-shadow:0 14px 40px rgba(0,0,0,.5);}' +
    '#tftLangMenu.on{display:block;}' +
    '#tftLangMenu button{display:block; width:100%; text-align:left; border:0; background:transparent; color:#c3cbdb;' +
    'padding:8px 12px; border-radius:8px; font:12.5px "PingFang SC","Microsoft YaHei",system-ui,sans-serif; cursor:pointer;}' +
    '#tftLangMenu button:hover{background:#1f2940; color:#f0b544;}' +
    '#tftLangMenu button.on{color:#f0b544; font-weight:600;}';
  function buildPill() {
    if (document.getElementById('tftLangPill')) return;
    var st = document.createElement('style');
    st.textContent = PILL_CSS;
    document.head.appendChild(st);
    var pill = document.createElement('div');
    pill.id = 'tftLangPill';
    pill.innerHTML = '🌐 <b></b> ▾';
    var menu = document.createElement('div');
    menu.id = 'tftLangMenu';
    menu.innerHTML = Object.keys(NAMES).map(function (k) {
      return '<button data-lang="' + k + '" class="' + (k === lang ? 'on' : '') + '">' + NAMES[k] + '</button>';
    }).join('');
    document.body.appendChild(menu);
    document.body.appendChild(pill);
    pill.onclick = function () { menu.classList.toggle('on'); };
    menu.querySelectorAll('button').forEach(function (b) {
      b.onclick = function () {
        lang = b.dataset.lang;
        try { localStorage.setItem(KEY, lang); } catch (e) {}
        menu.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x.dataset.lang === lang); });
        apply();
        menu.classList.remove('on');
        document.dispatchEvent(new CustomEvent('tftlangchange', { detail: lang }));
      };
    });
    watchPill();
    apply();
  }

  /* ---- 语言球只出现在：主页面(index.html) 和 登录门禁(authGate) 上。
          进了作战台内页就隐藏，不再跟着页面滚动挡内容 ---- */
  function pillVisible() {
    var p = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (p === '' || p === 'index.html') return true;
    return !!document.getElementById('authGate');
  }
  function updatePill() {
    var pill = document.getElementById('tftLangPill');
    if (!pill) return;
    var on = pillVisible();
    pill.style.display = on ? 'flex' : 'none';
    if (!on) { var m = document.getElementById('tftLangMenu'); if (m) m.classList.remove('on'); }
  }
  function watchPill() {
    updatePill();
    /* 登录门禁是异步创建/移除的，用 MutationObserver 跟住 */
    try {
      new MutationObserver(updatePill).observe(document.body, { childList: true, subtree: false });
    } catch (e) { setInterval(updatePill, 800); }
  }

  window.tftT = T;
  window.tftLang = function () { return lang; };
  window.tftApplyI18n = apply;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildPill);
  else buildPill();
})();
