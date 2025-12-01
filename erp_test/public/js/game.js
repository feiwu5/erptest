document.addEventListener("DOMContentLoaded", () => {
    // 確保 DOM 載入完成後才執行程式碼

    // --- 1. 處理歡迎訊息的邏輯 ---
    const username = localStorage.getItem("username"); 
    const isNewPlayer = localStorage.getItem("isNewPlayer") === "true"; 
    const welcomeDiv = document.getElementById("welcome-msg"); 

    if (username && welcomeDiv) {
        welcomeDiv.textContent = isNewPlayer
            ? `歡迎新玩家~${username}！`
            : `歡迎回來~${username}！`;
    }

    // --- 2. 處理按鈕點擊並跳轉頁面的邏輯 ---

    // 取得「開始闖關」按鈕
    const adventureButton = document.getElementById("btn-adventure"); 
    if (adventureButton) {
        adventureButton.addEventListener("click", () => {
            // 點擊後跳轉到 quiz.html，並傳遞 mode=adventure 參數
            window.location.href = "quiz.html";
        });
    }

    // 取得「正式測驗」按鈕
    const fullTestButton = document.getElementById("btn-full-test");
    if (fullTestButton) {
        fullTestButton.addEventListener("click", () => {
            window.location.href = "full_test.html";
        });
    }

    // 取得「錯題目」按鈕
    const wrongButton = document.getElementById("btn-wrong");
    if (wrongButton) {
        wrongButton.addEventListener("click", () => {
            window.location.href = "wrong_questions.html";
        });
    }

    // 取得「完整題庫」按鈕
    const allQuestionsButton = document.getElementById("btn-all-questions");
    if (allQuestionsButton) {
        allQuestionsButton.addEventListener("click", () => {
            window.location.href = "all_question.html";
        });
    }
});



