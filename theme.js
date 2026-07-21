(function () {
    var STORAGE_KEY = "portfolio-theme";
    var COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

    function getCookie(name) {
        var match = document.cookie.match(
            new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
        );
        return match ? decodeURIComponent(match[1]) : null;
    }

    function setCookie(name, value) {
        document.cookie =
            name +
            "=" +
            encodeURIComponent(value) +
            "; path=/; max-age=" +
            COOKIE_MAX_AGE +
            "; SameSite=Lax";
    }

    function getPreferredTheme() {
        var saved = getCookie(STORAGE_KEY);
        if (saved === "light" || saved === "dark") return saved;

        // Migrate any previous localStorage preference into a cookie once
        try {
            var legacy = localStorage.getItem(STORAGE_KEY);
            if (legacy === "light" || legacy === "dark") {
                setCookie(STORAGE_KEY, legacy);
                localStorage.removeItem(STORAGE_KEY);
                return legacy;
            }
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
        setCookie(STORAGE_KEY, theme);
        try {
            localStorage.removeItem(STORAGE_KEY);
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
