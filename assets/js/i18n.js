/* NAPELL Eco — i18n (EN / 简体中文) */
(function () {
  var KEY = "napell_eco_lang";
  function get() {
    var v = null;
    try { v = localStorage.getItem(KEY); } catch (e) {}
    if (v !== "en" && v !== "zh") v = "en"; // English-first for public-facing site
    return v;
  }
  function apply(lang) {
    document.documentElement.setAttribute("data-lang", lang);
    document.title = document.querySelector("meta[name=\"title-" + lang + "\"]")
      ? document.querySelector('meta[name="title-' + lang + '"]').content
      : document.title;
  }
  window.NPL_LANG = get;
  window.NPL_SET_LANG = function (lang) {
    if (lang !== "en" && lang !== "zh") return;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    apply(lang);
    window.dispatchEvent(new Event("langchange"));
  };
  apply(get());
  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("langToggle");
    if (btn) {
      var label = function () {
        btn.textContent = get() === "en" ? "中文" : "EN";
      };
      label();
      btn.addEventListener("click", function () {
        window.NPL_SET_LANG(get() === "en" ? "zh" : "en");
        label();
      });
      window.addEventListener("langchange", label);
    }
  });
})();
