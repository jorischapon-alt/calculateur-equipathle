// main.js
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Application started...");

    // Load Data First
    const success = await DataManager.loadData();

    if (success) {
        // Initialize UI
        UI.init();
    }
});
