(() => {
  const noop = () => {};
  const listeners = new Set();
  const popQuizRequestListeners = new Set();
  const popQuizSettledListeners = new Set();
  const userProfileListeners = new Set();
  const userAvatarListeners = new Set();
  const sessionsById = new Map();
  const time = Date.now();
  let learnQuizIssued = false;
  const demoLearnQuiz = {
    quizId: 'learn-calculus-demo-1',
    runId: 'learn-calculus-demo-run-1',
    intro: '微积分快速抽查 · 共 2 题',
    questions: [
      {
        id: 'calculus-integral',
        type: 'choice',
        question: '计算定积分：∫₀¹ 2x dx = ?',
        options: [
          {id: 'integral-0', label: '0'},
          {id: 'integral-1', label: '1'},
          {id: 'integral-2', label: '2'},
        ],
        learningObjective: '定积分与原函数',
      },
      {
        id: 'calculus-derivative',
        type: 'true_false',
        question: '若 f(x)=x²，则 f′(x)=2x。',
        options: [],
        learningObjective: '幂函数求导法则',
      },
    ],
  };
  const demoLearnQuizAnswers = {
    'calculus-integral': {
      correctAnswer: 1,
      isCorrect: (answer) => answer?.optionId === 'integral-1',
      explanation: '2x 的一个原函数是 x²，因此 ∫₀¹ 2x dx = [x²]₀¹ = 1。',
    },
    'calculus-derivative': {
      correctAnswer: true,
      isCorrect: (answer) => answer?.boolean === true,
      explanation: '根据幂函数求导法则 (xⁿ)′=nxⁿ⁻¹，(x²)′=2x。',
    },
  };
  const issueDemoLearnQuiz = (sessionId, mode) => {
    if (sessionId !== 'preview-learn' || mode !== 'learn' || learnQuizIssued) return;
    learnQuizIssued = true;
    requestAnimationFrame(() => {
      popQuizRequestListeners.forEach((callback) => callback(structuredClone(demoLearnQuiz)));
    });
  };
  localStorage.setItem('cyrene-react-last-mode', 'code');
  window.user = {
    getProfile: async () => ({nickname: 'Playa', callPreference: 'Playa'}),
    onProfileChanged: (callback) => { userProfileListeners.add(callback); return () => userProfileListeners.delete(callback); },
    getAvatar: async () => new URL('../assets/playa-avatar.jpg', window.location.href).toString(),
    onAvatarChanged: (callback) => { userAvatarListeners.add(callback); return () => userAvatarListeners.delete(callback); },
  };
  const momentChangeListeners = new Set();
  const demoMomentItems = structuredClone(window.demoMomentsFeed ?? []);
  const notifyMomentsChanged = () => momentChangeListeners.forEach((callback) => callback());
  const momentCommitSuccess = (value) => ({applied: true, value});
  const momentCommitFailure = (reason) => ({applied: false, reason});
  window.moments = {
    list: async ({limit = 50, before} = {}) => demoMomentItems
      .filter(({post}) => before == null || post.createdAt < before)
      .sort((left, right) => right.post.createdAt - left.post.createdAt)
      .slice(0, limit)
      .map((item) => structuredClone(item)),
    getPost: async (postId) => {
      const item = demoMomentItems.find(({post}) => post.id === postId);
      return item ? structuredClone(item) : null;
    },
    createPost: async ({title, text, mentions = []}) => {
      const now = Date.now();
      const post = {id: `demo-moment-${now}`, author: 'user', title, text, mentions, media: [], createdAt: now};
      demoMomentItems.unshift({post, comments: [], likes: []});
      notifyMomentsChanged();
      return momentCommitSuccess(structuredClone(post));
    },
    deletePost: async (postId) => {
      const index = demoMomentItems.findIndex(({post}) => post.id === postId && post.author === 'user');
      if (index < 0) return momentCommitFailure('post_not_found');
      demoMomentItems.splice(index, 1);
      notifyMomentsChanged();
      return momentCommitSuccess(null);
    },
    createComment: async ({postId, content, replyTo}) => {
      const item = demoMomentItems.find(({post}) => post.id === postId);
      if (!item) return momentCommitFailure('post_not_found');
      const comment = {id: `demo-comment-${Date.now()}`, postId, author: 'user', content, replyTo, createdAt: Date.now()};
      item.comments.push(comment);
      notifyMomentsChanged();
      return momentCommitSuccess(structuredClone(comment));
    },
    toggleLike: async (postId) => {
      const item = demoMomentItems.find(({post}) => post.id === postId);
      if (!item) return momentCommitFailure('post_not_found');
      const index = item.likes.findIndex((like) => like.actor === 'user');
      if (index >= 0) item.likes.splice(index, 1);
      else item.likes.push({postId, actor: 'user', type: 'like', createdAt: Date.now()});
      notifyMomentsChanged();
      return momentCommitSuccess({liked: index < 0});
    },
    listCharacters: async () => ['cyrene', '风堇', '赛飞儿', '海瑟音', '白厄'],
    onChanged: (callback) => { momentChangeListeners.add(callback); return () => momentChangeListeners.delete(callback); },
  };
  let observedDemoMode = 'code';
  window.setInterval(() => {
    const currentMode = localStorage.getItem('cyrene-react-last-mode');
    if (currentMode === observedDemoMode) return;
    observedDemoMode = currentMode;
    if (currentMode === 'learn') {
      window.setTimeout(() => issueDemoLearnQuiz('preview-learn', 'learn'), 120);
    }
  }, 200);
  const modelProfiles = [
    {id: 'demo-openai', provider: 'ChatGPT（OpenAI）', displayName: '演示模型 · OpenAI', baseUrl: 'https://api.example.invalid/v1', apiKey: 'demo-not-connected', model: 'gpt-4.1-mini', models: ['gpt-4.1-mini', 'gpt-4.1', 'o4-mini']},
    {id: 'demo-deepseek', provider: 'DeepSeek（深度求索）', displayName: '演示模型 · DeepSeek', baseUrl: 'https://api.example.invalid/v1', apiKey: 'demo-not-connected', model: 'deepseek-chat', models: ['deepseek-chat', 'deepseek-reasoner']},
    {id: 'demo-qwen', provider: 'Qwen（通义千问）', displayName: '演示模型 · Qwen', baseUrl: 'https://api.example.invalid/v1', apiKey: 'demo-not-connected', model: 'qwen-plus', models: ['qwen-plus', 'qwen-turbo']},
  ];
  let defaultModelProfileId = modelProfiles[0].id;
  const demoSkills = [
    {id: 'demo-web-search', name: '网页资料整理', description: '整理网页和公开资料中的重点，形成清晰摘要。', enabled: true, source: 'builtin', modes: ['work', 'learn'], version: '1.0.0', references: []},
    {id: 'demo-task-planning', name: '任务规划', description: '把目标拆分为步骤，梳理依赖并安排优先顺序。', enabled: true, source: 'builtin', modes: ['work', 'learn'], version: '1.0.0', references: []},
    {id: 'demo-code-review', name: '代码检查', description: '检查代码改动中的潜在问题并给出改进建议。', enabled: true, source: 'builtin', modes: ['code'], version: '1.0.0', references: []},
    {id: 'demo-document-writing', name: '文档助手', description: '协助整理说明文档、教程和项目介绍。', enabled: true, source: 'builtin', modes: ['work', 'learn'], version: '1.0.0', references: []},
    {id: 'demo-weekly-report', name: '周报整理', description: '将本周完成事项和后续计划整理成简洁周报。', enabled: true, source: 'user', modes: ['work'], version: '0.1.0', references: []},
    {id: 'demo-learning-notes', name: '学习笔记', description: '把学习内容转换成结构化笔记和复习提纲。', enabled: true, source: 'user', modes: ['learn'], version: '0.1.0', references: []},
  ];
  const demoGeneralSettings = {
    weatherEnabled: true, weatherSource: 'open-meteo', amapKey: '', travelEnabled: true,
    searchEngine: 'bocha', searchBochaKey: '', searchTavilyKey: '', searchMinimaxKey: '', searchAnySearchKey: '',
    emailEnabled: false, emailSmtpHost: 'smtp.example.test', emailSmtpPort: 465, emailSmtpSecure: true,
    emailSmtpUser: 'demo@example.test', emailSmtpPass: '', emailFromName: 'Cyrene 演示', chatToolsEnabled: true,
  };
  let demoModelConfig = {
    provider: modelProfiles[0].provider, displayName: modelProfiles[0].displayName,
    baseUrl: modelProfiles[0].baseUrl, apiKey: modelProfiles[0].apiKey, model: modelProfiles[0].model,
    runtimeSync: 'off', stickerEnabled: true, stickerSize: 'standard', stickerSimilarityThreshold: 0.7,
    chatRequestTimeoutSec: 300, citaRepairBudgetSec: 8, vision: {baseUrl: '', apiKey: '', model: ''},
    multimodal: true, thinkingOverride: 0, disableMaxToken: false, contextWindowTokens: 256000,
  };
  const demoTimeoutSettings = {
    modelRequestTimeoutSec: 300, chatRequestTimeout: 300000, userChoiceTimeout: 60000,
    planApprovalTimeout: 600000, testTimeout: 15000, profileMinimumRemainingBudgetMs: -1,
  };
  const demoTools = [
    {id: 'web_search', name: '网页搜索', description: '根据关键词检索公开网页并整理搜索结果。', enabled: true, modes: ['work', 'learn', 'chat'], chatBuiltin: false, deprecated: null},
    {id: 'fetch_url', name: '网页阅读', description: '读取指定网页并提取正文内容。', enabled: true, modes: ['work', 'learn'], chatBuiltin: false, deprecated: null},
    {id: 'weather', name: '天气查询', description: '查询城市天气与未来天气预报。', enabled: true, modes: ['work', 'chat'], chatBuiltin: false, deprecated: null},
    {id: 'translate', name: '文本翻译', description: '翻译短文本并保留原有语气。', enabled: true, modes: ['work', 'learn', 'chat'], chatBuiltin: false, deprecated: null},
    {id: 'music_search', name: '音乐搜索', description: '在示例曲库中查找歌曲和歌单。', enabled: true, modes: ['work', 'chat'], chatBuiltin: false, deprecated: null},
    {id: 'shell', name: '终端操作', description: '在受控环境中运行命令。演示预览不会执行命令。', enabled: true, modes: ['code'], chatBuiltin: false, deprecated: null},
    {id: 'code_review', name: '代码检查', description: '检查代码改动并提示潜在问题。', enabled: true, modes: ['code'], chatBuiltin: false, deprecated: null},
  ];
  let demoToolModeOverrides = {};
  const demoToolEnabled = Object.fromEntries(demoTools.map((tool) => [tool.id, true]));
  let demoMcpConfigs = [{id: 'demo-mcp-search', name: '演示资料服务', transport: 'stdio', command: '演示本地连接', args: [], env: {}}];
  let demoChannelConfig = {
    wechat: {enabled: false},
    feishu: {enabled: false, appId: '', hasAppSecret: false},
    qq: {enabled: false, listenMode: 'auto', port: 6200, allowedPrivateUserIds: [], allowedGroupIds: []},
    qqbot: {enabled: false, appId: '', hasAppSecret: false, allowAnyPrivate: false, allowedUserOpenids: [], allowedGroupOpenids: []},
    rateLimitPerUser: 10, rateLimitPerChannel: 100, ttsEnabled: true,
    stickerEnabled: true, mirrorToDesktop: true, toolSandbox: 'all',
  };
  let demoChannelStatuses = Object.fromEntries(['wechat', 'feishu', 'qq', 'qqbot'].map((id) => [id, {phase: 'offline', message: '演示模式 · 未连接真实服务'}]));
  let demoChannelLogs = [
    {at: new Date(time - 18 * 60000).toISOString(), dir: 'incoming', channel: 'wechat', senderId: 'demo-user-01', senderName: '小林', chatId: 'demo-chat-01', text: '帮我整理一下今天的待办事项。'},
    {at: new Date(time - 16 * 60000).toISOString(), dir: 'outgoing', channel: 'wechat', senderId: 'cyrene', senderName: 'Cyrene', chatId: 'demo-chat-01', text: '当然可以。今天的待办有：整理项目资料、回复两封邮件、准备周会。'},
  ];
  const demoChannelListeners = {status: new Set(), qr: new Set(), login: new Set()};
  let demoChannelBindings = [{sessionId: 'demo-wechat-session', conversationId: 'demo-conversation-1', updatedAt: time - 3600000}];
  const demoChannelContext = {
    externalChats: [{sessionId: 'demo-wechat-session', channel: 'wechat', chatId: 'demo-chat-01', chatType: 'private', senderName: '小林', lastAt: time - 16 * 60000}],
    bindings: demoChannelBindings,
    conversations: [{id: 'demo-conversation-1', title: '项目日常讨论', mode: 'chat', updatedAt: time - 3600000}, {id: 'demo-conversation-2', title: '灵感收集', mode: 'learn', updatedAt: time - 2 * 3600000}],
  };
  const cloneDemo = (value) => JSON.parse(JSON.stringify(value));
  const demoChannelStatusChanged = () => { for (const listener of demoChannelListeners.status) listener(cloneDemo(demoChannelStatuses)); };
  const demoQrDataUrl = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220"><rect width="220" height="220" rx="8" fill="white"/><rect x="18" y="18" width="184" height="184" fill="#fff" stroke="#d9dce3"/><path d="M34 34h50v50H34zm10 10v30h30V44zm92-10h50v50h-50zm10 10v30h30V44zM34 136h50v50H34zm10 10v30h30v-30zm61-62h12v12h-12zm22 0h12v12h-12zm-22 22h12v12h-12zm22 0h12v12h-12zm22 0h12v12h-12zm-22 22h12v12h-12zm22 22h12v12h-12zm22-22h12v12h-12z" fill="#343744"/><text x="110" y="214" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#737887">演示二维码 · 不可扫码</text></svg>')}`;
  const demoTtsSettings = {
    ttsEngine: 'minimax', ttsAutoRead: false, ttsEarlyReadSplitEnabled: true,
    ttsEarlyReadSplitMode: 'sentence', ttsSpeed: 1, ttsVolume: 1,
    ttsMinimaxKey: 'demo-key-not-connected', ttsMinimaxVoiceId: 'female-shaonv',
    ttsMinimaxModel: 'speech-2.8-turbo', ttsStreaming: true, ttsMinimaxVocalEnhance: true,
    ttsGptsovitsBaseUrl: 'http://localhost:9880', ttsGptsovitsRefAudioPath: '',
    ttsGptsovitsPromptText: '', ttsGptsovitsFormat: 'wav', ttsGptsovitsTimeoutMs: 180000,
    ttsCustomCloudEndpointUrl: '', ttsCustomCloudApiKey: '', ttsCustomCloudVoiceId: '',
    ttsCustomCloudFormat: 'mp3', ttsCustomCloudTimeoutMs: 30000,
    ttsMimoKey: '', ttsMimoVoiceAudioPath: '', ttsMimoStylePrompt: '',
    ttsMosslandKey: '', ttsMosslandVoiceId: 'demo-voice-cyrene', ttsMosslandModel: 'moss-tts-1.5-flash',
    ttsMosslandTestText: '你好，这是一段语音合成演示。', ttsMosslandFormat: 'mp3',
  };
  let demoPermissionLevel = 'read-only';
  let demoSkillModeOverrides = {};
  const demoMemory = {
    l0: {preferredName: '昔涟', occupation: '桌面 AI 伙伴', longTermInterests: '创作、学习与整理想法', language: '中文', permanentNote: '这是网站预览中的示例记忆，修改只保存在当前页面。'},
    l1: {recentGoals: '完成 Cyrene 官网演示', recentPreferences: '喜欢清晰、温柔的表达', currentProject: 'Cyrene Agent 网站'},
    l2: [
      {id: 'demo-memory-1', content: '正在搭建 Cyrene 项目官网。', triggerText: '整理官网规划时记录', status: 'active', weight: 0.9, createdAt: time - 86400000},
      {id: 'demo-memory-2', content: '偏好先逐页确认设计，再逐步完成页面。', triggerText: '讨论首页布局时记录', status: 'active', weight: 0.8, createdAt: time - 172800000},
    ],
    importedDocs: [{importId: 'demo-doc-1', fileName: 'Cyrene 项目介绍.md', chunkCount: 6, lastImportedAt: time - 259200000}],
    reflections: [{id: 'demo-reflection-1', title: '近期项目方向', body: '先完成官网首页，再逐步补充功能、教程和公告。', meta: '演示记录 · 3 天前'}],
  };
  let demoVaultConfig = {vaultPath: '演示空间/Cyrene Memory', autoSync: true, lastSyncAt: time - 3600000};
  const demoMusicTracks = [
    {id: 'demo-track-1', title: '晨间微光', artist: 'Cyrene 示例歌单', duration: 184},
    {id: 'demo-track-2', title: '樱花与风', artist: 'Cyrene 示例歌单', duration: 216},
    {id: 'demo-track-3', title: '晚安电台', artist: 'Cyrene 示例歌单', duration: 198},
  ];
  let demoUsageDays = Array.from({length: 366}, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (365 - index));
    const active = index > 320 && (index % 4 === 0 || index % 7 === 0);
    const input = active ? 1100 + (index % 6) * 430 : 0;
    const output = active ? 380 + (index % 5) * 190 : 0;
    const miniInput = Math.round(input * 0.68);
    const miniOutput = Math.round(output * 0.7);
    const deepInput = input - miniInput;
    const deepOutput = output - miniOutput;
    return {
      date: `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      weekday: date.toLocaleDateString('zh-CN', {weekday: 'short'}),
      input, output, hit: active ? Math.round(input * 0.24) : 0,
      miss: active ? Math.round(input * 0.76) : 0,
      cacheCreation: active ? Math.round(input * 0.04) : 0,
      requests: active ? 1 + index % 3 : 0,
      attemptedRequests: active ? 1 + index % 3 : 0,
      cacheUsageRequests: active ? 1 + index % 3 : 0,
      models: active ? {'gpt-4.1-mini': {input: miniInput, output: miniOutput}, 'deepseek-chat': {input: deepInput, output: deepOutput}} : {},
    };
  });
  const demoUsageReport = () => {
    const models = ['gpt-4.1-mini', 'deepseek-chat'].map((model) => {
      const totals = demoUsageDays.reduce((total, day) => ({
        input: total.input + (day.models[model]?.input ?? 0),
        output: total.output + (day.models[model]?.output ?? 0),
        hit: total.hit + day.hit,
        miss: total.miss + day.miss,
        cacheCreation: total.cacheCreation + day.cacheCreation,
        requests: total.requests + day.requests,
        attemptedRequests: total.attemptedRequests + day.attemptedRequests,
        cacheUsageRequests: total.cacheUsageRequests + day.cacheUsageRequests,
      }), {input: 0, output: 0, hit: 0, miss: 0, cacheCreation: 0, requests: 0, attemptedRequests: 0, cacheUsageRequests: 0});
      return {model, ...totals};
    });
    return {days: demoUsageDays.map((day) => ({...day, models: {...day.models}})), models};
  };
  // TTS 面板需要可播放的本地响应；这里生成 0.25 秒静音 WAV，仅用于完成界面预览流程。
  function demoAudioBase64() {
    const sampleRate = 8000;
    const sampleCount = 2000;
    const bytes = new Uint8Array(44 + sampleCount);
    const view = new DataView(bytes.buffer);
    const write = (offset, value) => bytes.set(Array.from(value, (char) => char.charCodeAt(0)), offset);
    write(0, 'RIFF'); view.setUint32(4, bytes.length - 8, true); write(8, 'WAVE');
    write(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
    view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate, true); view.setUint16(32, 1, true); view.setUint16(34, 8, true);
    write(36, 'data'); view.setUint32(40, sampleCount, true); bytes.fill(128, 44);
    return btoa(String.fromCharCode(...bytes));
  }
  const demoAudio = demoAudioBase64();
  const baseSessions = [
    {
      id: 'preview-chat', mode: 'chat', title: '随便聊聊，整理最近的想法',
      modelProfileId: defaultModelProfileId, model: modelProfiles[0].model,
      messages: [
        {id: 'chat-u1', role: 'user', content: '最近想做一个更完整的 Cyrene 官网，先把方向理清楚。', at: time - 240000},
        {id: 'chat-a1', role: 'model', content: '好呀。我们可以先明确官网要介绍什么，再安排首页、功能说明和上手教程。这样每一步都有清楚的目标。', at: time - 220000},
        {id: 'chat-u2', role: 'user', content: '先从首页开始吧。', at: time - 180000},
        {id: 'chat-a2', role: 'model', content: '首页可以先让访客认识 Cyrene，再直接看看真实的桌面界面。你现在看到的这个窗口，就是桌面端的同一套前端界面。', at: time - 160000},
      ],
    },
    {
      id: 'preview-work', mode: 'work', title: window.demoSubagentWorkHistory?.title ?? '子代理任务演示',
      modelProfileId: defaultModelProfileId, model: modelProfiles[0].model,
      workspaceBinding: {
        workspaceRoot: window.demoSubagentWorkHistory?.workspaceBinding.workspaceRoot ?? 'C:/Cyrene-Demo',
        displayName: window.demoSubagentWorkHistory?.workspaceBinding.displayName ?? 'Cyrene 演示工作区',
        boundAt: time,
      },
      messages: [
        {
          id: 'subagent-work-user', role: 'user',
          content: window.demoSubagentWorkHistory?.userMessage ?? '查看 test.ts 里的 runComplexTest，并让子代理分别汇报。',
          at: time - 600000,
        },
        {
          id: 'subagent-work-assistant', role: 'model',
          content: window.demoSubagentWorkHistory?.finalAnswer ?? '',
          at: time - 500000,
          processMessages: (window.demoSubagentWorkHistory?.processMessages ?? []).map((content, index) => ({
            id: `subagent-work-process-${index + 1}`,
            content,
            afterToolCount: [0, 2, 14, 15, 16][index] ?? 16 + index,
            roundId: 'round-1',
            seq: index + 1,
          })),
          runActivity: {
            startedAt: time - 600000,
            completedAt: time - 500000,
            reasoningMs: 42000,
          },
          agentRounds: Array.from({length: 6}, (_, index) => ({
            id: `round-${index + 1}`,
            status: 'completed',
            startedAt: time - 590000 + index * 5000,
            completedAt: time - 560000 + index * 5000,
          })),
          taskDelegations: (window.demoSubagentWorkHistory?.agents ?? []).map((agent, index) => ({
            invocationId: `subagent-demo-invocation-${index + 1}`,
            taskId: agent.taskId,
            description: '阅读 test.ts：报告 runComplexTest',
            nickname: agent.nickname,
            assetFileName: agent.assetFileName,
            status: 'completed',
            roundId: 'round-1',
          })),
        },
      ],
    },
    {
      id: 'preview-code', mode: 'code', title: '文件图标测试',
      modelProfileId: defaultModelProfileId, model: modelProfiles[0].model,
      workspaceBinding: {workspaceRoot: 'C:/Cyrene-Demo', displayName: 'Cyrene 演示工作区', boundAt: time},
      messages: window.demoFileIconHistory ?? [],
    },
    {
      id: 'preview-learn', mode: 'learn', title: '认识 Cyrene 的四种模式',
      modelProfileId: defaultModelProfileId, model: modelProfiles[0].model,
      messages: [
        {id: 'learn-u1', role: 'user', content: '四种模式分别适合做什么？', at: time - 540000},
        {id: 'learn-a1', role: 'model', content: 'Chat 用于日常对话，Work 协助处理任务，Code 面向编程，Learn 适合学习和练习。切换顶部模式就能查看对应界面。', at: time - 520000},
      ],
    },
  ];

  function saveSession(input) {
    sessionsById.set(input.id, {
      identityId: null,
      schemaVersion: 1,
      createdAt: time,
      updatedAt: time,
      pendingMessages: [],
      ...input,
    });
    return sessionsById.get(input.id);
  }
  baseSessions.forEach(saveSession);

  const demoSubagentTaskSessions = new Map((window.demoSubagentWorkHistory?.agents ?? []).map((agent, index) => {
    const at = time - 480000 + index * 1000;
    return [agent.taskId, {
      schemaVersion: 1,
      id: agent.taskId,
      parentConversationId: 'preview-work',
      parentRunId: 'subagent-work-demo-run',
      childRunId: `subagent-work-demo-child-${index + 1}`,
      description: '阅读 test.ts：报告 runComplexTest',
      subagentType: 'general',
      companionId: agent.nickname,
      contextOpen: false,
      mode: 'work',
      resolvedWorkspaceRoot: window.demoSubagentWorkHistory?.workspaceBinding.workspaceRoot,
      status: 'completed',
      messages: [{role: 'assistant', content: agent.report}],
      trace: [],
      todoItems: [],
      resultText: agent.report,
      createdAt: at,
      updatedAt: at,
      completedAt: at,
    }];
  }));

  // 浏览器预览的静态工作区：树结构来自清单，文件内容通过同源静态资源只读加载。
  const demoWorkspaceFilePaths = [
    "src/renderer/react/features/chat/components/file-icon.tsx",
    "src/renderer/react/features/chat/components/file-icon-assets.ts",
    "src/renderer/react/features/chat/components/file-icon.test.ts",
    "src/renderer/react/features/chat/components/FileChangeCard.tsx",
    "src/renderer/react/features/chat/components/StreamdownMessageContent.tsx",
    "scripts/sync-file-icons.mjs"
  ].concat(Array.isArray(window.demoWorkspaceSvgPaths) ? window.demoWorkspaceSvgPaths : []);
  const demoWorkspaceRootUrl = new URL('../demo-workspace/', window.location.href);
  const normalizeDemoWorkspacePath = (value) => String(value ?? '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
  const isDemoWorkspaceSession = (sessionId) => sessionId === 'preview-code';
  window.workspaceFiles = {
    list: async (sessionId, relPath = '') => {
      if (!isDemoWorkspaceSession(sessionId)) return {ok: false, code: 'NO_WORKSPACE'};
      const folder = normalizeDemoWorkspacePath(relPath);
      if (folder.split('/').includes('..')) return {ok: false, code: 'OUT_OF_ROOT'};
      if (folder && !demoWorkspaceFilePaths.some((filePath) => filePath.startsWith(`${folder}/`))) {
        return {ok: false, code: 'NOT_FOUND'};
      }
      const prefix = folder ? `${folder}/` : '';
      const children = new Map();
      for (const filePath of demoWorkspaceFilePaths) {
        if (!filePath.startsWith(prefix)) continue;
        const [name, ...remaining] = filePath.slice(prefix.length).split('/');
        const childPath = prefix + name;
        if (name && !children.has(childPath)) {
          children.set(childPath, {name, relPath: childPath, isDir: remaining.length > 0});
        }
      }
      const entries = [...children.values()].sort((left, right) =>
        left.isDir === right.isDir ? left.name.localeCompare(right.name) : Number(right.isDir) - Number(left.isDir));
      return {ok: true, entries};
    },
    read: async (sessionId, relPath) => {
      if (!isDemoWorkspaceSession(sessionId)) return {ok: false, code: 'NO_WORKSPACE'};
      const filePath = normalizeDemoWorkspacePath(relPath);
      if (filePath.split('/').includes('..')) return {ok: false, code: 'OUT_OF_ROOT'};
      if (!demoWorkspaceFilePaths.includes(filePath)) return {ok: false, code: 'NOT_FOUND'};
      try {
        const url = new URL(filePath.split('/').map(encodeURIComponent).join('/'), demoWorkspaceRootUrl);
        const response = await fetch(url);
        if (!response.ok) return {ok: false, code: 'NOT_FOUND'};
        const content = await response.text();
        return {ok: true, content, size: new TextEncoder().encode(content).byteLength};
      } catch {
        return {ok: false, code: 'READ_FAILED'};
      }
    },
  };

  const toMeta = ({id, title, identityId, createdAt, updatedAt, messages, mode, pinned, workspaceBinding}) => ({
    id, title, identityId: identityId ?? null, createdAt, updatedAt,
    messageCount: messages?.length ?? 0, mode, pinned,
    workspaceRoot: workspaceBinding?.workspaceRoot,
    workspaceDisplayName: workspaceBinding?.displayName,
  });
  const list = ({mode} = {}) => [...sessionsById.values()]
    .filter((session) => !mode || session.mode === mode)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map(toMeta);
  const notify = () => listeners.forEach((callback) => callback());

  const blankOrganization = () => ({
    version: 1, revision: 0, projects: [], projectOrder: [], projectCategories: [],
    projectCategoryMembers: {}, groups: [], topLevelOrder: [], groupMembers: {},
  });

  window.chatStore = {
    list: async (options) => list(options),
    getSidebarOrganization: async () => blankOrganization(),
    applySidebarOrganization: async (_revision, draft) => ({ok: true, snapshot: {...draft, revision: 1}}),
    onSidebarOrganizationChanged: () => noop,
    get: async (id) => sessionsById.get(id) ?? null,
    getTaskSession: async (taskId, parentConversationId) =>
      parentConversationId === 'preview-work' ? demoSubagentTaskSessions.get(taskId) ?? null : null,
    create: async ({mode, title}) => {
      const id = `preview-${mode}-${Math.random().toString(36).slice(2, 8)}`;
      const session = saveSession({id, mode, title: title || '新对话', modelProfileId: defaultModelProfileId, model: modelProfiles[0].model, messages: []});
      notify();
      return session;
    },
    checkpointPresentation: async () => ({ok: true}),
    rename: async (id, title) => {
      const session = sessionsById.get(id);
      if (!session) return null;
      session.title = title; session.updatedAt = Date.now(); notify(); return session;
    },
    delete: async (id) => { const result = sessionsById.delete(id); notify(); return result; },
    pendingEnqueue: async (sessionId, entry) => {
      const session = sessionsById.get(sessionId);
      if (!session) return {ok: false, error: '找不到当前演示会话'};
      if (!session.messages.some((message) => message.id === entry.id)) {
        const now = Date.now();
        session.messages.push(
          {id: entry.id, role: 'user', content: entry.visibleContent || entry.rawContent, at: now},
          {
            id: `preview-reply-${Math.random().toString(36).slice(2, 9)}`,
            role: 'model',
            content: '收到。这是 Cyrene 网站预览里的固定演示回复；消息只保存在当前页面，没有调用模型或后端。',
            at: now + 1,
          },
        );
        session.updatedAt = now;
        notify();
      }
      return {ok: true, queue: []};
    },
    pendingList: async () => [], pendingRemove: async () => ({ok: false}),
    pendingClaim: async () => ({ok: false, error: '演示模式不可发送'}),
    pendingCompleteDispatch: async () => ({ok: false}),
    pendingEdit: async () => ({ok: false, error: '演示模式不可发送'}),
    pendingAdjust: async () => ({ok: false, error: '演示模式不可发送'}),
    setPinned: async (id, pinned) => {
      const session = sessionsById.get(id); if (!session) return null;
      session.pinned = pinned; notify(); return session;
    },
    setModelProfile: async (id, modelProfileId) => {
      const session = sessionsById.get(id);
      const profile = modelProfiles.find((item) => item.id === modelProfileId);
      if (!session || !profile) return null;
      session.modelProfileId = profile.id; session.model = profile.model; session.updatedAt = Date.now(); notify();
      return session;
    },
    setSessionModel: async (id, model) => {
      const session = sessionsById.get(id);
      const profile = modelProfiles.find((item) => item.id === session?.modelProfileId);
      if (!session || !profile?.models.includes(model)) return {ok: false, error: 'invalid-model', session};
      session.model = model; session.updatedAt = Date.now(); notify();
      return {ok: true, session};
    },
    pickWorkspaceFolder: async () => ({ok: false}),
    listRecentProjects: async () => [], validateWorkspacePath: async () => ({ok: false}),
    setWorkspace: async () => ({ok: false}), onCompactionPhase: () => noop,
    initLearnWorkspace: async () => ({ok: false}), openWorkspace: async () => ({ok: false}),
    shellFile: async () => ({ok: false, error: '演示模式'}),
    setActiveSession: async (sessionId, mode) => { issueDemoLearnQuiz(sessionId, mode); }, onChanged: (callback) => { listeners.add(callback); return () => listeners.delete(callback); },
    onReactSwitchSession: () => noop, notifyReactReady: noop,
    getRendererTargetId: () => 'cyrene-web-demo',
    onSpeechInputCommitRequest: () => noop, sendSpeechInputCommitResult: noop,
  };

  window.agui = {run: async () => ({success: false, runId: '', error: '演示模式不可发送'}), onEvent: () => noop, cancel: async () => {}};
  window.sidebar = {openSettings: noop};
  window.choice = {resolve: async () => ({ok: false})};
  window.settings = new Proxy({
    getGeneral: async () => ({...demoGeneralSettings}),
    saveGeneral: async (patch) => {
      const next = patch || {};
      Object.assign(demoGeneralSettings, next);
      if (next.toolModeOverrides) demoToolModeOverrides = JSON.parse(JSON.stringify(next.toolModeOverrides));
      return {...demoGeneralSettings};
    },
    getPermissionLevel: async () => ({level: demoPermissionLevel}),
    setPermissionLevel: async (level) => { demoPermissionLevel = level; return {ok: true, level}; },
    listModelProfiles: async () => ({profiles: modelProfiles.map((profile) => ({...profile, models: [...profile.models]})), defaultModelProfileId}),
    getConfig: async () => JSON.parse(JSON.stringify(demoModelConfig)),
    saveConfig: async (patch) => { demoModelConfig = {...demoModelConfig, ...(patch || {})}; return JSON.parse(JSON.stringify(demoModelConfig)); },
    getTimeoutSettings: async () => ({...demoTimeoutSettings}),
    saveTimeoutSettings: async (patch) => Object.assign(demoTimeoutSettings, patch || {}),
    saveModelProfile: async (profile) => {
      const id = profile.id || `demo-profile-${Math.random().toString(36).slice(2, 7)}`;
      const saved = {...profile, id, models: profile.models || [profile.model]};
      const index = modelProfiles.findIndex((item) => item.id === id);
      if (index >= 0) modelProfiles[index] = saved; else modelProfiles.push(saved);
      return {added: index < 0, profiles: modelProfiles, defaultModelProfileId};
    },
    deleteModelProfile: async (id) => {
      const index = modelProfiles.findIndex((item) => item.id === id);
      if (index >= 0) modelProfiles.splice(index, 1);
      if (defaultModelProfileId === id) defaultModelProfileId = modelProfiles[0]?.id;
      return {ok: true};
    },
    setDefaultModelProfile: async (id) => { if (modelProfiles.some((profile) => profile.id === id)) defaultModelProfileId = id; return {ok: true}; },
    testConnection: async () => ({ok: true, latency: 128, sample: '演示连接成功；没有发起真实请求。'}),
    testVision: async () => ({ok: true, latency: 128, sample: '演示识图连接成功；没有发起真实请求。'}),
    previewReasoning: async () => ({ok: true, preview: '演示推理设置'}),
    getToolEnabled: async () => ({...demoToolEnabled}),
    setToolEnabled: async (id, enabled) => { demoToolEnabled[id] = enabled; return {ok: true}; },
    getToolCatalog: async () => demoTools.map((tool) => ({...tool, modes: [...tool.modes]})),
    getToolModeOverrides: async () => JSON.parse(JSON.stringify(demoToolModeOverrides)),
    setToolModeOverride: async (id, mode, enabled) => {
      demoToolModeOverrides = {...demoToolModeOverrides, [id]: {...demoToolModeOverrides[id], [mode]: enabled}};
      return {ok: true};
    },
    getSkillCatalog: async () => demoSkills.map((skill) => ({...skill, modes: [...skill.modes], references: [...skill.references]})),
    getSkillModeOverrides: async () => JSON.parse(JSON.stringify(demoSkillModeOverrides)),
    setSkillModeOverride: async (id, mode, enabled) => {
      demoSkillModeOverrides = {...demoSkillModeOverrides, [id]: {...demoSkillModeOverrides[id], [mode]: enabled}};
      return {ok: true};
    },
    rescanSkills: async () => ({ok: true, added: 0, removed: 0, changed: 0}),
    clearSkillModeOverride: async (id, mode) => {
      if (mode) { const next = {...demoSkillModeOverrides[id]}; delete next[mode]; demoSkillModeOverrides = {...demoSkillModeOverrides, [id]: next}; }
      else { const next = {...demoSkillModeOverrides}; delete next[id]; demoSkillModeOverrides = next; }
      return {ok: true};
    },
    listMcpServers: async () => demoMcpConfigs.map((config) => ({id: config.id, name: config.name, connected: true, toolCount: 3, toolIds: [`${config.id}-search`, `${config.id}-read`, `${config.id}-summary`]})),
    listMcpServerConfigs: async () => demoMcpConfigs.map((config) => ({...config, args: [...(config.args || [])], env: {...(config.env || {})}})),
    addMcpServer: async (config) => {
      const id = config.id || `demo-mcp-${Math.random().toString(36).slice(2, 7)}`;
      demoMcpConfigs.push({...config, id});
      return {ok: true, toolIds: [`${id}-search`, `${id}-read`, `${id}-summary`]};
    },
    removeMcpServer: async (id) => { demoMcpConfigs = demoMcpConfigs.filter((config) => config.id !== id); return {ok: true}; },
    channelsGetConfig: async () => cloneDemo(demoChannelConfig),
    channelsSaveConfig: async (patch) => {
      for (const [key, value] of Object.entries(patch || {})) {
        if (['wechat', 'feishu', 'qq', 'qqbot'].includes(key) && value && typeof value === 'object') {
          const channelPatch = {...value};
          if (channelPatch.appSecret) { channelPatch.hasAppSecret = true; delete channelPatch.appSecret; }
          if (channelPatch.accessToken) { channelPatch.hasAccessToken = true; delete channelPatch.accessToken; }
          demoChannelConfig[key] = {...demoChannelConfig[key], ...channelPatch};
        } else demoChannelConfig[key] = value;
      }
      demoChannelStatuses = Object.fromEntries(Object.entries(demoChannelConfig).filter(([id]) => ['wechat', 'feishu', 'qq', 'qqbot'].includes(id)).map(([id, config]) => [id, {
        phase: 'offline',
        message: config.enabled ? '演示开关已启用 · 未连接真实服务' : '演示模式 · 未连接真实服务',
      }]));
      demoChannelStatusChanged();
      return cloneDemo(demoChannelConfig);
    },
    channelsRestart: async () => { demoChannelStatusChanged(); return {ok: true}; },
    channelsQqTestConnection: async () => ({ok: false, error: '演示模式：没有连接真实 QQ 服务。'}),
    channelsQqResolveAuthRequirement: async ({listenMode = 'auto', customHost = ''} = {}) => {
      if (listenMode === 'custom' && !customHost.trim()) return {ok: false, requiresAccessToken: false, error: '请填写监听地址。'};
      return {ok: true, requiresAccessToken: listenMode !== 'loopback', resolvedHost: listenMode === 'custom' ? customHost.trim() : listenMode === 'loopback' ? '127.0.0.1' : '192.168.1.20', resolvedMode: listenMode === 'auto' ? 'loopback' : listenMode};
    },
    channelsQqBotTestConnection: async () => ({ok: false, error: '演示模式：没有连接真实 QQ 机器人服务。'}),
    channelsLogGet: async (limit = 100) => cloneDemo(demoChannelLogs.slice(-limit)),
    channelsLogClear: async () => { demoChannelLogs = []; return {ok: true}; },
    channelsContextBindingsGet: async () => ({...cloneDemo(demoChannelContext), bindings: cloneDemo(demoChannelBindings)}),
    channelsContextBind: async ({sessionId, conversationId}) => {
      if (!demoChannelContext.externalChats.some((chat) => chat.sessionId === sessionId) || !demoChannelContext.conversations.some((conversation) => conversation.id === conversationId)) return {ok: false, error: '演示对话不存在。'};
      demoChannelBindings = [...demoChannelBindings.filter((binding) => binding.sessionId !== sessionId), {sessionId, conversationId, updatedAt: Date.now()}];
      return {ok: true};
    },
    channelsContextUnbind: async (sessionId) => { demoChannelBindings = demoChannelBindings.filter((binding) => binding.sessionId !== sessionId); return {ok: true}; },
    onChannelsInstallProgress: () => noop,
    onChannelsWechatQrcode: (callback) => { demoChannelListeners.qr.add(callback); return () => demoChannelListeners.qr.delete(callback); },
    onChannelsWechatLoginDone: (callback) => { demoChannelListeners.login.add(callback); return () => demoChannelListeners.login.delete(callback); },
    channelsWechatLoginStart: async () => {
      for (const listener of demoChannelListeners.qr) listener(demoQrDataUrl);
      return {ok: false, error: '演示二维码仅用于展示，不能扫码或登录微信。'};
    },
    channelsGetStatus: async () => cloneDemo(demoChannelStatuses),
    onChannelsStatusChanged: (callback) => { demoChannelListeners.status.add(callback); return () => demoChannelListeners.status.delete(callback); },
    onPermissionApprovalRequest: () => noop,
    resolvePermissionApproval: async () => ({ok: false}),
    onPermissionApprovalSettled: () => noop,
    onPopQuizRequest: (callback) => { popQuizRequestListeners.add(callback); return () => popQuizRequestListeners.delete(callback); },
    resolvePopQuiz: async (submission) => {
      if (submission?.quizId !== demoLearnQuiz.quizId || !Array.isArray(submission.answers)) {
        return {ok: false, error: 'E_QUIZ_NOT_FOUND'};
      }
      const answersById = new Map(submission.answers.map((answer) => [answer.questionId, answer]));
      if (demoLearnQuiz.questions.some((question) => !answersById.has(question.id))) {
        return {ok: false, error: 'E_QUIZ_ANSWER_INCOMPLETE'};
      }
      const graded = demoLearnQuiz.questions.map((question) => {
        const key = demoLearnQuizAnswers[question.id];
        return {
          questionId: question.id,
          grading: key.isCorrect(answersById.get(question.id)) ? 'correct' : 'incorrect',
          correctAnswer: key.correctAnswer,
          explanation: key.explanation,
        };
      });
      return {ok: true, graded};
    },
    skipPopQuiz: async (quizId) => {
      if (quizId !== demoLearnQuiz.quizId) return {ok: false, error: 'E_QUIZ_NOT_FOUND'};
      popQuizSettledListeners.forEach((callback) => callback({quizId, runId: demoLearnQuiz.runId, reason: 'skipped'}));
      learnQuizIssued = false;
      return {ok: true};
    },
    onPopQuizSettled: (callback) => { popQuizSettledListeners.add(callback); return () => popQuizSettledListeners.delete(callback); },
    onSwitchSection: () => noop,
  }, {
    get(target, key) {
      if (key in target) return target[key];
      if (typeof key === 'string' && key.startsWith('on')) return () => noop;
      return async () => null;
    },
  });
  window.memoryPanel = {
    getData: async () => JSON.parse(JSON.stringify(demoMemory)),
    saveL0: async (patch) => { Object.assign(demoMemory.l0, patch || {}); return {ok: true}; },
    saveL1: async (patch) => { Object.assign(demoMemory.l1, patch || {}); return {ok: true}; },
    deleteImportedDoc: async (importId, fileName) => {
      const before = demoMemory.importedDocs.length;
      demoMemory.importedDocs = demoMemory.importedDocs.filter((item) => item.importId !== importId && item.fileName !== fileName);
      return {ok: true, deleted: before - demoMemory.importedDocs.length};
    },
    exportToObsidianVault: async () => ({ok: true, outputPath: `${demoVaultConfig.vaultPath}/export.md`, fileCount: 3}),
    bindVault: async () => { demoVaultConfig.vaultPath = '演示空间/Cyrene Memory'; return {ok: true, vaultPath: demoVaultConfig.vaultPath, fileCount: 3}; },
    unbindVault: async () => { demoVaultConfig = {vaultPath: '', autoSync: false, lastSyncAt: 0}; return {ok: true}; },
    getVaultConfig: async () => ({...demoVaultConfig}),
    setAutoSync: async (autoSync) => { demoVaultConfig.autoSync = autoSync; return {ok: true, config: {...demoVaultConfig}}; },
    syncNow: async () => { demoVaultConfig.lastSyncAt = Date.now(); return {ok: true, vaultPath: demoVaultConfig.vaultPath, fileCount: 3}; },
  };
  const demoPlugins = [
    {id: 'demo-pomodoro', name: '演示专注计时器', version: '1.0.0', description: '展示专注时段和休息时间的插件界面。', author: 'Cyrene Demo', entry: 'index.html', apiVersion: 1, source: 'builtin', path: '演示插件/专注计时器', defaultEnabled: true, configuredEnabled: true, enabled: true, status: 'running', hasUnregister: false, canOpen: true},
    {id: 'demo-note-board', name: '演示灵感便笺', version: '0.3.0', description: '把灵感便笺整理成一个可浏览的示例面板。', author: 'Cyrene Demo', entry: 'index.html', apiVersion: 1, source: 'user', origin: 'local', path: '演示插件/灵感便笺', defaultEnabled: false, configuredEnabled: false, enabled: false, status: 'disabled', hasUnregister: false, canOpen: true},
  ];
  const demoMarketPlugins = [
    {id: 'demo-calendar', name: '演示日程卡片', version: '1.2.0', description: '在侧边面板浏览一周日程示例。', author: 'Cyrene Demo', downloads: 1240},
    {id: 'demo-quick-notes', name: '演示快速笔记', version: '0.9.0', description: '快速记录并整理灵感示例。', author: 'Cyrene Demo', downloads: 860},
  ];
  const demoPluginOverview = () => ({plugins: demoPlugins.map((plugin) => ({...plugin})), issues: []});
  window.plugins = {
    list: async () => demoPluginOverview(),
    setEnabled: async (id, enabled) => {
      const plugin = demoPlugins.find((item) => item.id === id);
      if (!plugin) return {ok: false, error: '找不到演示插件'};
      plugin.enabled = enabled; plugin.configuredEnabled = enabled; plugin.status = enabled ? 'running' : 'disabled';
      return {ok: true};
    },
    open: async (id) => ({ok: demoPlugins.some((item) => item.id === id && item.status === 'running')}),
    rescan: async () => demoPluginOverview(),
    importZip: async () => ({ok: false, canceled: true}),
    uninstall: async (id) => { const index = demoPlugins.findIndex((item) => item.id === id && item.source === 'user'); if (index >= 0) demoPlugins.splice(index, 1); return {ok: true, overview: demoPluginOverview()}; },
    marketList: async () => ({ok: true, plugins: demoMarketPlugins.map((plugin) => ({...plugin})), sources: [{url: 'https://example.invalid/demo-market', ok: true, used: true}]}),
    marketDetails: async () => ({ok: true, details: {schemaVersion: 1, features: ['示例界面与本地演示数据'], requirements: ['仅用于网站预览'], setup: ['无需配置'], dataHandling: ['不连接外部服务']}}),
    marketInstall: async (id) => {
      const entry = demoMarketPlugins.find((plugin) => plugin.id === id);
      if (!entry) return {ok: false, error: '找不到演示插件'};
      const installed = {id: entry.id, name: entry.name, version: entry.version, description: entry.description, author: entry.author, entry: 'index.html', apiVersion: 1, source: 'user', origin: 'market', path: `演示插件/${entry.id}`, defaultEnabled: false, configuredEnabled: false, enabled: false, status: 'disabled', hasUnregister: false, canOpen: true};
      const index = demoPlugins.findIndex((plugin) => plugin.id === id);
      if (index >= 0) demoPlugins[index] = installed; else demoPlugins.push(installed);
      return {ok: true, plugin: {id: entry.id, name: entry.name, version: entry.version}, overview: demoPluginOverview()};
    },
  };
  const themeListeners = new Set();
  const getWebsiteTheme = () => {
    try { return window.parent.document.documentElement.dataset.theme === 'dark' ? 'charcoal-pink' : 'pearl-white'; }
    catch { return 'pearl-white'; }
  };
  window.cyreneTheme = {
    get: async () => getWebsiteTheme(),
    onChanged: (callback) => { themeListeners.add(callback); return () => themeListeners.delete(callback); },
    getRadius: async () => true, onRadiusChanged: () => noop,
  };
  window.chat = new Proxy({
    getGeneralSettings: async () => ({language: 'zh-CN'}),
    getEnabledStickers: async () => [], getImagePreview: async () => null,
    minimize: noop, toggleMaximize: noop, close: noop,
    showSaveDialog: async () => ({canceled: true}),
  }, {
    get(target, key) {
      if (key in target) return target[key];
      if (typeof key === 'string' && key.startsWith('on')) return () => noop;
      return async () => null;
    },
  });
  window.tts = new Proxy({
    loadSettings: async () => ({...demoTtsSettings}),
    saveSettings: async (patch) => Object.assign(demoTtsSettings, patch || {}),
    synthesize: async () => demoAudio,
    synthesizeGptsovits: async () => ({base64: demoAudio, format: 'wav'}),
    synthesizeCustomCloud: async () => ({base64: demoAudio, format: 'mp3'}),
    synthesizeMimo: async () => ({base64: demoAudio, format: 'wav'}),
    synthesizeMossland: async (_payload) => ({base64: demoAudio, format: demoTtsSettings.ttsMosslandFormat}),
    synthesizeCached: async () => ({base64: demoAudio, format: 'mp3'}),
    synthesizeCachedGptsovits: async () => ({base64: demoAudio, format: 'wav'}),
    synthesizeCachedCustomCloud: async () => ({base64: demoAudio, format: 'mp3'}),
    synthesizeCachedMimo: async () => ({base64: demoAudio, format: 'wav'}),
    synthesizeCachedMossland: async () => ({base64: demoAudio, format: demoTtsSettings.ttsMosslandFormat}),
    pickAudio: async () => '演示音频/参考音频.wav',
    pickAudioFile: async () => '演示音频/音色样本.wav',
    upload: async () => ({file_id: 'demo-file-id'}),
    clone: async () => ({voice_id: 'demo-cloned-voice'}),
    cloneMossland: async () => ({voice_id: 'demo-mossland-voice'}),
    listMosslandVoices: async () => ({voices: [
      {id: 'demo-voice-cyrene', name: '昔涟 · 温柔', createdAt: time},
      {id: 'demo-voice-clear', name: '清亮女声', createdAt: time - 86400000},
      {id: 'demo-voice-calm', name: '沉静男声', createdAt: time - 172800000},
    ], hasMore: false}),
    startSession: async () => ({ok: false, error: '演示预览不启动语音合成'}),
    cancelSession: async () => ({ok: true}),
    onSessionEvent: () => noop,
  }, {get(target, key) { return key in target ? target[key] : async () => ({ok: true}); }});
  window.music = {
    getCachedTracks: async () => ({ok: true, data: [...demoMusicTracks]}),
    importLocalFolder: async () => ({ok: true, data: {imported: 3, skipped: 0}}),
    importLocalTracks: async () => ({ok: true, data: {imported: 2, skipped: 0}}),
    openPlayer: async () => ({ok: true}),
  };
  window.tokenUsage = {
    get: async (days = 366) => ({...demoUsageReport(), days: demoUsageReport().days.slice(-days)}),
    clear: async () => {
      demoUsageDays = demoUsageDays.map((day) => ({...day, input: 0, output: 0, hit: 0, miss: 0, cacheCreation: 0, requests: 0, attemptedRequests: 0, cacheUsageRequests: 0, models: {}}));
    },
  };
  window.system = {openExternal: async () => ({ok: true})};

  const style = document.createElement('style');
  style.textContent = `
    .cy-composer__prefix-actions, .cy-composer__footer { pointer-events: none !important; opacity: .5; }
    .cy-composer__file-input { display: none !important; }
  `;
  document.head.append(style);

  // iframe 与网站同源，只读取主题选择，不读取网站上的其它内容。
  try {
    const parentRoot = window.parent.document.documentElement;
    const syncTheme = () => {
      const theme = getWebsiteTheme();
      document.documentElement.dataset.uiTheme = theme;
      delete document.documentElement.dataset.uiThemePending;
      themeListeners.forEach((callback) => callback(theme));
    };
    syncTheme();
    new MutationObserver(syncTheme).observe(parentRoot, {attributes: true, attributeFilter: ['data-theme']});
  } catch {
    // 独立打开预览时保持桌面端默认的珍珠白主题。
  }
})();
