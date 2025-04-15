
document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("login-btn");
    const toolsAndFilters = document.getElementById("tools-and-filters");
    const loginContainer = document.getElementById("login-container");

    loginBtn.addEventListener("click", function () {
        toolsAndFilters.classList.remove("hidden");
        loginContainer.classList.add("hidden");
        sessionStorage.setItem("loggedIn", "true");
    });

    if (sessionStorage.getItem("loggedIn") === "true") {
        toolsAndFilters.classList.remove("hidden");
        loginContainer.classList.add("hidden");
    }
});
