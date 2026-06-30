const stationEl = document.querySelector("#station");
const directionEl = document.querySelector("#direction");
const dayTypeEl = document.querySelector("#dayType");
const nextTimeEl = document.querySelector("#nextTime");
const countdownEl = document.querySelector("#countdown");
const trainListEl = document.querySelector("#trainList");
const themeBtn = document.querySelector("#themeBtn");
const nowBtn = document.querySelector("#nowBtn");

function toMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(mins) {
  mins = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
}

function addOffset(times, offset) {
  return times.map(t => fromMinutes(toMinutes(t) + offset));
}

function getTimes() {
  const stationKey = stationEl.value;
  const day = dayTypeEl.value;
  const dir = directionEl.value;
  const station = TIMETABLE[stationKey];

  if (station.copyFrom) {
    const base = TIMETABLE[station.copyFrom][day][dir];
    const offset = dir === "north" ? station.offsetNorth : station.offsetSouth;
    return addOffset(base, offset).sort();
  }
  return station[day][dir];
}

function getNowMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function render() {
  const nowM = getNowMinutes();
  const times = getTimes();
  const upcoming = times
    .map(t => ({ t, diff: toMinutes(t) - nowM }))
    .filter(x => x.diff >= 0)
    .slice(0, 6);

  const result = upcoming.length ? upcoming : times.slice(0, 6).map(t => ({ t, diff: toMinutes(t) + 1440 - nowM }));

  nextTimeEl.textContent = result[0]?.t ?? "--:--";
  countdownEl.textContent = result[0] ? `あと ${result[0].diff} 分` : "時刻データなし";

  trainListEl.innerHTML = result.slice(1, 6).map(x => `
    <li>
      <span class="time">${x.t}</span>
      <span class="min">あと ${x.diff} 分</span>
    </li>
  `).join("");
}

function autoDayType() {
  const d = new Date().getDay();
  dayTypeEl.value = d === 0 ? "sunday" : d === 6 ? "saturday" : "weekday";
}

themeBtn.addEventListener("click", () => {
  document.documentElement.classList.toggle("light");
  themeBtn.textContent = document.documentElement.classList.contains("light") ? "☀️" : "🌙";
  localStorage.setItem("theme", document.documentElement.classList.contains("light") ? "light" : "dark");
});

[stationEl, directionEl, dayTypeEl].forEach(el => el.addEventListener("change", render));
nowBtn.addEventListener("click", () => { autoDayType(); render(); });

if (localStorage.getItem("theme") === "light") {
  document.documentElement.classList.add("light");
  themeBtn.textContent = "☀️";
}

autoDayType();
render();
setInterval(render, 30000);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
