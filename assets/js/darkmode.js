// Immediately apply dark class to <html> element to prevent FOUC (flash of light theme)
(function applyThemeEarly() {
    var v = document.cookie.match('(^|;) ?theme=([^;]*)(;|$)');
    var theme = v ? v[2] : null;
    var userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (theme === 'dark' || (!theme && userPrefersDark)) {
        document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
    }
})();

function toggleDarkMode() {
    const DARK_CLASS = 'dark';
    var html = document.documentElement;
    var body = document.body;
    var toggle = document.querySelector('.dark-mode-toggle');
    
    var isDark = html.classList.contains(DARK_CLASS) || (body && body.classList.contains(DARK_CLASS));
    if (isDark) {
        setCookie('theme', 'light', 365);
        html.classList.remove(DARK_CLASS);
        if (body) body.classList.remove(DARK_CLASS);
        if (toggle) toggle.checked = false;
    } else {
        setCookie('theme', 'dark', 365);
        html.classList.add(DARK_CLASS);
        if (body) body.classList.add(DARK_CLASS);
        if (toggle) toggle.checked = true;
    }
}

function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + 24*60*60*1000*(days || 365));
    document.cookie = name + "=" + value + ";path=/;SameSite=strict;expires=" + d.toGMTString();
}

function initDarkMode() {
    const DARK_CLASS = 'dark';
    var theme = getCookie('theme');
    var userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var html = document.documentElement;
    var body = document.body;
    var toggle = document.querySelector('.dark-mode-toggle');

    var isDark = theme === 'dark' || (!theme && userPrefersDark);
    if (isDark) {
        html.classList.add(DARK_CLASS);
        if (body) body.classList.add(DARK_CLASS);
        if (toggle) toggle.checked = true;
    } else {
        html.classList.remove(DARK_CLASS);
        if (body) body.classList.remove(DARK_CLASS);
        if (toggle) toggle.checked = false;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
    initDarkMode();
}
