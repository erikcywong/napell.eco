/* NAPELL Eco — echarts registry. All numbers sourced from NAPELL 单仓财务模型 v1 (2026-10). */
(function () {
  var instances = [];
  var ACCENT = "#1d9bf0", UP = "#00ba7c", WARN = "#ffd400", MUTED = "#71767b", TEXT = "#e7e9ea", BORDER = "#2f3336";

  var T = {
    en: {
      cum: { name: "Cumulative cash flow (10k ¥)", year: "Year", tipY: "Year " },
      mix: { name: "Steady-state revenue mix (10k ¥/yr)", val: "Revenue" },
      sens: { name: "Static payback (yrs)", factor: "Buyback price factor", base: "Baseline" },
      ebitda: { name: "Steady-state EBITDA (10k ¥/yr)", factor: "Buyback price factor" }
    },
    zh: {
      cum: { name: "累计现金流（万元）", year: "年份", tipY: "第" },
      mix: { name: "稳态收入结构（万元/年）", val: "收入" },
      sens: { name: "静态回收期（年）", factor: "回购价系数", base: "基准" },
      ebitda: { name: "稳态 EBITDA（万元/年）", factor: "回购价系数" }
    }
  };

  var YEARS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  var CUM = [-200.0, -192.65, -160.54, -108.93, -54.44, 2.10, 58.65, 115.20, 171.75, 228.29, 284.84];
  var FACTORS = ["80%", "90%", "100%", "110%", "120%"];
  var PAYBACK = [3.27, 3.08, 2.91, 2.76, 2.62];
  var EBITDA = [61.1, 64.9, 68.7, 72.6, 76.4];

  function axis(extra) {
    return Object.assign({
      axisLine: { lineStyle: { color: BORDER } },
      axisLabel: { color: MUTED },
      splitLine: { lineStyle: { color: "rgba(47,51,54,.6)" } }
    }, extra || {});
  }

  var builders = {
    cum: function (lang) {
      var t = T[lang].cum;
      return {
        backgroundColor: "transparent",
        grid: { left: 56, right: 24, top: 40, bottom: 40 },
        tooltip: { trigger: "axis", valueFormatter: function (v) { return v + " 万¥"; } },
        xAxis: axis({ type: "category", data: YEARS.map(function (y) { return t.tipY + y; }), name: t.year, nameTextStyle: { color: MUTED } }),
        yAxis: axis({ type: "value", name: t.name, nameTextStyle: { color: MUTED } }),
        visualMap: {
          show: false, dimension: 0,
          pieces: [{ lt: 5, color: "#f4212e" }, { gte: 5, color: UP }]
        },
        series: [{
          type: "line", data: CUM, smooth: false, symbol: "circle", symbolSize: 7,
          lineStyle: { width: 3 }, itemStyle: { color: ACCENT },
          markLine: {
            silent: true, symbol: "none",
            lineStyle: { color: MUTED, type: "dashed" },
            label: { color: MUTED, formatter: "0" },
            data: [{ yAxis: 0 }]
          }
        }]
      };
    },
    mix: function (lang) {
      var t = T[lang].mix;
      return {
        backgroundColor: "transparent",
        tooltip: { trigger: "item", valueFormatter: function (v) { return v + " 万¥/yr"; } },
        legend: { bottom: 0, textStyle: { color: MUTED } },
        series: [{
          type: "pie", radius: ["46%", "70%"], center: ["50%", "46%"],
          label: { color: TEXT, formatter: "{b}\n{d}%" },
          labelLine: { lineStyle: { color: BORDER } },
          data: [
            { name: lang === "zh" ? "种苗繁育" : "Seedlings", value: 72.0, itemStyle: { color: ACCENT } },
            { name: lang === "zh" ? "生豆回购" : "Green beans", value: 38.2, itemStyle: { color: UP } },
            { name: lang === "zh" ? "副产物与体验" : "By-products & tours", value: 6.0, itemStyle: { color: WARN } }
          ]
        }]
      };
    },
    sens: function (lang) {
      var t = T[lang].sens;
      return {
        backgroundColor: "transparent",
        grid: { left: 56, right: 24, top: 44, bottom: 40 },
        tooltip: { trigger: "axis", valueFormatter: function (v) { return v + " yrs"; } },
        xAxis: axis({ type: "category", data: FACTORS, name: t.factor, nameTextStyle: { color: MUTED } }),
        yAxis: axis({ type: "value", name: t.name, nameTextStyle: { color: MUTED }, max: 3.6 }),
        series: [{
          type: "bar", data: PAYBACK.map(function (v) {
            return { value: v, itemStyle: { color: v <= 2.91 ? UP : (v <= 3.1 ? ACCENT : WARN), borderRadius: [6, 6, 0, 0] } };
          }),
          label: { show: true, position: "top", color: TEXT, formatter: "{c}y" },
          barWidth: "46%"
        }]
      };
    },
    ebitda: function (lang) {
      var t = T[lang].ebitda;
      return {
        backgroundColor: "transparent",
        grid: { left: 56, right: 24, top: 44, bottom: 40 },
        tooltip: { trigger: "axis", valueFormatter: function (v) { return v + " 万¥/yr"; } },
        xAxis: axis({ type: "category", data: FACTORS, name: t.factor, nameTextStyle: { color: MUTED } }),
        yAxis: axis({ type: "value", name: T[lang].ebitda.name, nameTextStyle: { color: MUTED }, min: 50 }),
        series: [{
          type: "bar", data: EBITDA.map(function (v) {
            return { value: v, itemStyle: { color: ACCENT, borderRadius: [6, 6, 0, 0] } };
          }),
          label: { show: true, position: "top", color: TEXT, formatter: "{c}" },
          barWidth: "46%"
        }]
      };
    }
  };

  function renderAll() {
    var lang = (window.NPL_LANG && window.NPL_LANG()) || "en";
    instances.forEach(function (it) { it.chart.dispose(); });
    instances = [];
    document.querySelectorAll("[data-chart]").forEach(function (el) {
      var name = el.getAttribute("data-chart");
      if (!builders[name] || !window.echarts) return;
      var chart = window.echarts.init(el);
      chart.setOption(builders[name](lang));
      instances.push({ chart: chart, el: el });
    });
  }

  window.addEventListener("DOMContentLoaded", function () {
    if (document.querySelector("[data-chart]")) {
      var tryInit = function (n) {
        if (window.echarts) { renderAll(); return; }
        if (n > 40) return;
        setTimeout(function () { tryInit(n + 1); }, 150);
      };
      tryInit(0);
    }
  });
  window.addEventListener("langchange", renderAll);
  window.addEventListener("resize", function () {
    instances.forEach(function (it) { it.chart.resize(); });
  });
})();
