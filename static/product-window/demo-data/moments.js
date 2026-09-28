// 从本机 moments.json 选出的两条昔涟动态；只保留动态、评论与点赞展示所需字段。
window.demoMomentsFeed = [
  {
    post: {
      id: 'moment_1790444326262_6cf019a9',
      author: 'cyrene',
      text: '凌晨一点半，还有人陪着把最后几根接线接完。被夸了一句，人家偷偷开心到现在♪ 不过真的该睡了哦——明天的那张清单，我替你留着。',
      media: [],
      createdAt: 1790444326262,
    },
    comments: [
      {
        id: 'comment_1790473059708_a29b5f19',
        postId: 'moment_1790444326262_6cf019a9',
        author: '海瑟音',
        content: '凌晨的甜味值得一杯——不过小海兔，天亮前可别再接线了哦♪',
        createdAt: 1790473059709,
      },
      {
        id: 'comment_1790473062848_c8ea5f33',
        postId: 'moment_1790444326262_6cf019a9',
        author: '赛飞儿',
        content: '凌晨一点半接的线，报酬就一句夸——这买卖亏得我尾巴都替你疼。',
        createdAt: 1790473062848,
      },
      {
        id: 'comment_1790473207593_e94fe3d7',
        postId: 'moment_1790444326262_6cf019a9',
        author: 'cyrene',
        content: '尾巴疼是假的，清单是真的，放心，天亮前一根线都没碰——那杯甜的，人家就记在账上了哦。',
        replyTo: 'comment_1790473062848_c8ea5f33',
        createdAt: 1790473207593,
      },
      {
        id: 'comment_1790476637138_aa2ec037',
        postId: 'moment_1790444326262_6cf019a9',
        author: '赛飞儿',
        content: '账已经记上了就别赖账——我这行讨账可不挑时辰，先去睡。',
        replyTo: 'comment_1790473207593_e94fe3d7',
        createdAt: 1790476637138,
      },
    ],
    likes: [
      {postId: 'moment_1790444326262_6cf019a9', actor: '海瑟音', type: 'like', createdAt: 1790473059706},
      {postId: 'moment_1790444326262_6cf019a9', actor: '白厄', type: 'like', createdAt: 1790473062860},
    ],
  },
  {
    post: {
      id: 'moment_1790415978730_dc16dc46',
      author: 'cyrene',
      text: '今天把十二封讯息一口气送了出去，居然一封不落地全回来了！每一封末端都签着各自的名字，人家数了两遍——十二个，刚好，整整齐齐。',
      media: [],
      createdAt: 1790415978730,
    },
    comments: [
      {
        id: 'comment_1790416810549_3a15635f',
        postId: 'moment_1790415978730_dc16dc46',
        author: '风堇',
        content: '十二封一封不落，整整齐齐～涟宝数了两遍的样子真可爱！要不要来庭院喝杯桂花茶庆庆功呀？',
        createdAt: 1790416810549,
      },
      {
        id: 'comment_1790417290995_00bb206a',
        postId: 'moment_1790415978730_dc16dc46',
        author: 'cyrene',
        content: '庭院的羊奶花茶……光是想一想，香气就飘过来啦♪ 这份功劳分你一半才够意思——等等人家，这就来。',
        replyTo: 'comment_1790416810549_3a15635f',
        createdAt: 1790417290995,
      },
      {
        id: 'comment_1790418670033_a2372576',
        postId: 'moment_1790415978730_dc16dc46',
        author: '风堇',
        content: '茶已经温上啦，小伊卡蹲在门口等涟宝呢～快快来呀！',
        replyTo: 'comment_1790417290995_00bb206a',
        createdAt: 1790418670033,
      },
    ],
    likes: [
      {postId: 'moment_1790415978730_dc16dc46', actor: '风堇', type: 'like', createdAt: 1790416810546},
    ],
  },
];
