/* ============================================================
   云顶助手 · 站位与拿牌共享模块
   POS[compId] = {
     final : [名,row,col]  成型站位（棋盘 4 排×7 列；row 0=前排贴对手 / row 1=后排沉底，col 0-6 左→右）
     early : [名,row,col]  前期（2-1 起）站位
     byLevel : [{lv, units:[名], note}]   几级拿什么牌
     carousel: 选秀（旋转木马）优先散件
     levelUp : 升级路线（几阶段上几人口）
   }
   仅供 board.html / manual.html 引用，不依赖页面全局。
   ============================================================ */
(function () {

const POS = {

  /* ---------- S 巨龙德莱文 · 上九运营 ---------- */
  draven: {
    final: [['峡谷迅捷蟹',0,1],['阿木木',0,2],['茂凯',0,3],['塔里克',0,4],['苍蓝雕纹魔像',0,5],
            ['德莱文',1,0],['凯南',1,1],['艾翁',1,2],['远古巨龙',1,3]],
    early: [['峡谷迅捷蟹',0,2],['深红锋喙鸟',0,3],['韦鲁斯',1,2],['凯尔',1,4]],
    byLevel: [
      {lv:4, units:['峡谷迅捷蟹','深红锋喙鸟','韦鲁斯','凯尔'], note:'野怪二档 + 物理打工，大剑弓先攥手里给德莱文存着'},
      {lv:5, units:['峡谷迅捷蟹','深红锋喙鸟','魔沼蛙','韦鲁斯','凯尔'], note:'凑野怪三档，连败也认——这套靠 9 级翻盘'},
      {lv:6, units:['苍蓝哨戒','峡谷迅捷蟹','深红锋喙鸟','魔沼蛙','韦鲁斯','黛安娜'], note:'3-2 上 6，凑羁绊不是买质量'},
      {lv:7, units:['苍蓝哨戒','峡谷迅捷蟹','深红锋喙鸟','魔沼蛙','韦鲁斯','黛安娜','阿木木'], note:'死保 50 利息，这个等级池里没有你要的牌，全卖都不心疼'},
      {lv:9, units:['茂凯','阿木木','塔里克','苍蓝雕纹魔像','凯南','艾翁','远古巨龙','德莱文','峡谷迅捷蟹'], note:'5-1 上 9 开搜：平均 33 抽（66 金）出二星德莱文，有同行按 54 抽备预算'}
    ],
    carousel:'大剑 > 反曲弓 > 拳套（德莱文：鬼索 / 海妖 / 死亡之刃）',
    levelUp:'2-1 上4 · 3-2 上6 · 4 阶段不上7 · 5-1 上9 开搜'
  },

  /* ---------- A 日蚀芸阿娜 · 六人口追三 ---------- */
  yunara: {
    final: [['蕾欧娜',0,2],['约里克',0,3],['瑟庄妮',0,4],
            ['乐芙兰',1,3],['芸阿娜',1,4],['凯尔',1,5],['卡尔玛',1,6]],
    early: [['蕾欧娜',0,3],['卡尔玛',1,3],['凯尔',1,5]],
    byLevel: [
      {lv:4, units:['蕾欧娜','约里克','卡尔玛','凯尔'], note:'日蚀 + 灵魂莲华骨架直接开摆，追三名单里的一费见就拿'},
      {lv:5, units:['蕾欧娜','约里克','瑟庄妮','卡尔玛','芸阿娜'], note:'2-5 上 5 摆半，商店只留名单内的牌'},
      {lv:6, units:['蕾欧娜','约里克','瑟庄妮','卡尔玛','芸阿娜','凯尔'], note:'3-1 上 6 摆满 = 毕业阵容，开始 D 到三星'},
      {lv:7, units:['蕾欧娜','约里克','瑟庄妮','卡尔玛','芸阿娜','凯尔','乐芙兰'], note:'不升 7。五个三星才算毕业，钱全砸 D 牌'}
    ],
    carousel:'眼泪 > 大棒 > 腰带（卡尔玛：蓝霸符 / 珠光 / 大天使）',
    levelUp:'2-1 上3 · 2-5 上5 · 3-1 上6 · 之后不升，D 到毕业'
  },

  /* ---------- A 神谕阿狸 · 八人口运营 ---------- */
  ahri: {
    final: [['苍蓝雕纹魔像',0,3],['瑟提',0,4],
            ['阿狸',1,0],['提莫',1,1],['易',1,2],['艾希',1,4],['卡西奥佩娅',1,5],['莫甘娜',1,6]],
    early: [['奥恩',0,3],['提莫',1,2],['卡尔玛',1,4]],
    byLevel: [
      {lv:4, units:['奥恩','蕾欧娜','提莫','卡尔玛'], note:'神谕 + 护卫过渡，法系散件先给卡尔玛打工'},
      {lv:5, units:['奥恩','提莫','卡尔玛','卡西奥佩娅','赫卡里姆'], note:'三费开始进场，血量比经济重要一点'},
      {lv:6, units:['苍蓝雕纹魔像','赫卡里姆','提莫','卡西奥佩娅','卡尔玛','乐芙兰'], note:'魔像到手就换上——誓约回蓝骨架从他开始'},
      {lv:7, units:['苍蓝雕纹魔像','瑟提','提莫','卡西奥佩娅','易','阿狸'], note:'阿狸一星就停手攒钱，四阶段拉 8 才是本体'},
      {lv:8, units:['苍蓝雕纹魔像','瑟提','阿狸','莫甘娜','易','艾希','提莫','卡西奥佩娅'], note:'满编开搜，目标全队二星，不追三'}
    ],
    carousel:'眼泪 > 大棒 > 金铲铲（阿狸：神谕纹章 / 珠光 / 强袭者的链枷）',
    levelUp:'2-1 上4 · 3-2 上6 · 4-1 上7 · 四阶段拉 8 开搜'
  },

  /* ---------- B 主宰婕拉 · 八人口运营 ---------- */
  zyra: {
    final: [['峡谷迅捷蟹',0,0],['洛',0,1],['约里克',0,2],['阿木木',0,3],['瑟庄妮',0,4],['蔚',0,5],
            ['婕拉',1,2],['奈德丽',1,4]],
    early: [['约里克',0,3],['瑟庄妮',0,4],['维迦',1,2],['卡尔玛',1,3]],
    byLevel: [
      {lv:4, units:['约里克','瑟庄妮','卡尔玛','维迦'], note:'召唤师 + AP 打工，婕拉的装先给卡尔玛'},
      {lv:5, units:['约里克','瑟庄妮','蔚','深红锋喙鸟','卡尔玛'], note:'主宰档往上凑，斗士前排先顶'},
      {lv:6, units:['约里克','瑟庄妮','蔚','峡谷迅捷蟹','克格莫','深红锋喙鸟'], note:'主宰三档成型，血量健康可以继续连'},
      {lv:7, units:['峡谷迅捷蟹','洛','约里克','阿木木','瑟庄妮','克格莫','婕拉'], note:'婕拉到手就围绕她摆，AP 三件优先合'},
      {lv:8, units:['峡谷迅捷蟹','洛','约里克','阿木木','瑟庄妮','蔚','婕拉','奈德丽'], note:'满编停手不追三，钱留着补二星或上 9'}
    ],
    carousel:'大棒 > 腰带 > 泪水（婕拉：莫雷洛 / 帽子 / 枪刃）',
    levelUp:'2-1 上4 · 3-2 上6 · 4-1 上7 · 四阶段拉 8'
  },

  /* ---------- A 兽灵奈德丽 · 八人口运营 ---------- */
  nidalee: {
    final: [['洛',0,1],['苍蓝雕纹魔像',0,2],['慎',0,3],['阿木木',0,4],['莉莉娅',0,5],
            ['克格莫',1,2],['奈德丽',1,4],['希维尔',1,5]],
    early: [['慎',0,3],['韦鲁斯',1,2],['凯尔',1,4]],
    byLevel: [
      {lv:4, units:['洛','慎','韦鲁斯','凯尔'], note:'护卫 + 物理打工，奈德丽的物理装先给韦鲁斯'},
      {lv:5, units:['洛','慎','克格莫','韦鲁斯','凯尔'], note:'兽灵档往上凑'},
      {lv:6, units:['洛','慎','黛安娜','克格莫','韦鲁斯','希维尔'], note:'希维尔到了先摆上，和奈德丽共用攻速装'},
      {lv:7, units:['洛','苍蓝雕纹魔像','慎','阿木木','克格莫','奈德丽','希维尔'], note:'奈德丽一星接管比赛，物理三件给她'},
      {lv:8, units:['洛','苍蓝雕纹魔像','慎','阿木木','莉莉娅','克格莫','奈德丽','希维尔'], note:'满编补二星，不追三'}
    ],
    carousel:'大剑 > 反曲弓 > 泪水（奈德丽：海妖 / 羊刀 / 死亡之刃）',
    levelUp:'2-1 上4 · 3-2 上6 · 4-1 上7 · 四阶段拉 8'
  },

  /* ---------- B 重装厄斐琉斯 · 八人口运营 ---------- */
  aphelios: {
    final: [['暗影狼',0,1],['赫卡里姆',0,2],['黛安娜',0,3],['绯红印记树怪',0,4],['塔里克',0,5],
            ['深红锋喙鸟',1,1],['婕拉',1,3],['厄斐琉斯',1,5]],
    early: [['蕾欧娜',0,2],['慎',0,4],['韦鲁斯',1,3],['凯尔',1,5]],
    byLevel: [
      {lv:4, units:['蕾欧娜','慎','韦鲁斯','凯尔'], note:'重装二档 + 韦鲁斯物理打工'},
      {lv:5, units:['暗影狼','蕾欧娜','慎','韦鲁斯','凯尔'], note:'野怪 / 重装混搭，保持前排厚度'},
      {lv:6, units:['暗影狼','赫卡里姆','黛安娜','韦鲁斯','凯尔','婕拉'], note:'三费重装到位，厄斐琉斯没来先靠韦鲁斯'},
      {lv:7, units:['暗影狼','赫卡里姆','黛安娜','绯红印记树怪','婕拉','厄斐琉斯','深红锋喙鸟'], note:'厄斐琉斯一星即换 C，装备原样搬'},
      {lv:8, units:['暗影狼','赫卡里姆','黛安娜','绯红印记树怪','塔里克','婕拉','厄斐琉斯','深红锋喙鸟'], note:'满编二星，五费塔里克随缘'}
    ],
    carousel:'大剑 > 反曲弓 > 腰带（厄斐琉斯：死亡之刃 / 海妖 / 轻语）',
    levelUp:'2-1 上4 · 3-2 上6 · 4-1 上7 · 四阶段拉 8'
  },

  /* ---------- S 七野怪红蓝 · 一费赌狗 ---------- */
  riftblue: {
    final: [['峡谷迅捷蟹',0,1],['远古石甲虫',0,2],['苍蓝雕纹魔像',0,3],['纳尔',0,4],['塔里克',0,5],
            ['绯红树怪',1,1],['深红锋喙鸟',1,2],['苍蓝哨戒',1,3],['远古巨龙',1,4]],
    early: [['峡谷迅捷蟹',0,2],['深红锋喙鸟',0,3],['苍蓝哨戒',1,2],['绯红树怪',1,4]],
    byLevel: [
      {lv:4, units:['峡谷迅捷蟹','深红锋喙鸟','苍蓝哨戒','绯红树怪'], note:'开局就是本体，四张一费 / 野怪直接追'},
      {lv:5, units:['峡谷迅捷蟹','远古石甲虫','深红锋喙鸟','苍蓝哨戒','绯红树怪'], note:'加三费野怪，野怪档往上叠'},
      {lv:6, units:['峡谷迅捷蟹','远古石甲虫','苍蓝雕纹魔像','深红锋喙鸟','苍蓝哨戒','绯红树怪'], note:'6 人口满编 = 毕业阵容，D 到苍蓝哨戒三星'},
      {lv:7, units:['峡谷迅捷蟹','远古石甲虫','苍蓝雕纹魔像','纳尔','深红锋喙鸟','苍蓝哨戒','绯红树怪'], note:'五费随缘，不主动拉 7 追质量'}
    ],
    carousel:'大剑 > 反曲弓 > 腰带（苍蓝哨戒物理三件）',
    levelUp:'2-1 上4 · 2-5 上5 · 3-1 上6 · 满编后不升，D 到三星'
  },

  /* ---------- A 日月双蚀韦鲁斯 · 一费赌狗 ---------- */
  varus: {
    final: [['蕾欧娜',0,2],['瑟庄妮',0,3],['慎',0,4],['黛安娜',0,5],
            ['阿卡丽',1,1],['凯尔',1,2],['韦鲁斯',1,3],['厄斐琉斯',1,4],['拉露恩',1,5]],
    early: [['蕾欧娜',0,3],['阿卡丽',1,2],['韦鲁斯',1,3],['凯尔',1,4]],
    byLevel: [
      {lv:4, units:['蕾欧娜','阿卡丽','韦鲁斯','凯尔'], note:'日蚀 + 双射手开摆，韦鲁斯直接追三'},
      {lv:5, units:['蕾欧娜','瑟庄妮','阿卡丽','韦鲁斯','凯尔'], note:'二费前排补档'},
      {lv:6, units:['蕾欧娜','瑟庄妮','慎','阿卡丽','韦鲁斯','凯尔'], note:'满编追三，双蚀档靠三星数量抬'},
      {lv:7, units:['蕾欧娜','瑟庄妮','慎','黛安娜','阿卡丽','韦鲁斯','凯尔'], note:'三费黛安娜补前排质量'},
      {lv:8, units:['蕾欧娜','瑟庄妮','慎','黛安娜','阿卡丽','凯尔','韦鲁斯','厄斐琉斯'], note:'四费厄斐琉斯收尾，血量差就 D 到死'}
    ],
    carousel:'大剑 > 反曲弓 > 拳套（韦鲁斯：海妖 / 羊刀 / 死亡之刃）',
    levelUp:'2-1 上4 · 2-5 上5 · 3-1 上6 · D 到三星再考虑升级'
  },

  /* ---------- B 宝宝学院阿卡丽 · 一费赌狗 ---------- */
  akali: {
    final: [['奥恩',0,2],['蕾欧娜',0,3],['瑟庄妮',0,4],['阿木木',0,5],
            ['卡蜜尔',1,1],['韦鲁斯',1,2],['阿卡丽',1,3],['凯尔',1,4]],
    early: [['蕾欧娜',0,3],['卡蜜尔',1,2],['阿卡丽',1,3],['韦鲁斯',1,4]],
    byLevel: [
      {lv:4, units:['蕾欧娜','卡蜜尔','阿卡丽','韦鲁斯'], note:'一费全家桶开局，阿卡丽见就拿'},
      {lv:5, units:['奥恩','蕾欧娜','卡蜜尔','阿卡丽','韦鲁斯'], note:'前排补厚，质量优先'},
      {lv:6, units:['奥恩','蕾欧娜','瑟庄妮','卡蜜尔','韦鲁斯','阿卡丽'], note:'满编 D 三星，阿卡丽是唯一核心'},
      {lv:7, units:['奥恩','蕾欧娜','瑟庄妮','阿木木','卡蜜尔','韦鲁斯','阿卡丽'], note:'三星到手再上 7，凯尔补迅捷档'}
    ],
    carousel:'大剑 > 拳套 > 腰带（阿卡丽：死亡之刃 / 无尽 / 饮血）',
    levelUp:'2-1 上4 · 2-5 上5 · 3-1 上6 · D 到三星再上'
  },

  /* ---------- C 黑暗仪式伊莉丝 · 六人口追三 ---------- */
  elise: {
    final: [['洛',0,1],['赫卡里姆',0,2],['苍蓝雕纹魔像',0,3],['黛安娜',0,4],['卡蜜尔',0,5],
            ['卡西奥佩娅',1,2],['伊莉丝',1,3],['拉露恩',1,4],['莫甘娜',1,5]],
    early: [['卡蜜尔',0,3],['蕾欧娜',0,4],['卡西奥佩娅',1,2],['伊莉丝',1,3]],
    byLevel: [
      {lv:4, units:['卡蜜尔','蕾欧娜','伊莉丝','卡西奥佩娅'], note:'本体 2 费伊莉丝开局见就拿，魔女 / 召唤档往上凑'},
      {lv:5, units:['卡蜜尔','赫卡里姆','伊莉丝','卡西奥佩娅','莫甘娜'], note:'莫甘娜副 C，重伤装备先给她'},
      {lv:6, units:['赫卡里姆','洛','黛安娜','卡西奥佩娅','伊莉丝','莫甘娜'], note:'满编 D 到伊莉丝三星'},
      {lv:7, units:['赫卡里姆','洛','苍蓝雕纹魔像','黛安娜','卡西奥佩娅','伊莉丝','莫甘娜'], note:'三星后血量好才拉 7，五费塔里克随缘'}
    ],
    carousel:'大棒 > 腰带 > 泪水（伊莉丝：莫雷洛 / 帽子 / 枪刃）',
    levelUp:'2-1 上4 · 2-5 上5 · 3-1 上6 · D 到三星毕业'
  },

  /* ---------- S 永恒之森卡尔玛 · 一费赌狗 ---------- */
  karma: {
    final: [['奥恩',0,2],['阿利斯塔',0,3],['赫卡里姆',0,4],['瑟提',0,5],
            ['乐芙兰',1,1],['费德提克',1,2],['卡尔玛',1,3],['阿狸',1,4],['拉克丝 (永恒之森)',1,5]],
    early: [['奥恩',0,3],['乐芙兰',1,2],['卡尔玛',1,3],['维迦',1,4]],
    byLevel: [
      {lv:4, units:['奥恩','卡尔玛','维迦','乐芙兰'], note:'卡尔玛直接追三，永恒之森档往上凑'},
      {lv:5, units:['奥恩','阿利斯塔','卡尔玛','维迦','乐芙兰'], note:'二费前排 + 法师档'},
      {lv:6, units:['奥恩','阿利斯塔','赫卡里姆','卡尔玛','乐芙兰','费德提克'], note:'满编 D 三星，卡尔玛是唯一核心'},
      {lv:7, units:['奥恩','阿利斯塔','赫卡里姆','瑟提','费德提克','卡尔玛','乐芙兰'], note:'三星后补四费前排'},
      {lv:8, units:['奥恩','瑟提','阿利斯塔','赫卡里姆','费德提克','乐芙兰','卡尔玛','阿狸'], note:'阿狸 / 拉克丝五费随缘，钱留着补二星'}
    ],
    carousel:'眼泪 > 大棒 > 腰带（卡尔玛：蓝霸符 / 珠光 / 大天使）',
    levelUp:'2-1 上4 · 2-5 上5 · 3-1 上6 · D 到三星再上'
  },

  /* ---------- C 日蚀霞凯尔 · 六人口三个三 ---------- */
  xiakayle: {
    final: [['蕾欧娜',0,2],['洛',0,3],['瑟庄妮',0,4],
            ['奥恩',1,2],['霞',1,3],['凯尔',1,4]],
    early: [['蕾欧娜',0,3],['霞',1,2],['凯尔',1,4]],
    byLevel: [
      {lv:4, units:['蕾欧娜','奥恩','霞','凯尔'], note:'日蚀 + 双子射手开摆，霞见就拿'},
      {lv:5, units:['蕾欧娜','洛','奥恩','霞','凯尔'], note:'护卫档 + 追三名单'},
      {lv:6, units:['蕾欧娜','洛','瑟庄妮','奥恩','霞','凯尔'], note:'满编 D 三星：霞 / 凯尔 / 任意前排三张三星毕业'}
    ],
    carousel:'大剑 > 反曲弓 > 拳套（霞：海妖 / 羊刀 / 死亡之刃）',
    levelUp:'2-1 上4 · 2-5 上5 · 3-1 上6 · D 到三个三星'
  },

  /* ---------- A 迅捷射手凯尔 · 六级停手搜三 ---------- */
  kaylesniper: {
    final: [['蕾欧娜',0,1],['瑟庄妮',0,2],['慎',0,3],['阿木木',0,4],['黛安娜',0,5],
            ['韦鲁斯',1,2],['凯尔',1,3],['厄斐琉斯',1,4]],
    early: [['卡蜜尔',0,4],['蕾欧娜',0,3],['韦鲁斯',1,2],['凯尔',1,3]],
    byLevel: [
      {lv:4, units:['蕾欧娜','卡蜜尔','韦鲁斯','凯尔'], note:'凯尔直接追三，攻速装全给她'},
      {lv:5, units:['蕾欧娜','瑟庄妮','卡蜜尔','韦鲁斯','凯尔'], note:'二费前排到位'},
      {lv:6, units:['蕾欧娜','瑟庄妮','慎','韦鲁斯','凯尔','黛安娜'], note:'六级停手，D 到凯尔三星 + 厄斐琉斯进场'},
      {lv:7, units:['蕾欧娜','瑟庄妮','慎','阿木木','黛安娜','韦鲁斯','凯尔'], note:'三星后再上 7，厄斐琉斯副 C'}
    ],
    carousel:'反曲弓 > 大剑 > 腰带（凯尔：羊刀 / 海妖 / 死亡之刃）',
    levelUp:'2-1 上4 · 2-5 上5 · 3-1 上6 · 停手 D 到三星'
  },

  /* ---------- A 神谕大嘴克格莫 · 八人口慢运营 ---------- */
  kogmaw: {
    final: [['苍蓝哨戒',0,1],['远古石甲虫',0,2],['苍蓝雕纹魔像',0,3],['赫卡里姆',0,4],['阿利斯塔',0,5],
            ['提莫',1,1],['克格莫',1,3],['莫甘娜',1,5]],
    early: [['苍蓝哨戒',0,2],['远古石甲虫',0,3],['提莫',1,2],['克格莫',1,3]],
    byLevel: [
      {lv:4, units:['苍蓝哨戒','远古石甲虫','克格莫','提莫'], note:'神谕 + 野怪开摆，克格莫见就拿'},
      {lv:5, units:['苍蓝哨戒','远古石甲虫','赫卡里姆','克格莫','提莫'], note:'三费克格莫一星就稳血'},
      {lv:6, units:['苍蓝哨戒','远古石甲虫','苍蓝雕纹魔像','提莫','克格莫','卡西奥佩娅'], note:'魔像誓约骨架进场'},
      {lv:7, units:['苍蓝哨戒','远古石甲虫','苍蓝雕纹魔像','赫卡里姆','提莫','克格莫','卡西奥佩娅'], note:'7 级搜克格莫二星'},
      {lv:8, units:['苍蓝哨戒','远古石甲虫','苍蓝雕纹魔像','赫卡里姆','阿利斯塔','提莫','克格莫','莫甘娜'], note:'满编二星，莫甘娜重伤覆盖'}
    ],
    carousel:'大剑 > 反曲弓 > 泪水（克格莫：海妖 / 羊刀 / 轻语）',
    levelUp:'2-1 上4 · 3-2 上6 · 4-1 上7 · 四阶段拉 8'
  },

  /* ---------- S 六荆棘裁决螳螂 · 九人口爆发 ---------- */
  khazix: {
    final: [['墨菲特',0,2],['雷克塞',0,3],['沃里克',0,4],
            ['伊泽瑞尔',1,0],['维迦',1,1],['阿兹尔',1,2],['卡兹克',1,3],['拉克丝 (黑荆棘)',1,4],['索拉卡',1,5]],
    early: [['雷克塞',0,2],['沃里克',0,3],['维迦',1,2],['阿兹尔',1,4]],
    byLevel: [
      {lv:4, units:['雷克塞','沃里克','维迦','阿兹尔'], note:'黑荆棘 + 裁决骨架，卡兹克见就拿'},
      {lv:5, units:['雷克塞','沃里克','墨菲特','维迦','阿兹尔'], note:'四费墨菲特前排'},
      {lv:6, units:['雷克塞','沃里克','墨菲特','维迦','阿兹尔','卡兹克'], note:'六荆棘档成型中'},
      {lv:7, units:['雷克塞','沃里克','墨菲特','维迦','阿兹尔','卡兹克','索拉卡'], note:'荆棘档拉满，卡兹克二星'},
      {lv:8, units:['墨菲特','雷克塞','沃里克','维迦','阿兹尔','卡兹克','索拉卡','伊泽瑞尔'], note:'四费二星凑齐'},
      {lv:9, units:['墨菲特','雷克塞','沃里克','维迦','阿兹尔','卡兹克','索拉卡','伊泽瑞尔','拉克丝 (黑荆棘)'], note:'5-1 上 9，五费收尾爆发'}
    ],
    carousel:'大剑 > 拳套 > 大棒（卡兹克：死亡之刃 / 无尽 / 轻语）',
    levelUp:'2-1 上4 · 3-2 上6 · 4-1 上7 · 4-5 上8 · 5-1 上9'
  },

  /* ---------- A 日月双蚀登神天使 · 九人口慢热 ---------- */
  kaylesolar: {
    final: [['瑟庄妮',0,1],['蕾欧娜',0,2],['慎',0,3],['阿木木',0,4],['黛安娜',0,5],
            ['韦鲁斯',1,1],['凯尔',1,3],['厄斐琉斯',1,4],['拉露恩',1,5]],
    early: [['卡蜜尔',0,4],['蕾欧娜',0,3],['韦鲁斯',1,2],['凯尔',1,3]],
    byLevel: [
      {lv:4, units:['蕾欧娜','卡蜜尔','韦鲁斯','凯尔'], note:'凯尔开局追，攻速装先合'},
      {lv:5, units:['蕾欧娜','瑟庄妮','卡蜜尔','韦鲁斯','凯尔'], note:'二费前排到位'},
      {lv:6, units:['蕾欧娜','瑟庄妮','慎','韦鲁斯','凯尔','黛安娜'], note:'双蚀档成型，凯尔二星'},
      {lv:7, units:['蕾欧娜','瑟庄妮','慎','阿木木','黛安娜','韦鲁斯','凯尔'], note:'七级补质量不升 8'},
      {lv:8, units:['蕾欧娜','瑟庄妮','慎','阿木木','黛安娜','韦鲁斯','凯尔','厄斐琉斯'], note:'四费二星'},
      {lv:9, units:['瑟庄妮','蕾欧娜','慎','阿木木','黛安娜','韦鲁斯','凯尔','厄斐琉斯','拉露恩'], note:'5-1 上 9，拉露恩登神收尾'}
    ],
    carousel:'反曲弓 > 大剑 > 腰带（凯尔：羊刀 / 海妖 / 死亡之刃）',
    levelUp:'2-1 上4 · 3-2 上6 · 4-2 上7 · 4-5 上8 · 5-1 上9'
  },

  /* ---------- B 六护卫蛇女 · 八人口慢运营 ---------- */
  cassio: {
    final: [['奥恩',0,1],['蕾欧娜',0,2],['慎',0,3],['拉莫斯',0,4],['莉莉娅',0,5],
            ['阿狸',1,1],['卡西奥佩娅',1,3],['费德提克',1,5]],
    early: [['奥恩',0,2],['蕾欧娜',0,4],['卡西奥佩娅',1,3],['卡尔玛',1,4]],
    byLevel: [
      {lv:4, units:['奥恩','蕾欧娜','卡尔玛','卡西奥佩娅'], note:'护卫 + 法系开摆，蛇女见就拿'},
      {lv:5, units:['奥恩','蕾欧娜','慎','卡西奥佩娅','卡尔玛'], note:'护卫档往上叠'},
      {lv:6, units:['奥恩','蕾欧娜','慎','拉莫斯','卡西奥佩娅','阿狸'], note:'蛇女一星即稳血'},
      {lv:7, units:['奥恩','蕾欧娜','慎','拉莫斯','莉莉娅','卡西奥佩娅','阿狸'], note:'搜蛇女二星'},
      {lv:8, units:['奥恩','蕾欧娜','慎','拉莫斯','莉莉娅','阿狸','卡西奥佩娅','费德提克'], note:'满编二星，六护卫档拉满'}
    ],
    carousel:'大棒 > 腰带 > 泪水（蛇女：莫雷洛 / 帽子 / 枪刃）',
    levelUp:'2-1 上4 · 3-2 上6 · 4-1 上7 · 四阶段拉 8'
  },

  /* ---------- C 花仙小炮 · 七级慢 D ---------- */
  xiaopao: {
    final: [['拉莫斯',0,1],['洛',0,2],['蔚',0,3],
            ['霞',1,0],['可酷伯',1,1],['莉莉娅',1,2],['崔丝塔娜',1,3],['希维尔',1,4]],
    early: [['洛',0,2],['可酷伯',1,1],['霞',1,3],['崔丝塔娜',1,2]],
    byLevel: [
      {lv:4, units:['洛','可酷伯','霞','崔丝塔娜'], note:'花仙 + 双子射手开摆'},
      {lv:5, units:['拉莫斯','洛','可酷伯','霞','崔丝塔娜'], note:'三费拉莫斯前排'},
      {lv:6, units:['拉莫斯','洛','蔚','莉莉娅','霞','崔丝塔娜'], note:'花仙档成型中，小炮追三'},
      {lv:7, units:['拉莫斯','洛','蔚','莉莉娅','可酷伯','霞','崔丝塔娜'], note:'七级慢 D 到小炮三星'},
      {lv:8, units:['拉莫斯','洛','蔚','莉莉娅','可酷伯','霞','崔丝塔娜','希维尔'], note:'5 阶段拉八，希维尔收尾副 C'}
    ],
    carousel:'大剑 > 反曲弓 > 拳套（小炮：死亡之刃 / 海妖 / 轻语）',
    levelUp:'2-1 上4 · 2-5 上5 · 3-2 上6 · 4-1 上7 慢D · 5 阶段拉 8'
  },

  /* ---------- 手册专有：永森德莱文 · 快九经济线 ---------- */
  forest: {
    final: [['茂凯',0,2],['塔里克',0,3],['凯南',0,4],
            ['艾翁',1,3],['德莱文',1,0]],
    early: [['茂凯',0,3],['凯尔',1,2],['韦鲁斯',1,4]],
    byLevel: [
      {lv:4, units:['茂凯','凯尔','韦鲁斯'], note:'永恒之森前排 + 物理打工，大剑弓先攒着'},
      {lv:5, units:['茂凯','洛','凯尔','韦鲁斯','慎'], note:'森档往上叠，连败保经济'},
      {lv:6, units:['茂凯','洛','慎','凯尔','韦鲁斯','克格莫'], note:'过渡位，质量随缘'},
      {lv:7, units:['茂凯','洛','慎','凯尔','韦鲁斯','克格莫','阿木木'], note:'死保利息，这个等级没有你要的牌'},
      {lv:9, units:['茂凯','塔里克','凯南','艾翁','德莱文'], note:'5-1 上 9 一波搜齐五费体系，德莱文二星接管'}
    ],
    carousel:'大剑 > 反曲弓 > 拳套（德莱文物理三件）',
    levelUp:'2-1 上4 · 3-2 上6 · 4 阶段保利息 · 5-1 上9'
  },

  /* ---------- 手册专有：峡谷树怪 · 八级开搜 ---------- */
  riftbeast: {
    final: [['苍蓝雕纹魔像',0,2],['峡谷迅捷蟹',0,3],['深红锋喙鸟',0,4],
            ['绯红树怪',1,1],['绯红印记树怪',1,2],['提莫',1,4]],
    early: [['峡谷迅捷蟹',0,2],['苍蓝哨戒',1,2],['绯红树怪',1,4]],
    byLevel: [
      {lv:4, units:['峡谷迅捷蟹','苍蓝哨戒','绯红树怪'], note:'野怪全家桶开局，印记单位见就拿'},
      {lv:5, units:['峡谷迅捷蟹','远古石甲虫','苍蓝哨戒','绯红树怪'], note:'野怪档往上叠'},
      {lv:6, units:['峡谷迅捷蟹','远古石甲虫','苍蓝哨戒','绯红树怪','提莫','克格莫'], note:'野怪三档成型'},
      {lv:7, units:['峡谷迅捷蟹','苍蓝雕纹魔像','深红锋喙鸟','苍蓝哨戒','绯红树怪','提莫','克格莫'], note:'四费树怪到手就围绕它摆'},
      {lv:8, units:['苍蓝雕纹魔像','峡谷迅捷蟹','深红锋喙鸟','绯红树怪','绯红印记树怪','提莫','克格莫'], note:'四阶段拉 8 开搜，树怪二星接管'}
    ],
    carousel:'大棒 > 腰带 > 泪水（树怪：印记 / 帽子 / 枪刃）',
    levelUp:'2-1 上4 · 3-2 上6 · 4-1 上7 · 四阶段拉 8 开搜'
  },

  /* ============ 以下为 tactics.tools 全球服 S/A 阵容的站位与拿牌（2026-11-12） ============ */

  /* ---------- S 沃里克 & 墨菲特 · 野怪前排战斗法师 ---------- */
  riftbeast_warwick: {
    final: [['雷克塞',0,1],['暗影狼',0,2],['远古石甲虫',0,3],['绯红印记树怪',0,4],['墨菲特',0,5],
            ['黛安娜',1,1],['沃里克',1,3],['阿兹尔',1,5]],
    early: [['雷克塞',0,2],['沃里克',0,3],['维迦',1,2],['阿兹尔',1,4]],
    byLevel: [
      {lv:4, units:['雷克塞','沃里克','维迦','阿兹尔'], note:'黑荆棘骨架开局，沃里克见就拿，吸血装先攥手里'},
      {lv:5, units:['雷克塞','暗影狼','沃里克','维迦','阿兹尔'], note:'补野怪 / 狂战士档'},
      {lv:6, units:['雷克塞','暗影狼','远古石甲虫','沃里克','阿兹尔','墨菲特'], note:'野怪三档 + 黑荆棘三档成型'},
      {lv:7, units:['雷克塞','暗影狼','远古石甲虫','绯红印记树怪','沃里克','阿兹尔','墨菲特'], note:'四费墨菲特二星是重点，血量好才搜'},
      {lv:8, units:['雷克塞','暗影狼','远古石甲虫','绯红印记树怪','墨菲特','黛安娜','沃里克','阿兹尔'], note:'满编二星，狂战士四档拉满'}
    ],
    carousel:'大剑 > 腰带 > 反曲弓（沃里克：饮血 / 斯特拉克 / 夜之锋刃）',
    levelUp:'2-1 上4 · 3-2 上6 · 4-1 上7 · 四阶段拉 8'
  },

  /* ---------- S 莫甘娜 & 蓝BUFF · 八人口运营 ---------- */
  spellweaver_morgana: {
    final: [['莉莉娅',0,1],['洛',0,2],['苍蓝雕纹魔像',0,3],['塔里克',0,4],['费德提克',0,5],
            ['黛安娜',1,2],['莫甘娜',1,4],['拉露恩',1,6]],
    early: [['洛',0,3],['费德提克',0,4],['提莫',1,2],['卡尔玛',1,4]],
    byLevel: [
      {lv:4, units:['洛','费德提克','提莫','卡尔玛'], note:'神谕 + 法系过渡，莫甘娜的散件先给卡尔玛打工'},
      {lv:5, units:['洛','慎','费德提克','提莫','卡尔玛'], note:'护卫档往上凑，眼泪优先合蓝霸符'},
      {lv:6, units:['洛','费德提克','苍蓝雕纹魔像','莫甘娜','提莫','卡尔玛'], note:'魔像誓约骨架进场，莫甘娜一星即稳血'},
      {lv:7, units:['洛','费德提克','苍蓝雕纹魔像','莉莉娅','莫甘娜','黛安娜','卡尔玛'], note:'七级补质量，蓝霸符必须给莫甘娜'},
      {lv:8, units:['洛','费德提克','苍蓝雕纹魔像','莉莉娅','塔里克','莫甘娜','拉露恩','黛安娜'], note:'满编开搜二星莫甘娜，五费随缘'}
    ],
    carousel:'眼泪 > 大棒 > 腰带（莫甘娜：蓝霸符 / 珠光 / 帽子）',
    levelUp:'2-1 上4 · 3-2 上6 · 4-1 上7 · 四阶段拉 8'
  },

  /* ---------- S 伊泽瑞尔 & 德莱文 · 九人口五费 ---------- */
  brawler_ezreal: {
    final: [['阿利斯塔',0,1],['阿木木',0,2],['茂凯',0,3],['塔里克',0,4],['凯南',0,5],
            ['伊泽瑞尔',1,2],['德莱文',1,4],['艾翁',1,5]],
    early: [['阿利斯塔',0,2],['洛',0,4],['韦鲁斯',1,2],['凯尔',1,4]],
    byLevel: [
      {lv:4, units:['阿利斯塔','洛','韦鲁斯','凯尔'], note:'永恒之森 + 物理打工，大剑弓全攒着'},
      {lv:5, units:['阿利斯塔','洛','约里克','韦鲁斯','凯尔'], note:'主宰档往上凑，连败保经济'},
      {lv:6, units:['阿利斯塔','阿木木','洛','约里克','韦鲁斯','克格莫'], note:'过渡质量随缘，钱留给八级和九级'},
      {lv:7, units:['阿利斯塔','阿木木','洛','约里克','蔚','克格莫','卡尔玛'], note:'死保 50 利息，这个等级没有你要的牌'},
      {lv:8, units:['阿利斯塔','阿木木','茂凯','凯南','伊泽瑞尔','塔里克','婕拉','德莱文'], note:'四阶段拉 8：伊泽瑞尔二星接管，德莱文来了交棒'},
      {lv:9, units:['阿木木','茂凯','塔里克','凯南','伊泽瑞尔','德莱文','艾翁','阿利斯塔','婕拉'], note:'5-1 上 9 满编五费，吃鸡率 20%+ 的本体'}
    ],
    carousel:'大剑 > 反曲弓 > 拳套（伊泽瑞尔：饮血 / 鬼索 / 海妖）',
    levelUp:'2-1 上4 · 3-2 上6 · 4 阶段保利息 · 4-5 上8 · 5-1 上9'
  },

  /* ---------- S 锋喙鸟 & 赫卡里姆 · 八人口运营 ---------- */
  brawler_crimsonraptor: {
    final: [['远古石甲虫',0,1],['阿利斯塔',0,2],['赫卡里姆',0,3],['苍蓝雕纹魔像',0,4],['阿兹尔',0,5],
            ['霞',1,1],['深红锋喙鸟',1,3],['婕拉',1,5]],
    early: [['远古石甲虫',0,2],['霞',0,3],['深红锋喙鸟',1,2],['婕拉',1,4]],
    byLevel: [
      {lv:4, units:['远古石甲虫','霞','深红锋喙鸟','婕拉'], note:'锋喙鸟见就拿——他是这套唯一主 C'},
      {lv:5, units:['远古石甲虫','阿利斯塔','霞','深红锋喙鸟','婕拉'], note:'永恒之森档往上凑'},
      {lv:6, units:['远古石甲虫','阿利斯塔','赫卡里姆','霞','深红锋喙鸟','婕拉'], note:'六级开始慢 D 锋喙鸟三星'},
      {lv:7, units:['远古石甲虫','阿利斯塔','赫卡里姆','苍蓝雕纹魔像','阿兹尔','深红锋喙鸟','婕拉'], note:'野怪三档 + 召唤师三档，锋喙鸟追三不停手'},
      {lv:8, units:['远古石甲虫','阿利斯塔','赫卡里姆','苍蓝雕纹魔像','阿兹尔','霞','深红锋喙鸟','婕拉'], note:'满编二星，鬼索叠起来收比赛'}
    ],
    carousel:'反曲弓 > 大剑 > 腰带（锋喙鸟：鬼索 / 海妖 / 红霸符）',
    levelUp:'2-1 上4 · 3-2 上6 · 六级慢 D 三星 · 七级补质量 · 四阶段拉 8'
  },

  /* ---------- S 易 & 蔚 · 七级慢 D ---------- */
  juggernaut_masteryi_ad: {
    final: [['约里克',0,1],['远古石甲虫',0,2],['蔚',0,3],['瑟提',0,4],['雷恩加尔',0,5],
            ['克格莫',1,1],['易',1,3],['奈德丽',1,5]],
    early: [['约里克',0,2],['蔚',0,3],['易',1,2],['克格莫',1,4]],
    byLevel: [
      {lv:4, units:['约里克','蔚','易','克格莫'], note:'灵魂莲华 + 主宰开摆，易见就拿，攻速装先合'},
      {lv:5, units:['约里克','远古石甲虫','蔚','易','克格莫'], note:'斗士档往上凑'},
      {lv:6, units:['约里克','远古石甲虫','蔚','雷恩加尔','易','克格莫'], note:'六级开搜慢 D 三星易'},
      {lv:7, units:['约里克','远古石甲虫','蔚','瑟提','雷恩加尔','易','克格莫'], note:'三星到手再上 7，奈德丽补野兽之灵档'},
      {lv:8, units:['约里克','远古石甲虫','蔚','瑟提','雷恩加尔','克格莫','易','奈德丽'], note:'满编二星，魔战士三档拉满'}
    ],
    carousel:'反曲弓 > 大剑 > 拳套（易：鬼索 / 海妖 / 死亡之刃）',
    levelUp:'2-1 上4 · 2-5 上5 · 3-1 上6 慢D · 三星后上 7 · 血量好拉 8'
  },

  /* ---------- S 阿兹尔 & 拉莫斯 · 约德尔护卫 ---------- */
  defender_azir: {
    final: [['提莫',0,1],['费德提克',0,2],['拉莫斯',0,3],['婕拉',0,4],['莉莉娅',0,5],
            ['维迦',1,1],['阿兹尔',1,3],['索拉卡',1,4],['凯南',1,5]],
    early: [['拉莫斯',0,2],['提莫',0,4],['维迦',1,2],['阿兹尔',1,4]],
    byLevel: [
      {lv:4, units:['拉莫斯','提莫','维迦','阿兹尔'], note:'约德尔三件套开局白嫖，阿兹尔见就拿'},
      {lv:5, units:['拉莫斯','提莫','维迦','费德提克','阿兹尔'], note:'护卫 / 法师档往上凑'},
      {lv:6, units:['拉莫斯','提莫','维迦','费德提克','阿兹尔','索拉卡'], note:'六级稳血，约德尔三档减费白嫖经济'},
      {lv:7, units:['拉莫斯','费德提克','婕拉','提莫','维迦','阿兹尔','索拉卡'], note:'七级补二星质量，不急拉 8'},
      {lv:8, units:['拉莫斯','费德提克','婕拉','提莫','维迦','阿兹尔','索拉卡','凯南'], note:'四阶段拉 8 搜二星阿兹尔和拉莫斯'},
      {lv:9, units:['拉莫斯','费德提克','婕拉','阿兹尔','索拉卡','凯南','维迦','提莫','拉露恩'], note:'九人口补裁决三档收尾'}
    ],
    carousel:'眼泪 > 大棒 > 腰带（阿兹尔：青龙刀 / 帽子 / 珠光）',
    levelUp:'2-1 上4 · 3-2 上6 · 4-1 上7 · 四阶段拉 8 · 5-1 上9'
  },

  /* ---------- A 凯特琳 & 希维尔 · 主宰六档 ---------- */
  primal_caitlyn: {
    final: [['峡谷迅捷蟹',0,0],['洛',0,1],['约里克',0,2],['瑟庄妮',0,3],['蔚',0,4],['阿木木',0,5],
            ['凯特琳',1,2],['希维尔',1,4]],
    early: [['洛',0,2],['峡谷迅捷蟹',0,3],['凯特琳',1,2],['蔚',1,4]],
    byLevel: [
      {lv:4, units:['洛','峡谷迅捷蟹','凯特琳','蔚'], note:'主宰 + 猎人开摆，凯特琳见就拿直接追三'},
      {lv:5, units:['洛','约里克','峡谷迅捷蟹','凯特琳','蔚'], note:'主宰档往上叠，连败连胜都行'},
      {lv:6, units:['洛','约里克','峡谷迅捷蟹','瑟庄妮','凯特琳','蔚'], note:'六级慢 D 凯特琳三星，二星就能稳血'},
      {lv:7, units:['洛','约里克','峡谷迅捷蟹','瑟庄妮','蔚','阿木木','凯特琳'], note:'三星后补四费主宰阿木木'},
      {lv:8, units:['洛','约里克','峡谷迅捷蟹','瑟庄妮','蔚','阿木木','凯特琳','希维尔'], note:'满编二星，主宰六档减伤拉满'}
    ],
    carousel:'大剑 > 反曲弓 > 拳套（凯特琳：鬼索 / 海妖 / 轻语）',
    levelUp:'2-1 上4 · 2-5 上5 · 3-1 上6 慢D · 三星后上 7 · 四阶段拉 8'
  },

  /* ---------- A 裁决芸阿娜 · 黑荆棘五档（样本偏少） ---------- */
  slayer_yunara: {
    final: [['雷克塞',0,1],['暗影狼',0,2],['墨菲特',0,3],['阿利斯塔',0,4],['绯红印记树怪',0,5],
            ['维迦',1,1],['芸阿娜',1,3],['沃里克',1,4],['阿兹尔',1,5]],
    early: [['雷克塞',0,2],['沃里克',0,3],['维迦',1,2],['芸阿娜',1,4]],
    byLevel: [
      {lv:4, units:['雷克塞','沃里克','维迦','芸阿娜'], note:'黑荆棘骨架开局，芸阿娜见就拿直接追三'},
      {lv:5, units:['雷克塞','暗影狼','沃里克','维迦','芸阿娜'], note:'狂战士档往上凑'},
      {lv:6, units:['雷克塞','暗影狼','阿利斯塔','沃里克','维迦','芸阿娜'], note:'六级开搜，芸阿娜和沃里克双追三'},
      {lv:7, units:['雷克塞','暗影狼','阿利斯塔','墨菲特','维迦','芸阿娜','沃里克'], note:'四费墨菲特前排二星是重点'},
      {lv:8, units:['雷克塞','暗影狼','阿利斯塔','墨菲特','绯红印记树怪','芸阿娜','沃里克','阿兹尔'], note:'满编二星，黑荆棘五档拉满'}
    ],
    carousel:'反曲弓 > 大剑 > 拳套（芸阿娜：鬼索 / 海妖 / 死亡之刃）',
    levelUp:'2-1 上4 · 2-5 上5 · 3-1 上6 慢D · 三星后上 7 · 四阶段拉 8'
  },

  /* ---------- A 维迦 & 奥恩 · 法师四档 ---------- */
  defender_veigar: {
    final: [['奥恩',0,2],['雷克塞',0,3],['阿利斯塔',0,4],['费德提克',0,5],
            ['维迦',1,2],['乐芙兰',1,3],['卡西奥佩娅',1,4],['索拉卡',1,5]],
    early: [['奥恩',0,2],['阿利斯塔',0,3],['维迦',1,2],['乐芙兰',1,4]],
    byLevel: [
      {lv:4, units:['奥恩','阿利斯塔','维迦','乐芙兰'], note:'永恒之森 + 法师开摆，维迦见就拿直接追三'},
      {lv:5, units:['奥恩','雷克塞','阿利斯塔','维迦','乐芙兰'], note:'永恒之森档往上叠'},
      {lv:6, units:['奥恩','雷克塞','阿利斯塔','费德提克','维迦','乐芙兰'], note:'法师二档成型，六级稳血慢 D 维迦三星'},
      {lv:7, units:['奥恩','雷克塞','阿利斯塔','费德提克','维迦','乐芙兰','卡西奥佩娅'], note:'蛇女进场法师三档，眼泪全给维迦'},
      {lv:8, units:['奥恩','雷克塞','阿利斯塔','费德提克','维迦','乐芙兰','卡西奥佩娅','索拉卡'], note:'满编二星，法师四档拉满'}
    ],
    carousel:'眼泪 > 大棒 > 腰带（维迦：蓝霸符 / 珠光 / 帽子）',
    levelUp:'2-1 上4 · 2-5 上5 · 3-1 上6 慢D · 三星后上 7 · 四阶段拉 8'
  },

  /* ---------- A 瑟提 & 伊泽瑞尔 · 灵魂莲华斗士 ---------- */
  brawler_sett: {
    final: [['奥恩',0,1],['阿利斯塔',0,2],['瑟提',0,3],['费德提克',0,4],
            ['芸阿娜',1,1],['阿狸',1,2],['伊泽瑞尔',1,4],['索拉卡',1,5]],
    early: [['奥恩',0,2],['阿利斯塔',0,3],['芸阿娜',1,2],['卡尔玛',1,4]],
    byLevel: [
      {lv:4, units:['奥恩','阿利斯塔','芸阿娜','卡尔玛'], note:'灵魂莲华 + 永恒之森开摆，瑟提见就拿'},
      {lv:5, units:['奥恩','阿利斯塔','蔚','芸阿娜','卡尔玛'], note:'斗士档往上凑'},
      {lv:6, units:['奥恩','阿利斯塔','蔚','费德提克','芸阿娜','卡尔玛'], note:'六级稳血，灵魂莲华档往上叠'},
      {lv:7, units:['奥恩','阿利斯塔','瑟提','费德提克','芸阿娜','阿狸','卡尔玛'], note:'瑟提二星接管前排，饮血先合'},
      {lv:8, units:['奥恩','阿利斯塔','瑟提','费德提克','芸阿娜','阿狸','伊泽瑞尔','索拉卡'], note:'四阶段拉 8 搜二星瑟提和伊泽瑞尔'}
    ],
    carousel:'大剑 > 腰带 > 反曲弓（瑟提：饮血 / 斯特拉克 / 狂徒）',
    levelUp:'2-1 上4 · 3-2 上6 · 4-1 上7 · 四阶段拉 8'
  },

  /* ---------- A 提莫 & 阿利斯塔 · 约德尔神谕 ---------- */
  brawler_teemo: {
    final: [['可酷伯',0,1],['阿利斯塔',0,2],['赫卡里姆',0,3],['苍蓝雕纹魔像',0,4],
            ['维迦',1,1],['乐芙兰',1,2],['提莫',1,3],['莫甘娜',1,5]],
    early: [['可酷伯',0,2],['阿利斯塔',0,3],['提莫',1,2],['维迦',1,4]],
    byLevel: [
      {lv:4, units:['可酷伯','阿利斯塔','提莫','维迦'], note:'约德尔全家桶开局白嫖，提莫见就拿直接追三'},
      {lv:5, units:['可酷伯','阿利斯塔','赫卡里姆','提莫','维迦'], note:'斗士 / 重装档往上凑'},
      {lv:6, units:['可酷伯','阿利斯塔','赫卡里姆','提莫','维迦','乐芙兰'], note:'约德尔三档减费 + 法师二档，六级稳血慢 D 提莫三星'},
      {lv:7, units:['可酷伯','阿利斯塔','赫卡里姆','苍蓝雕纹魔像','提莫','维迦','莫甘娜'], note:'魔像誓约进场，莫甘娜重伤补位'},
      {lv:8, units:['可酷伯','阿利斯塔','赫卡里姆','苍蓝雕纹魔像','维迦','乐芙兰','提莫','莫甘娜'], note:'满编二星，神谕三档回蓝拉满'}
    ],
    carousel:'眼泪 > 大棒 > 腰带（提莫：蓝霸符 / 珠光 / 帽子）',
    levelUp:'2-1 上4 · 2-5 上5 · 3-1 上6 慢D · 三星后上 7 · 四阶段拉 8'
  },

  /* ---------- S 级：卡尔玛 & 瑟庄妮 · 八人口追三 ---------- */
  juggernaut_karma: {
    final: [['蕾欧娜',0,1],['瑟庄妮',0,2],['约里克',0,3],['凯尔',0,4],
            ['卡尔玛',1,0],['乐芙兰',1,2],['芸阿娜',1,4],['阿兹尔',1,6]],
    early: [['卡尔玛',1,0],['约里克',0,2],['蕾欧娜',0,3],['芸阿娜',1,4]],
    byLevel: [
      {lv:4, units:['卡尔玛','约里克','蕾欧娜','芸阿娜'], note:'灵魂莲华开局，卡尔玛见就拿，装备先存'},
      {lv:5, units:['卡尔玛','约里克','蕾欧娜','芸阿娜','乐芙兰'], note:'法师二档，卡尔玛一星开始打工输出'},
      {lv:6, units:['卡尔玛','约里克','蕾欧娜','凯尔','芸阿娜','乐芙兰'], note:'日蚀二档上线，六级稳血慢 D'},
      {lv:7, units:['卡尔玛','约里克','蕾欧娜','凯尔','瑟庄妮','芸阿娜','乐芙兰'], note:'七级主搜：卡尔玛 / 芸阿娜 / 约里克往三星推'},
      {lv:8, units:['卡尔玛','约里克','蕾欧娜','凯尔','瑟庄妮','芸阿娜','乐芙兰','阿兹尔'], note:'三星到手拉八，阿兹尔补裁决 + 召唤师'}
    ],
    carousel:'眼泪 > 大棒 > 大剑（卡尔玛：蓝霸符 / 珠光 / 帽子）',
    levelUp:'2-1 上4 · 3-2 上6 · 4-1 上7 慢D 追三 · 三星后拉 8'
  },

  /* ---------- A 级：希维尔 & 莉莉娅 · 八人口运营 ---------- */
  primal_sivir: {
    final: [['阿木木',0,1],['茂凯',0,2],['洛',0,3],['慎',0,4],['莉莉娅',1,2],
            ['蔚',1,4],['希维尔',1,0],['崔丝塔娜',1,5]],
    early: [['洛',0,2],['慎',0,3],['崔丝塔娜',1,2],['蔚',0,4]],
    byLevel: [
      {lv:4, units:['洛','慎','蔚','崔丝塔娜'], note:'主宰 / 护卫杂牌过渡，物理散件先给小炮打工'},
      {lv:5, units:['洛','慎','蔚','崔丝塔娜','希维尔'], note:'四费希维尔来一张就上场，开始攒钱'},
      {lv:6, units:['洛','慎','蔚','莉莉娅','希维尔','崔丝塔娜'], note:'护卫二档 + 野兽二档，稳血上七'},
      {lv:7, units:['洛','慎','蔚','阿木木','莉莉娅','希维尔','崔丝塔娜'], note:'4-1 上七开搜，希维尔往二星推'},
      {lv:8, units:['阿木木','茂凯','洛','慎','蔚','莉莉娅','希维尔','崔丝塔娜'], note:'满编：主宰四档 + 护卫二档，希维尔二星成型'}
    ],
    carousel:'大剑 > 反曲弓 > 腰带（希维尔：轻语 / 红霸符 / 死亡之刃）',
    levelUp:'2-1 上4 · 3-2 上6 · 4-1 / 4-2 上8 开搜'
  }
};

/* ---------- 名字 → 头像 / 费用（board 的 TFT_ICON 与 ALL18 子集） ---------- */
const POS_ICON = {"峡谷迅捷蟹":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_scuttlecrab/tft18_scuttlecrab_square.png","阿木木":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_amumu/tft18_amumu_square.png","茂凯":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_maokai/tft18_maokai_square.png","塔里克":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_taric/tft18_taric_square.png","苍蓝雕纹魔像":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_sentinel/tft18_sentinel_square.png","德莱文":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_draven/tft18_draven_square.png","凯南":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_kennen/tft18_kennen_square.png","艾翁":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_ivern/hud/tft18_ivern_square.png","远古巨龙":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_elderdragon/hud/tft18_elderdragon_square.png","深红锋喙鸟":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_raptor/tft18_crimsonraptor_teamplanner_splash.png","韦鲁斯":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_varus/tft18_varus_square.png","凯尔":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_kayle/tft18_kayle_square.png","蕾欧娜":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_leona/tft18_leona_square.png","约里克":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_yorick/tft18_yorick_square.png","瑟庄妮":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_sejuani/tft18_sejuani_square.png","乐芙兰":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_leblanc/tft18_leblanc_square.png","芸阿娜":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_yunara/tft18_yunara_square.png","卡尔玛":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_karma/tft18_karma_square.png","瑟提":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_sett/tft18_sett_square.png","阿狸":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_ahri/tft18_ahri_square.png","提莫":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_teemo/tft18_teemo_square.png","易":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_masteryi/tft18_masteryi_square.png","艾希":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_ashe/tft18_ashe_square.png","卡西奥佩娅":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_cassiopeia/tft18_cassiopeia_square.png","莫甘娜":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_morgana/tft18_morgana_square.png","奥恩":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_ornn/tft18_ornn_square.png","洛":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_rakan/tft18_rakan_square.png","蔚":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_vi/tft18_vi_square.png","婕拉":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_zyra/tft18_zyra_square.png","奈德丽":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_nidalee/tft18_nidalee_square.png","维迦":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_veigar/tft18_veigar_square.png","慎":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_shen/tft18_shen_square.png","莉莉娅":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_lillia/tft18_lillia_square.png","克格莫":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_kogmaw/tft18_kogmaw_square.png","希维尔":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_sivir/tft18_sivir_square.png","暗影狼":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_murkwolf/tft18_murkwolf_square.png","赫卡里姆":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_hecarim/tft18_hecarim_square.png","黛安娜":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_diana/tft18_diana_square.png","绯红印记树怪":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_brambleback/tft18_brambleback_square.png","厄斐琉斯":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_aphelios/tft18_aphelios_square.png","远古石甲虫":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_krug/tft18_krug_square.png","纳尔":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_gnar/tft18_gnar_square.png","绯红树怪":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_cinderling/tft18_cinderling_square.png","苍蓝哨戒":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_sentry/tft18_sentry_square.png","阿卡丽":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_akali/tft18_akali_square.png","拉露恩":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_alune/hud/tft18_alune_square.png","卡蜜尔":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_camille/tft18_camille_square.png","伊莉丝":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_elise/tft18_elise_square.png","阿利斯塔":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_alistar/tft18_alistar_square.png","费德提克":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_fiddlesticks/tft18_fiddlesticks_square.png","拉克丝 (永恒之森)":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_lux/tft18_lux_elderwood_square.png","霞":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_xayah/tft18_xayah_square.png","墨菲特":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_malphite/tft18_malphite_square.png","雷克塞":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_reksai/tft18_reksai_square.png","雷恩加尔":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_rengar/tft18_rengar_square.png","凯特琳":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_caitlyn/tft18_caitlyn_square.png","沃里克":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_warwick/tft18_warwick_square.png","伊泽瑞尔":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_ezreal/tft18_ezreal_square.png","阿兹尔":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_azir/tft18_azir_square.png","卡兹克":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_khazix/tft18_khazix_square.png","拉克丝 (黑荆棘)":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_lux/tft18_lux_blackthorn_square.png","索拉卡":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_soraka/tft18_soraka_square.png","拉莫斯":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_rammus/tft18_rammus_square.png","可酷伯":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_kobuko/tft18_kobuko_square.png","崔丝塔娜":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_tristana/tft18_tristana_square.png","魔沼蛙":"https://raw.communitydragon.org/latest/game/assets/characters/tft18_gromp/tft18_gromp_square.png"};
const POS_COST = {"峡谷迅捷蟹":2,"阿木木":4,"茂凯":5,"塔里克":5,"苍蓝雕纹魔像":4,"德莱文":5,"凯南":5,"艾翁":5,"远古巨龙":5,"深红锋喙鸟":3,"韦鲁斯":1,"凯尔":2,"蕾欧娜":1,"约里克":1,"瑟庄妮":2,"乐芙兰":2,"芸阿娜":2,"卡尔玛":1,"瑟提":4,"阿狸":4,"提莫":2,"易":3,"艾希":5,"卡西奥佩娅":3,"莫甘娜":4,"奥恩":1,"洛":1,"蔚":3,"婕拉":4,"奈德丽":4,"维迦":1,"慎":2,"莉莉娅":4,"克格莫":3,"希维尔":4,"暗影狼":2,"赫卡里姆":3,"黛安娜":3,"绯红印记树怪":4,"厄斐琉斯":4,"远古石甲虫":3,"纳尔":5,"绯红树怪":1,"苍蓝哨戒":1,"阿卡丽":1,"拉露恩":5,"卡蜜尔":1,"伊莉丝":2,"阿利斯塔":2,"费德提克":3,"拉克丝 (永恒之森)":5,"霞":1,"墨菲特":4,"雷克塞":1,"沃里克":2,"伊泽瑞尔":4,"阿兹尔":3,"卡兹克":3,"拉克丝 (黑荆棘)":5,"索拉卡":4,"拉莫斯":3,"可酷伯":1,"崔丝塔娜":3,"魔沼蛙":2,"雷恩加尔":3,"凯特琳":2};
const POS_ITEM = {"石像鬼石板甲":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_gargoylestoneplate.png","狂徒铠甲":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_warmogsarmor.png","振奋盔甲":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_spiritvisagerr.png","窃贼手套":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_thiefsgloves.png","无尽之刃":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_infinityedge.png","最后的轻语":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_lastwhisper.png","强袭者的链枷":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_powergauntlet.png","鬼索的狂暴之刃":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_guinsoosrageblade.png","海妖之怒":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_krakenslayer.png","死亡之刃":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_deathblade.png","蓝霸符":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_bluebuff.png","珠光护手":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_jeweledgauntlet.png","大天使之杖":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_archangelsstaff.png","圣盾使的誓约":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_frozenheart.png","神谕纹章":"https://raw.communitydragon.org/latest/game/assets/maps/particles/tft/item_icons/traits/spatula/set18/tft18_emblem_invoker.png","莫雷洛秘典":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_morellonomicon.png","灭世者的死亡之帽":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_rabadonsdeathcap.png","虚空之杖":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_voidstaff.png","海克斯科技枪刃":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_hextechgunblade.png","适应性头盔":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_adaptivehelm.png","饮血剑":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_bloodthirster.png","夜之锋刃":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_guardianangel.png","斯特拉克的挑战护手":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_steraksgage.png","红霸符":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_rapidfirecannon.png","荆棘之甲":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_bramblevest.png","龙爪":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_dragonsclaw.png","青龙刀":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_spearofshojin.png","正义之手":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_unstableconcoction.png","狂战士纹章":"https://raw.communitydragon.org/latest/game/assets/maps/particles/tft/item_icons/traits/spatula/set17/tft17_emblem_marauder.png","冕卫":"https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_crownguard.png","迅捷射手纹章":"https://raw.communitydragon.org/latest/game/assets/maps/particles/tft/item_icons/traits/spatula/set14/tft14_emblem_rapidfire.png"};

/* ---------- 站位图：标准棋盘 4 排 × 7 列 · 六边形格 ---------- */
const T = k => (window.tftT ? window.tftT(k) : k);

const HEX_COLS = 7, HEX_ROWS = 4;   // 云顶棋盘我方标准尺寸：4 排 7 列

function hexCellHTML(name, dim, items){
  if (!name) return '<span class="hxc hxe"><span class="hxc-in"></span></span>';
  const cost = POS_COST[name] || 1;
  const img = POS_ICON[name];
  const body = img
    ? `<img src="${img}" alt="${name}" loading="lazy" onerror="this.style.display='none'">`
    : `<b>${String(name).slice(0, 1)}</b>`;
  /* 借鉴 tactics.tools：成型图上把推荐装备直接叠在棋子底部 */
  const its = (items || []).map(n => {
    const u = POS_ITEM[n];
    return u ? `<span class="hxit" title="${n}"><img src="${u}" alt="${n}" loading="lazy" onerror="this.parentNode.style.display='none'"></span>` : '';
  }).join('');
  return `<span class="hxcell"><span class="hxc c${cost}${dim ? ' dim' : ''}" title="${name}"><span class="hxc-in">${body}<i>${name}</i></span></span>${its ? `<span class="hxits">${its}</span>` : ''}</span>`;
}

/* arr: [名, row, col]；row 0 = 前排（贴对手那排），row 1 = 后排
   backRow 决定后排落在第几排：前期贴前（1 排），成型沉底（3 排） */
function hexBoardHTML(arr, dimNames, backRow, comp){
  dimNames = dimNames || new Set();
  if (backRow === undefined || backRow === null) backRow = 3;
  const grid = Array.from({ length: HEX_ROWS }, () => new Array(HEX_COLS).fill(null));

  arr.forEach(([n, r, c]) => {
    const row = r === 0 ? 0 : backRow;
    let col = Math.max(0, Math.min(HEX_COLS - 1, c | 0));
    if (grid[row][col]) {                       // 同格撞了往两边挪
      for (let d = 1; d < HEX_COLS; d++) {
        if (col - d >= 0 && !grid[row][col - d]) { col -= d; break; }
        if (col + d < HEX_COLS && !grid[row][col + d]) { col += d; break; }
      }
    }
    grid[row][col] = { n, dim: dimNames.has(n) };
  });

  /* 装备：从 comp.units 里找每个棋子的推荐装（board 用 it:[{n}]，manual 用 items:[名]） */
  const itemMap = {};
  (comp && comp.units ? comp.units : []).forEach(u => {
    const its = u.it ? u.it.map(x => x.n) : (u.items || []);
    if (its.length) itemMap[u.n] = its.slice(0, 3);
  });

  let out = '';
  for (let r = 0; r < HEX_ROWS; r++) {
    if (r === 2) out += '<div class="hexsep" title="分隔线：上两排=前排贴对手 · 下两排=你的后排"></div>';
    const rowHasItems = grid[r].some(cell => cell && itemMap[cell.n]);
    const cells = grid[r].map(cell => hexCellHTML(cell ? cell.n : null, cell && cell.dim, cell && itemMap[cell.n])).join('');
    out += `<div class="hxr${r % 2 ? ' odd' : ''}${r === 2 ? ' mid' : ''}${rowHasItems ? ' hasitems' : ''}">${cells}</div>`;
  }
  return `<div class="hexmini">${out}</div>`;
}

/* ---------- 完整面板（board / manual 共用） ---------- */
function posPanelHTML(pos, comp){
  const inFinal = new Set((comp && comp.units ? comp.units : []).map(u => u.n));
  const dim = new Set(pos.final.filter(x => !inFinal.has(x[0])).map(x => x[0]));
  const lvRow = b => {
    const avs = b.units.map(n => {
      const img = POS_ICON[n], cost = POS_COST[n];
      const body = img ? `<img src="${img}" alt="${n}" loading="lazy" onerror="this.style.display='none'">` : `<b>${n[0]}</b>`;
      return `<span class="hxu c${cost || 1}" title="${n}">${body}<i>${n}</i></span>`;
    }).join('');
    return `<div class="plv-row">
      <span class="plv-lv">${b.lv}</span>
      <span class="plv-units">${avs}</span>
      <span class="plv-note">${b.note}</span>
    </div>`;
  };
  const blv = (pos.byLevel || []).slice().sort((a, b) => a.lv - b.lv).map(lvRow).join('');
  return `<div class="pospanel">
    <div class="posfigs">
      <div class="posfig"><div class="posfig-t">${T('pos_early')}</div>${hexBoardHTML(pos.early, null, 1)}</div>
      <div class="posfig"><div class="posfig-t">${T('pos_final')}${dim.size ? `<span class="posfig-dim">${T('pos_dim')}</span>` : ''}</div>${hexBoardHTML(pos.final, dim, 3, comp)}</div>
    </div>
    <div class="poslv">
      <div class="poslv-t">${T('pos_bylevel')}</div>
      ${blv}
    </div>
    <div class="posmeta">
      <div>🎯 <b>${T('pos_carousel')}</b>${pos.carousel || '—'}</div>
      <div>⬆ <b>${T('pos_levelup')}</b>${pos.levelUp || '—'}</div>
    </div>
  </div>`;
}

/* ---------- 样式 ---------- */
const css = `
.pospanel{margin-top:4px}
.posfigs{display:flex; gap:16px; flex-wrap:wrap}
.posfig{min-width:0}
.posfig-t{font-size:11.5px; color:#e8b04b; margin-bottom:7px; letter-spacing:.5px}
.posfig-dim{color:#5c6478; margin-left:8px; letter-spacing:0}
.posfig-dim::before{content:'· '}
.hexmini{display:inline-block; padding:9px 11px 11px; border-radius:12px;
  background:radial-gradient(120% 80% at 50% 0%, rgba(90,169,255,.09), transparent 72%), rgba(255,255,255,.018);
  border:1px solid rgba(255,255,255,.07);
  --hw:60px; --hh:69px; --hgap:4px; --hrow:5px; --hmid:10px}
.hxr{display:flex; gap:var(--hgap)}
.hxr + .hxr{margin-top:var(--hrow)}
.hxr.mid{margin-top:var(--hmid)}   /* 前两排贴一块、后两排贴一块，中间隔一条分隔线 */
.hexsep{height:1px; margin:8px 0 12px;
  background:linear-gradient(to right, transparent 4%, rgba(232,176,75,.55) 50%, transparent 96%)}
.hxr.hasitems{margin-bottom:15px}   /* 这排挂了装备小图标，给下一排让位 */
.hxr.odd{padding-left:calc((var(--hw) + var(--hgap)) / 2)}
.hxc{position:relative; flex:0 0 auto; display:block; width:var(--hw); height:var(--hh);
  clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
  background:var(--hx-cost,#2b3548)}
.hxc-in{position:absolute; inset:1.5px; overflow:hidden; display:flex; align-items:center; justify-content:center;
  clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%); background:#0d1422}
.hxc-in img{width:100%; height:100%; object-fit:cover; display:block}
.hxc-in b{font-size:12px; color:#cbd6e6; font-weight:600}
.hxc-in i{position:absolute; left:0; right:0; bottom:0; padding:9px 2px 3px; font-style:normal;
  font-size:9.5px; line-height:1.15; text-align:center; color:#e2e9f5;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  background:linear-gradient(to top, rgba(5,9,16,.95) 58%, rgba(5,9,16,0))}
.hxc.dim{opacity:.4}
.hxc.hxe{background:rgba(255,255,255,.10)}
.hxc.hxe .hxc-in{background:#0a1019}
.hxc.c1{--hx-cost:#8b97ad}.hxc.c2{--hx-cost:#4fbb63}.hxc.c3{--hx-cost:#3f9ce2}.hxc.c4{--hx-cost:#bb72ef}.hxc.c5{--hx-cost:#f0b544}
/* 成型图装备叠加（借鉴 tactics.tools / tft.tools）：小图标横排挂在棋子格下方 */
.hxcell{position:relative; flex:0 0 auto; width:var(--hw); height:var(--hh)}
.hxcell .hxc{position:absolute; inset:0; width:100%; height:100%}
.hxits{position:absolute; left:50%; bottom:-11px; transform:translateX(-50%); display:flex; gap:2px; z-index:3}
.hxit{width:16px; height:16px; border-radius:4px; overflow:hidden; background:#0a0f18;
  border:1px solid rgba(255,255,255,.45); box-shadow:0 1px 3px rgba(0,0,0,.65); display:block}
.hxit img{width:100%; height:100%; object-fit:cover; display:block; pointer-events:none}
.poslv{margin-top:16px}
.poslv-t,.poslv-t{font-size:11.5px; color:#e8b04b; letter-spacing:.5px; margin-bottom:7px}
.plv-row{display:flex; gap:10px; align-items:flex-start; padding:7px 0; border-bottom:1px dashed rgba(255,255,255,.06); flex-wrap:wrap}
.plv-lv{flex:0 0 30px; height:24px; border-radius:7px; background:#1a2233; border:1px solid #3a4460; color:#e8ecf4; font-size:12.5px; font-weight:700; display:flex; align-items:center; justify-content:center}
.plv-units{display:flex; gap:7px; flex-wrap:wrap; flex:0 0 auto; max-width:56%}
.hxu{position:relative; width:34px; height:34px; border-radius:8px; background:#131b2c;
  border:1.5px solid var(--hx-cost,#3a4460); display:flex; align-items:center; justify-content:center; overflow:hidden}
.hxu img{width:31px; height:31px; border-radius:6px; object-fit:cover; display:block}
.hxu b{font-size:12px; color:#cbd6e6}
.hxu.c1{--hx-cost:#8b97ad}.hxu.c2{--hx-cost:#4fbb63}.hxu.c3{--hx-cost:#3f9ce2}.hxu.c4{--hx-cost:#bb72ef}.hxu.c5{--hx-cost:#f0b544}
.plv-units .hxu i{display:none}
.plv-note{flex:1; min-width:180px; font-size:11.5px; color:#9aa6bc; line-height:1.55; padding-top:3px}
.posmeta{margin-top:12px; font-size:12px; color:#c3ccdb; line-height:1.8}
.posmeta b{color:#e8b04b; margin:0 6px 0 2px}
@media (max-width:520px){
  .posfigs{gap:12px}
  /* 一行 7 格必须正好放下：视口 - 页面留白 - 卡片内边距 */
  .hexmini{--hw:min(calc((100vw - 88px) / 7 - 2px), 54px); --hh:calc(var(--hw) * 1.15); --hgap:2.5px; --hrow:3px; padding:7px 9px 9px}
  .hxc-in i{font-size:8.5px; padding-top:7px}
  .hxit{width:14px; height:14px}
  .plv-units{max-width:100%}
  .plv-note{min-width:100%; padding-left:40px}
}`;
if (document.head) {
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);
}

window.TFT_POS = { POS, hexBoardHTML, posPanelHTML, POS_ICON, POS_COST };

})();
