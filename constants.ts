
import { MoodConfig, MoodType, PetConfig, PetType } from './types';

export const MOOD_OPTIONS: Record<MoodType, MoodConfig> = {
  happy: {
    id: 'happy',
    label: '开心',
    cropName: '向日葵',
    emoji: '🌻',
    color: '#facc15',
    description: '心情明媚'
  },
  calm: {
    id: 'calm',
    label: '平静',
    cropName: '薰衣草',
    emoji: '🌿',
    color: '#a78bfa',
    description: '内心安宁'
  },
  tired: {
    id: 'tired',
    label: '疲惫',
    cropName: '土豆',
    emoji: '🥔',
    color: '#a8a29e',
    description: '忙碌劳累'
  },
  anxious: {
    id: 'anxious',
    label: '焦虑',
    cropName: '仙人掌',
    emoji: '🌵',
    color: '#4ade80',
    description: '心神不宁'
  },
  sad: {
    id: 'sad',
    label: '低落',
    cropName: '蘑菇',
    emoji: '🍄',
    color: '#f87171',
    description: '情绪低沉'
  }
};

export const LOCAL_STORAGE_KEY = 'moodFarmData';
export const LOCAL_STORAGE_PET_NAME = 'moodFarmPetName';
export const LOCAL_STORAGE_PET_TYPE = 'moodFarmPetType';
export const FARM_GRID_SIZE = 35; // 7x5 grid

export const PET_OPTIONS: PetConfig[] = [
  { id: 'cat', name: '小猫', emoji: '🐱', color: '#f4a460' },
  { id: 'dog', name: '小狗', emoji: '🐶', color: '#8d6e63' },
  { id: 'rabbit', name: '小兔', emoji: '🐰', color: '#ffffff' },
  { id: 'hamster', name: '仓鼠', emoji: '🐹', color: '#ffcc80' },
  { id: 'fox', name: '狐狸', emoji: '🦊', color: '#ff7043' },
  { id: 'chick', name: '小鸡', emoji: '🐥', color: '#ffeb3b' },
  { id: 'turtle', name: '乌龟', emoji: '🐢', color: '#66bb6a' },
  { id: 'panda', name: '熊猫', emoji: '🐼', color: '#ffffff' },
];

export const UI_TEXT = {
  title: "情绪小农场",
  currentSeason: "本季农田",
  harvestLog: "今日收成日志",
  dailyPlanting: "今日播种",
  selectSeed: "选择心情种子",
  fieldNotes: "田野笔记",
  optional: "选填",
  plantSeed: "播种",
  cropPlanted: "今日种下",
  mood: "心情",
  journal: "心情日记",
  journalPlaceholder: "写一句今天的心情吧……",
  comeBackTomorrow: "明天再来播种吧！",
  totalHarvest: "累计收成",
  dominantMood: "最近主导心情",
  yieldReport: "心情统计",
  startPlanting: "快去种下第一颗心情吧！",
  noData: "暂无数据",
  footer: "用心耕耘你的心灵花园。🌻",
  removePlant: "铲除作物 (重新播种)",
  kitchen: {
    title: "情绪料理",
    subtitle: "用最近的心情做一道菜",
    timeRange: "时间范围：",
    cookBtn: "开始烹饪",
    cooking: "正在熬煮心情...",
    days7: "最近 7 天",
    days14: "最近 14 天",
    days30: "最近 30 天",
    reCook: "重新烹饪",
    emptyPantry: "食材不够，再去种几天地吧！",
    recipeLabel: "配方构成",
    generatedDate: "生成日期"
  },
  naming: {
    title: "领养你的情绪伙伴",
    label: "给小伙伴取个名字吧：",
    typeLabel: "选择你的伙伴：",
    placeholder: "例如：阿黄、团子...",
    save: "确认领养",
    defaultName: "阿黄"
  }
};

export const SPIRIT_DIALOGUES = {
  default: [
    "你好呀，农夫！",
    "今天的土地看起来很肥沃。",
    "别忘了给你的心浇浇水。"
  ],
  streak_high: [ // Familiar / Warm (5+ days)
    "每天见到你真好！",
    "我们一起进步很大。",
    "你做得真棒。",
    "我泡了茶，要喝一口吗？"
  ],
  mood: {
    happy: [
      "你像向日葵一样闪闪发光！",
      "活着真是太好了！",
      "让我们沐浴在阳光下吧！"
    ],
    calm: [
      "吸气……呼气……",
      "平静是最好的养料。",
      "看着云朵慢慢飘过……"
    ],
    tired: [
      "休息也是生长的一部分。",
      "不要太勉强自己哦，小幼苗。",
      "来，在这个南瓜上坐会儿。"
    ],
    anxious: [
      "一步一步来，好吗？",
      "暴风雨总会过去的。",
      "我会一直陪着你。"
    ],
    sad: [
      "哭出来也没关系，眼泪是灵魂的雨水。",
      "我会为你撑伞。",
      "蘑菇也需要在阴影里才能长大。"
    ]
  }
};

// New Pet Specific Dialogues (Generic enough for all pets)
export const CAT_DIALOGUES = {
    default: [
        "今天还没种地吗？",
        "我在等你的心情种子发芽呢。",
        "要摸摸肚子吗？",
        "呼噜...呼噜..."
    ],
    happy: [
        "你今天像阳光一样暖和！(蹭蹭)",
        "看起来今天会有好收成！",
        "开心的味道是甜甜的！",
        "我们去抓蝴蝶吧！"
    ],
    calm: [
        "这种宁静的感觉真好...",
        "要在草地上一起打滚吗？",
        "呼噜... (眯着眼睛享受)",
        "今天适合睡午觉..."
    ],
    tired: [
        "累了吗？把头靠在我身上吧...",
        "休息也是很重要的工作。",
        "剩下的工作明天再说吧。",
        "给你揉揉肩... (伸出爪子)"
    ],
    anxious: [
        "别怕，我会把噩梦都赶走！",
        "深呼吸...呼噜...深呼吸...",
        "我在这里，哪里也不去。",
        "焦虑是大坏蛋，我们一起打败它！"
    ],
    sad: [
        "呜... (轻轻蹭你的手)",
        "没关系的，我会一直陪着你。",
        "借你一点毛茸茸的温暖...",
        "允许你难过一小会儿。"
    ]
};

// --- Kitchen Constants ---

export interface Ingredient {
  name: string;
  emoji: string;
  description: string;
}

export const INGREDIENTS: Record<MoodType, Ingredient> = {
  happy: { name: '甜南瓜', emoji: '🎃', description: '甜蜜的快乐' },
  calm: { name: '越光米', emoji: '🍚', description: '平淡的安稳' },
  tired: { name: '鲜鸡蛋', emoji: '🥚', description: '补充能量' },
  anxious: { name: '红辣椒', emoji: '🌶️', description: '热辣的刺激' },
  sad: { name: '浓芝士', emoji: '🧀', description: '浓郁的慰藉' }
};

export interface DishRecipe {
  name: string;
  emoji: string;
  desc: string;
  summary: string;
}

// Logic will pick these based on dominant mood
export const DISH_RECIPES: Record<MoodType | 'mixed' | 'empty', DishRecipe> = {
  happy: {
    name: '向日葵暖暖南瓜汤',
    emoji: '🥘',
    desc: '口感绵密香甜，每一口都是阳光的味道。这段时间你收集了好多快乐，整个人都在发光呢！',
    summary: '这阵子整体是温暖偏甜的一段时间，就像这碗金灿灿的汤。'
  },
  calm: {
    name: '田间慢炖杂蔬锅',
    emoji: '🍲',
    desc: '简单却回味悠长。生活平平静静，也是一种难得的幸福。这碗饭能抚平所有的褶皱。',
    summary: '虽然平淡，但每一种滋味都刚刚好，这就是安稳的力量。'
  },
  tired: {
    name: '打工人的能量早饭',
    emoji: '🍳',
    desc: '最近辛苦啦！这里有蛋白质满满的鸡蛋和提神的咖啡豆。吃饱了，睡一觉，电量充满再出发！',
    summary: '偶尔有点累没关系，这顿饭给你加满油，明天又是新的一天。'
  },
  anxious: {
    name: '深夜安慰焗饭',
    emoji: '🍛',
    desc: '有点焦虑也没关系，吃点热乎的。把担忧都煮进浓郁的酱汁里，大口吃掉。',
    summary: '给紧绷的神经放个假，今晚就好好享受食物的拥抱吧。'
  },
  sad: {
    name: '暖心治愈炖菜',
    emoji: '🥣',
    desc: '热乎乎、拉丝的芝士能包裹住所有的小失落。允许自己低落一会儿，食物会给你大大的拥抱。',
    summary: '不用强颜欢笑，这道菜懂你的所有情绪，慢慢治愈你。'
  },
  mixed: {
    name: '彩虹心情大乱炖',
    emoji: '🥗',
    desc: '酸甜苦辣咸，样样都有！这段时间你的经历丰富多彩，这就是真实而鲜活的生活呀。',
    summary: '生活百般滋味，你把它们都调和得很好，真棒。'
  },
  empty: {
    name: '空气拌饭',
    emoji: '🥣',
    desc: '锅里空空如也……快去农场种点心情，过几天再来做饭吧！',
    summary: '巧妇难为无米之炊呀～'
  }
};
