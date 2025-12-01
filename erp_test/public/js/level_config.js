const INGREDIENT_MAPPING = {
    
    1: { name: "四季豆", img: "foursidedbean.png" },
    2: { name: "甘梅地瓜", img: "sweetpotato.png" },
    3: { name: "酥炸豆干", img: "tofu.png" },
    4: { name: "美味四季豆", img: "bean.png" },
    5: { name: "香Q鳥蛋", img: "bird_egg.png" },
    
    6: { name: "青蔥", img: "onion.png" },
    7: { name: "玉米筍", img: "corn.png" },
    8: { name: "芋頭糕", img: "taro.png" },
    9: { name: "米血糕", img: "rice_cake.png" },
    10: { name: "魷魚", img: "squid.png" },
    
    // ⚠️ 請繼續填寫 Level 11 到 Level 30 的獨特食材...
    // 範例：
    11: { name: "隱藏食材_11", img: "ingredient_11.png" },
    // ...
    30: { name: "終極大魔王食材", img: "ingredient_30.png" },
};
// -----------------------------------------------------------------


// 輔助函式：根據關卡號碼確定題數和容錯次數 (維持不變)
function getTierRules(level) {
    if (level <= 5) return { questions: 5, maxMistakes: 1 };
    if (level <= 10) return { questions: 10, maxMistakes: 3 };
    if (level <= 15) return { questions: 15, maxMistakes: 5 };
    if (level <= 20) return { questions: 20, maxMistakes: 7 };
    if (level <= 25) return { questions: 25, maxMistakes: 9 };
    return { questions: 30, maxMistakes: 11 };
}

// -----------------------------------------------------------------
// 核心配置：組合規則與獎勵數據
// -----------------------------------------------------------------
export const LEVEL_CONFIGS = [];

for (let i = 1; i <= 30; i++) {
    const rules = getTierRules(i);
    const ingredient = INGREDIENT_MAPPING[i] || { rewardName: "未知獎勵", rewardImg: "default.png" }; // 確保有預設值
    
    LEVEL_CONFIGS.push({
        level: i,
        questions: rules.questions, 
        maxMistakes: rules.maxMistakes,
        
        // 🚨 這裡使用映射表中的獨特值
        rewardName: ingredient.name,
        rewardImg: ingredient.img 
    });
}


// 輔助函式：根據關卡號碼獲取配置
export function getConfigByLevel(level) {
    const index = Number(level) - 1; 
    
    if (index >= 0 && index < LEVEL_CONFIGS.length) {
        return LEVEL_CONFIGS[index];
    }
    
    console.error(`找不到關卡 ${level} 的配置。`);
    return null;
}