// Theme Manager
(function() {
  const THEME_KEY = 'theme';
  const DARK_CLASS = 'dark';

  function getStoredTheme() {
    try {
      var local = localStorage.getItem(THEME_KEY);
      if (local) return local;
    } catch (e) {}

    var match = document.cookie.match('(^|;) ?theme=([^;]*)(;|$)');
    return match ? match[2] : null;
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}

    var d = new Date();
    d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = 'theme=' + theme + ';path=/;SameSite=strict;expires=' + d.toUTCString();
  }

  function isDarkTheme() {
    var stored = getStoredTheme();
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyTheme(isDark) {
    var html = document.documentElement;
    var body = document.body;

    if (isDark) {
      html.classList.add(DARK_CLASS);
      if (body) body.classList.add(DARK_CLASS);
    } else {
      html.classList.remove(DARK_CLASS);
      if (body) body.classList.remove(DARK_CLASS);
    }

    // Sync all toggle switches on page
    var toggles = document.querySelectorAll('.dark-mode-toggle');
    toggles.forEach(function(toggle) {
      toggle.checked = isDark;
    });
  }

  // Early application to avoid flash
  applyTheme(isDarkTheme());

  window.toggleDarkMode = function() {
    var nextDark = !document.documentElement.classList.contains(DARK_CLASS);
    setStoredTheme(nextDark ? 'dark' : 'light');
    applyTheme(nextDark);
  };

  function initToggles() {
    var isDark = isDarkTheme();
    applyTheme(isDark);

    var toggles = document.querySelectorAll('.dark-mode-toggle');
    toggles.forEach(function(toggle) {
      toggle.checked = isDark;
      toggle.onchange = function() {
        var nextDark = this.checked;
        setStoredTheme(nextDark ? 'dark' : 'light');
        applyTheme(nextDark);
      };
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggles);
  } else {
    initToggles();
  }

  // Listen for OS system theme changes if user hasn't explicitly set a preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      if (!getStoredTheme()) {
        applyTheme(e.matches);
      }
    });
  }
})();
