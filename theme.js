(function () {
    var STORAGE_KEY = "portfolio-theme";

    function getPreferredTheme() {
        try {
            var saved = localStorage.getItem(STORAGE_KEY);
            if (saved === "light" || saved === "dark") return saved;
        } catch (e) {}
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        var buttons = document.querySelectorAll(".theme-toggle");
        buttons.forEach(function (btn) {
            var isDark = theme === "dark";
            btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
            btn.setAttribute("title", isDark ? "Light mode" : "Dark mode");
            btn.textContent = isDark ? "☀" : "☾";
        });
    }

    function setTheme(theme) {
        applyTheme(theme);
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {}
    }

    function toggleTheme() {
        var current = document.documentElement.getAttribute("data-theme") || "light";
        setTheme(current === "dark" ? "light" : "dark");
    }

    function setupDreamCursor() {
        var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (finePointer && !reducedMotion) {
            document.documentElement.classList.add("has-dream-cursor");
        } else {
            document.documentElement.classList.remove("has-dream-cursor");
        }
    }

    applyTheme(getPreferredTheme());
    setupDreamCursor();

    document.addEventListener("DOMContentLoaded", function () {
        applyTheme(document.documentElement.getAttribute("data-theme") || getPreferredTheme());
        document.querySelectorAll(".theme-toggle").forEach(function (btn) {
            btn.addEventListener("click", toggleTheme);
        });
        setupDreamCursor();
    });

    if (window.matchMedia) {
        window.matchMedia("(hover: hover) and (pointer: fine)").addEventListener("change", setupDreamCursor);
        window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", setupDreamCursor);
    }
})();
