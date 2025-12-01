import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// -------------------------
// Firebase 設定
// -------------------------
const firebaseConfig = {
    apiKey: "AIzaSyBGmdTWLvh00bp4yg7pGNRBDfV5u71Dg-w",
    authDomain: "erptest-6a27e.firebaseapp.com",
    projectId: "erptest-6a27e",
    storageBucket: "erptest-6a27e.firebasestorage.app",
    messagingSenderId: "452335653196",
    appId: "1:452335653196:web:b720ba373ac317493e7fe9",
    measurementId: "G-9MTLH6QCCN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// -------------------------
// DOM 元素（放在 DOMContentLoaded 裡，避免找不到元素）
// -------------------------
let quizTitle, questionText, optionsList, nextBtn;

document.addEventListener("DOMContentLoaded", () => {
    // 假設 HTML 裡有這些 ID 的元素
    quizTitle = document.getElementById("full-test-title");
    questionText = document.getElementById("question-text");
    optionsList = document.getElementById("options-list");
    nextBtn = document.getElementById("next-btn");

    // 讀取 localStorage 記錄。category 將是 Firestore 集合名稱。
    const category = localStorage.getItem("test_category") || "題庫";
    
    if (quizTitle) {
        quizTitle.textContent = `正式測驗 - ${category}`;
    }

    // 初始化測驗
    initQuiz(category);
});

// -------------------------
// 變數
// -------------------------
let questions = [];
let current = 0;
let userAnswers = [];


// -------------------------
// 從 Firestore 載入題目 (通用且安靜版本)
// -------------------------
async function loadQuestions(category) {
    
    // 🎯 修正：使用傳入的 category 參數作為集合名稱，支援多題庫
    const collectionPath = category; 
    
    try {
        const colRef = collection(db, collectionPath);
        const snap = await getDocs(colRef);

        if (snap.empty) {
            // 找不到文件時，僅在控制台顯示警告
            console.warn(`[題庫載入] 警告：路徑 [${collectionPath}] 找不到任何題目文件。`);
            return [];
        }

        const list = [];
        snap.forEach(doc => {
            const data = doc.data();
            
            // 將 options 物件轉換為陣列，並依鍵名排序
            const optionsArray = Object.entries(data.options || {})
                .sort(([keyA], [keyB]) => parseInt(keyA) - parseInt(keyB))
                .map(([, value]) => value);

            list.push({ 
                id: doc.id, 
                ...data,
                options: optionsArray 
            });
        });

        // 成功載入時，不顯示任何 console.log 或 alert
        return shuffle(list).slice(0, 5); // 隨機取 5 題作為示範
        
    } catch (err) {
        // 讀取錯誤時，僅在控制台顯示錯誤
        console.error("[題庫載入] 發生錯誤，可能是 Firebase 安全性規則或連線問題:", err);
        return [];
    }
}

// -------------------------
// 顯示題目 (選項改為 A, B, C, D)
// -------------------------
function showQuestion(index) {
    const q = questions[index];
    
    if (!questionText || !optionsList) return;

    questionText.textContent = `${index + 1}. ${q.question}`; // 加上題號

    optionsList.innerHTML = "";
    
    q.options.forEach((opt, i) => {
        const li = document.createElement("li");
        
        // 🚨 修正：將數字索引轉換為 A, B, C, D...
        const optionLabel = String.fromCharCode(65 + i); 
        
        li.textContent = `${optionLabel}. ${opt}`; // 顯示 A. B. C. D.
        li.dataset.optionIndex = i; // 儲存答案索引 (0, 1, 2, 3)

        // 檢查使用者是否已選過答案，並標示
        if (userAnswers[index] !== undefined && userAnswers[index] === i) {
             li.style.backgroundColor = "#4a90e2";
             li.style.color = "white";
        }
        
        li.addEventListener("click", (e) => {
            const selectedIndex = parseInt(e.currentTarget.dataset.optionIndex);
            userAnswers[index] = selectedIndex; // 記錄答案索引

            // 標示選取
            optionsList.querySelectorAll("li").forEach(item => {
                item.style.backgroundColor = "";
                item.style.color = "";
            });
            e.currentTarget.style.backgroundColor = "#4a90e2";
            e.currentTarget.style.color = "white";
        });
        optionsList.appendChild(li);
    });
}

// -------------------------
// 下一題按鈕
// -------------------------
function setupNextButton() {
    if (!nextBtn) return; 

    nextBtn.addEventListener("click", () => {
        // ⚠️ 修正：將 alert 改為更友善的提示
        if (userAnswers[current] === undefined) {
            alert("請先選擇答案！"); 
            return;
        }

        current++;
        if (current >= questions.length) {
            // 完成測驗
            localStorage.setItem("user_answers", JSON.stringify(userAnswers));
            // ⚠️ 修正：將 alert 改為更友善的提示
            alert("正式測驗完成！即將跳轉到結果頁面。");
            window.location.href = "full_test_result.html"; 
        } else {
            showQuestion(current);
        }
    });
}

// -------------------------
// 洗牌函式
// -------------------------
function shuffle(arr) {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// -------------------------
// 初始化
// -------------------------
async function initQuiz(category) {
    questions = await loadQuestions(category);
    
    // 🎯 關鍵修正：將完整的題目清單（包含正確答案）儲存到 localStorage
    if (questions.length > 0) {
        localStorage.setItem("all_questions", JSON.stringify(questions)); 

        showQuestion(current);
        setupNextButton();
    } else if (questionText) {
        // 🚨 找不到題目時的顯示，並隱藏按鈕
        questionText.textContent = `載入題庫失敗或 [${category}] 尚無題目。`;
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }
    }
}