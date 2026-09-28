// Shared light/dark/system theme control for every Tool Lab page.
// Load this early in <head> (before common.css) so the stored theme
// applies before first paint, avoiding a flash of the wrong theme.
(function () {
  const STORAGE_KEY = "tool-lab-theme"; // "light" | "dark"; absent = system

  function getStored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function setStored(theme) {
    try {
      if (theme === "system") {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, theme);
      }
    } catch {
      // localStorage unavailable (e.g. private browsing) - selection just won't persist.
    }
  }

  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    document.dispatchEvent(new CustomEvent("toollab-theme-change", { detail: { theme } }));
  }

  // Apply immediately, before the stylesheet paints, to avoid a flash.
  applyTheme(getStored() || "system");

  document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("theme-toggle");
    if (!container) return;

    const options = [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
      { value: "system", label: "System" },
    ];

    function render() {
      const current = getStored() || "system";
      container.innerHTML = "";
      options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "theme-toggle__btn";
        btn.textContent = opt.label;
        btn.setAttribute("aria-pressed", String(opt.value === current));
        btn.addEventListener("click", () => {
          setStored(opt.value);
          applyTheme(opt.value);
          render();
        });
        container.append(btn);
      });
    }

    render();
  });
})();
