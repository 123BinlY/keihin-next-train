const stationEl = document.querySelector("#station");
const directionEl = document.querySelector("#direction");
const dayTypeEl = document.querySelector("#dayType");
const nextTimeEl = document.querySelector("#nextTime");
const countdownEl = document.querySelector("#countdown");
const statusLineEl = document.querySelector("#statusLine");
const trainListEl = document.querySelector("#trainList");
const themeBtn = document.querySelector("#themeBtn");
const nowBtn = document.querySelector("#nowBtn");
const goWorkBtn = document.querySelector("#goWorkBtn");
const goHomeBtn = document.querySelector("#goHomeBtn");
const addFavoriteBtn = document.querySelector("#addFavoriteBtn");
const favoriteListEl = document.querySelector("#favoriteList");
const autoDayNoteEl = document.querySelector("#autoDayNote");
const languageSelect = document.querySelector("#languageSelect");

const FAVORITES_KEY = "keihin-next-train:favorites";
const THEME_KEY = "keihin-next-train:theme";
const LAST_SETTING_KEY = "keihin-next-train:last-setting";
const LANGUAGE_KEY = "keihin-next-train:language";

let currentLang = localStorage.getItem(LANGUAGE_KEY) || "zh";

const I18N = {
  zh: {
    eyebrow: "JR 京濱東北線",
    title: "下一班車",
    commuteTitle: "蒲田 ⇄ 大井町",
    commuteHint: "你每日通勤用，一撳即切換方向。",
    goWork: "出勤：蒲田 → 大井町",
    goHome: "放工：大井町 → 蒲田",
    stationLabel: "車站",
    directionLabel: "方向",
    dayLabel: "日子",
    northOption: "北行：東京・上野・大宮方面",
    southOption: "南行：川崎・横浜・大船方面",
    weekdayOption: "平日",
    saturdayOption: "星期六",
    sundayOption: "星期日/祝日",
    favoriteTitle: "收藏",
    favoriteHint: "會記住車站、方向、日子。",
    addFavorite: "＋收藏目前設定",
    nextTrainLabel: "下一班車",
    upcomingTitle: "之後 5 班",
    useNow: "用現在時間",
    footerNote1: "※ 目前係示範資料。正式使用前，請將 data.js 入面嘅時刻改成 JR 官方時刻表。",
    footerNote2: "※ 平日／星期六／休日會依照手機或電腦目前日期自動選擇，但日本祝日仍建議手動確認。",
    autoDay: "已自動判斷今日係：",
    weekday: "平日",
    saturday: "星期六",
    sunday: "星期日/祝日",
    north: "北行",
    south: "南行",
    nextDay: "翌日",
    noData: "時刻資料なし",
    notSet: "資料未設定",
    emptyFavorite: "未有收藏。你可以先收藏「蒲田→大井町」或者「大井町→蒲田」。",
    inHours: (h, m) => `あと ${h} 時間 ${m} 分`,
    inMinutes: (m, s) => `あと ${m} 分 ${String(s).padStart(2, "0")} 秒`,
  },

  ja: {
    eyebrow: "JR 京浜東北線",
    title: "次の電車",
    commuteTitle: "蒲田 ⇄ 大井町",
    commuteHint: "毎日の通勤用です。ワンタップで方向を切り替えます。",
    goWork: "出勤：蒲田 → 大井町",
    goHome: "退勤：大井町 → 蒲田",
    stationLabel: "駅",
    directionLabel: "方面",
    dayLabel: "日付種別",
    northOption: "北行：東京・上野・大宮方面",
    southOption: "南行：川崎・横浜・大船方面",
    weekdayOption: "平日",
    saturdayOption: "土曜日",
    sundayOption: "日曜・祝日",
    favoriteTitle: "お気に入り",
    favoriteHint: "駅・方面・日付種別を保存します。",
    addFavorite: "＋現在の設定を保存",
    nextTrainLabel: "次の電車",
    upcomingTitle: "この後 5 本",
    useNow: "現在時刻に戻す",
    footerNote1: "※ 現在はデモ用データです。正式使用前に data.js の時刻をJR公式時刻表に合わせてください。",
    footerNote2: "※ 平日／土曜／休日は端末の日付で自動選択しますが、日本の祝日は手動確認を推奨します。",
    autoDay: "本日の種別を自動判定：",
    weekday: "平日",
    saturday: "土曜日",
    sunday: "日曜・祝日",
    north: "北行",
    south: "南行",
    nextDay: "翌日",
    noData: "時刻データなし",
    notSet: "データ未設定",
    emptyFavorite: "お気に入りはまだありません。「蒲田→大井町」または「大井町→蒲田」を保存できます。",
    inHours: (h, m) => `あと ${h} 時間 ${m} 分`,
    inMinutes: (m, s) => `あと ${m} 分 ${String(s).padStart(2, "0")} 秒`,
  },

  en: {
    eyebrow: "JR Keihin-Tohoku Line",
    title: "Next Train",
    commuteTitle: "Kamata ⇄ Oimachi",
    commuteHint: "Your daily commute shortcut. Switch direction with one tap.",
    goWork: "To work: Kamata → Oimachi",
    goHome: "Go home: Oimachi → Kamata",
    stationLabel: "Station",
    directionLabel: "Direction",
    dayLabel: "Day type",
    northOption: "Northbound: Tokyo / Ueno / Omiya",
    southOption: "Southbound: Kawasaki / Yokohama / Ofuna",
    weekdayOption: "Weekday",
    saturdayOption: "Saturday",
    sundayOption: "Sunday / Holiday",
    favoriteTitle: "Favorites",
    favoriteHint: "Save station, direction, and day type.",
    addFavorite: "+ Save current setting",
    nextTrainLabel: "Next train",
    upcomingTitle: "Next 5 trains",
    useNow: "Use current time",
    footerNote1: "※ Demo timetable data. Before real use, update data.js with the official JR timetable.",
    footerNote2: "※ Weekday / Saturday / Holiday is chosen from your device date. Please manually check Japanese holidays.",
    autoDay: "Today was auto-detected as: ",
    weekday: "Weekday",
    saturday: "Saturday",
    sunday: "Sunday / Holiday",
    north: "Northbound",
    south: "Southbound",
    nextDay: "Next day",
    noData: "No timetable data",
    notSet: "No data set",
    emptyFavorite: "No favorites yet. You can save “Kamata → Oimachi” or “Oimachi → Kamata”.",
    inHours: (h, m) => `in ${h} hr ${m} min`,
    inMinutes: (m, s) => `in ${m} min ${String(s).padStart(2, "0")} sec`,
  },
};

function t(key) {
  return I18N[currentLang]?.[key] ?? I18N.zh[key] ?? key;
}

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem(LANGUAGE_KEY, lang);

  document.documentElement.lang = lang === "ja" ? "ja" : lang === "en" ? "en" : "zh-HK";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });

  renderStaticSelectOptions();
  autoDayNoteEl.textContent = `${t("autoDay")}${dayName(getDayTypeFromToday())}`;
  renderFavorites();
  render();
}

function renderStaticSelectOptions() {
  const northOption = directionEl.querySelector('option[value="north"]');
  const southOption = directionEl.querySelector('option[value="south"]');
  const weekdayOption = dayTypeEl.querySelector('option[value="weekday"]');
  const saturdayOption = dayTypeEl.querySelector('option[value="saturday"]');
  const sundayOption = dayTypeEl.querySelector('option[value="sunday"]');

  northOption.textContent = t("northOption");
  southOption.textContent = t("southOption");
  weekdayOption.textContent = t("weekdayOption");
  saturdayOption.textContent = t("saturdayOption");
  sundayOption.textContent = t("sundayOption");
}

function toMinutes(timeText) {
  const [h, m] = timeText.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(mins) {
  mins = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function addOffset(times, offset) {
  return times.map((time) => fromMinutes(toMinutes(time) + offset)).sort();
}

function getDayTypeFromToday() {
  const d = new Date().getDay();
  if (d === 0) return "sunday";
  if (d === 6) return "saturday";
  return "weekday";
}

function autoDayType() {
  const day = getDayTypeFromToday();
  dayTypeEl.value = day;
  autoDayNoteEl.textContent = `${t("autoDay")}${dayName(day)}`;
}

function getTimes() {
  const stationKey = stationEl.value;
  const day = dayTypeEl.value;
  const dir = directionEl.value;
  const station = TIMETABLE[stationKey];

  if (!station) return [];

  if (station.copyFrom) {
    const baseStation = TIMETABLE[station.copyFrom];
    const base = baseStation?.[day]?.[dir] ?? [];
    const offset = dir === "north" ? station.offsetNorth : station.offsetSouth;
    return addOffset(base, offset);
  }

  return station?.[day]?.[dir] ?? [];
}

function getNowTotalMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
}

function formatCountdown(diffMinutes) {
  const totalSeconds = Math.max(0, Math.ceil(diffMinutes * 60));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return t("inHours")(hours, minutes);
  }

  return t("inMinutes")(minutes, seconds);
}

function getUpcoming(times, count = 6) {
  const nowM = getNowTotalMinutes();

  const todayUpcoming = times
    .map((time) => ({
      time,
      diff: toMinutes(time) - nowM,
      nextDay: false,
    }))
    .filter((item) => item.diff >= 0);

  const tomorrowUpcoming = times.map((time) => ({
    time,
    diff: toMinutes(time) + 1440 - nowM,
    nextDay: true,
  }));

  return [...todayUpcoming, ...tomorrowUpcoming]
    .sort((a, b) => a.diff - b.diff)
    .slice(0, count);
}

function stationName(key) {
  return TIMETABLE[key]?.name ?? key;
}

function dayName(key) {
  if (key === "weekday") return t("weekday");
  if (key === "saturday") return t("saturday");
  return t("sunday");
}

function directionName(key) {
  return key === "north" ? t("north") : t("south");
}

function saveLastSetting() {
  const setting = {
    station: stationEl.value,
    direction: directionEl.value,
    dayType: dayTypeEl.value,
  };

  localStorage.setItem(LAST_SETTING_KEY, JSON.stringify(setting));
}

function loadLastSetting() {
  const raw = localStorage.getItem(LAST_SETTING_KEY);
  if (!raw) return false;

  try {
    const setting = JSON.parse(raw);

    if (setting.station) stationEl.value = setting.station;
    if (setting.direction) directionEl.value = setting.direction;
    if (setting.dayType) dayTypeEl.value = setting.dayType;

    return true;
  } catch {
    return false;
  }
}

function render() {
  const times = getTimes();
  const result = getUpcoming(times, 6);
  const first = result[0];

  nextTimeEl.textContent = first?.time ?? "--:--";
  countdownEl.textContent = first ? formatCountdown(first.diff) : t("noData");

  statusLineEl.textContent = first
    ? `${stationName(stationEl.value)}｜${directionName(directionEl.value)}｜${dayName(dayTypeEl.value)}${first.nextDay ? `｜${t("nextDay")}` : ""}`
    : t("notSet");

  trainListEl.innerHTML = result
    .slice(1, 6)
    .map((item) => {
      const nextDayLabel = item.nextDay ? `<small>${t("nextDay")}</small>` : "";

      return `
        <li>
          <span class="time">${item.time} ${nextDayLabel}</span>
          <span class="min">${formatCountdown(item.diff)}</span>
        </li>
      `;
    })
    .join("");

  saveLastSetting();
}

function setTheme(theme) {
  document.documentElement.classList.toggle("light", theme === "light");
  themeBtn.textContent = theme === "light" ? "☀️" : "🌙";
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const isLight = document.documentElement.classList.contains("light");
  setTheme(isLight ? "dark" : "light");
}

function applyCommute(station, direction) {
  stationEl.value = station;
  directionEl.value = direction;
  autoDayType();
  render();
}

function readFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) ?? [];
  } catch {
    return [];
  }
}

function writeFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function currentFavorite() {
  return {
    station: stationEl.value,
    direction: directionEl.value,
    dayType: dayTypeEl.value,
  };
}

function favoriteId(fav) {
  return `${fav.station}-${fav.direction}-${fav.dayType}`;
}

function addCurrentFavorite() {
  const favorites = readFavorites();
  const fav = currentFavorite();
  const id = favoriteId(fav);

  if (!favorites.some((item) => favoriteId(item) === id)) {
    favorites.push(fav);
    writeFavorites(favorites);
  }

  renderFavorites();
}

function removeFavorite(id) {
  const favorites = readFavorites().filter((fav) => favoriteId(fav) !== id);
  writeFavorites(favorites);
  renderFavorites();
}

function useFavorite(fav) {
  stationEl.value = fav.station;
  directionEl.value = fav.direction;
  dayTypeEl.value = fav.dayType;
  render();
}

function renderFavorites() {
  const favorites = readFavorites();

  if (favorites.length === 0) {
    favoriteListEl.innerHTML = `<p class="empty">${t("emptyFavorite")}</p>`;
    return;
  }

  favoriteListEl.innerHTML = favorites
    .map((fav) => {
      const id = favoriteId(fav);
      const label = `${stationName(fav.station)}｜${directionName(fav.direction)}｜${dayName(fav.dayType)}`;

      return `
        <div class="favorite-item">
          <button type="button" data-use-favorite="${id}">${label}</button>
          <button class="delete-btn" type="button" data-delete-favorite="${id}" aria-label="delete">×</button>
        </div>
      `;
    })
    .join("");

  favoriteListEl.querySelectorAll("[data-use-favorite]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fav = favorites.find((item) => favoriteId(item) === btn.dataset.useFavorite);
      if (fav) useFavorite(fav);
    });
  });

  favoriteListEl.querySelectorAll("[data-delete-favorite]").forEach((btn) => {
    btn.addEventListener("click", () => removeFavorite(btn.dataset.deleteFavorite));
  });
}

function bindEvents() {
  themeBtn.addEventListener("click", toggleTheme);

  nowBtn.addEventListener("click", () => {
    autoDayType();
    render();
  });

  goWorkBtn.addEventListener("click", () => applyCommute("kamata", "north"));
  goHomeBtn.addEventListener("click", () => applyCommute("oimachi", "south"));
  addFavoriteBtn.addEventListener("click", addCurrentFavorite);

  languageSelect.addEventListener("change", () => {
    applyLanguage(languageSelect.value);
  });

  [stationEl, directionEl, dayTypeEl].forEach((el) => {
    el.addEventListener("change", render);
  });
}

function init() {
  const savedTheme = localStorage.getItem(THEME_KEY) ?? "dark";
  setTheme(savedTheme);

  languageSelect.value = currentLang;
  renderStaticSelectOptions();

  const hasLastSetting = loadLastSetting();

  if (!hasLastSetting) {
    autoDayType();
  }

  bindEvents();
  applyLanguage(currentLang);
  renderFavorites();
  render();

  setInterval(render, 1000);
}

// Service Worker registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("./sw.js", {
        updateViaCache: "none"
      });

      await registration.update();
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  });
}

// Start the app once
init();
