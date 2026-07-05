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

const FAVORITES_KEY = "keihin-next-train:favorites";
const THEME_KEY = "keihin-next-train:theme";
const LAST_SETTING_KEY = "keihin-next-train:last-setting";

function toMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(mins) {
  mins = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function addOffset(times, offset) {
  return times.map((t) => fromMinutes(toMinutes(t) + offset)).sort();
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
  const text = day === "weekday" ? "平日" : day === "saturday" ? "星期六" : "星期日/休日";
  autoDayNoteEl.textContent = `已自動判斷今日係：${text}`;
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
    return `あと ${hours} 時間 ${minutes} 分`;
  }
  return `あと ${minutes} 分 ${String(seconds).padStart(2, "0")} 秒`;
}

function getUpcoming(times, count = 6) {
  const nowM = getNowTotalMinutes();
  const todayUpcoming = times
    .map((t) => ({ t, diff: toMinutes(t) - nowM, nextDay: false }))
    .filter((x) => x.diff >= 0);

  const tomorrowUpcoming = times.map((t) => ({
    t,
    diff: toMinutes(t) + 1440 - nowM,
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
  return key === "weekday" ? "平日" : key === "saturday" ? "星期六" : "星期日/休日";
}

function directionName(key) {
  return key === "north" ? "北行" : "南行";
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

  nextTimeEl.textContent = first?.t ?? "--:--";
  countdownEl.textContent = first ? formatCountdown(first.diff) : "時刻データなし";

  statusLineEl.textContent = first
    ? `${stationName(stationEl.value)}｜${directionName(directionEl.value)}｜${dayName(dayTypeEl.value)}${first.nextDay ? "｜翌日" : ""}`
    : "資料未設定";

  trainListEl.innerHTML = result
    .slice(1, 6)
    .map((x) => `
      <li>
        <span class="time">${x.t}${x.nextDay ? " <small>翌日</small>" : ""}</span>
        <span class="min">${formatCountdown(x.diff)}</span>
      </li>
    `)
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

  if (!favorites.some((x) => favoriteId(x) === id)) {
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
    favoriteListEl.innerHTML = `<p class="empty">未有收藏。你可以先收藏「蒲田→大井町」或者「大井町→蒲田」。</p>`;
    return;
  }

  favoriteListEl.innerHTML = favorites
    .map((fav) => {
      const id = favoriteId(fav);
      const label = `${stationName(fav.station)}｜${directionName(fav.direction)}｜${dayName(fav.dayType)}`;
      return `
        <div class="favorite-item">
          <button type="button" data-use-favorite="${id}">${label}</button>
          <button class="delete-btn" type="button" data-delete-favorite="${id}" aria-label="刪除收藏">×</button>
        </div>
      `;
    })
    .join("");

  favoriteListEl.querySelectorAll("[data-use-favorite]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fav = favorites.find((x) => favoriteId(x) === btn.dataset.useFavorite);
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

  [stationEl, directionEl, dayTypeEl].forEach((el) => {
    el.addEventListener("change", render);
  });
}

function init() {
  const savedTheme = localStorage.getItem(THEME_KEY) ?? "dark";
  setTheme(savedTheme);

  const hasLastSetting = loadLastSetting();
  if (!hasLastSetting) autoDayType();

  bindEvents();
  renderFavorites();
  render();
  setInterval(render, 1000);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

init();
