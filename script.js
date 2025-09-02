
/************* НАСТРОЙКИ *************/
const ALLOWED = [
  { login: "admin", pass: "Polkopejkin05!" },
  { login: "vip",   pass: "7777" },
  { login: "guest101", pass: "x4P9tL" },
  { login: "guest102", pass: "s8K2rM" },
  { login: "guest103", pass: "q3B7fV" },
  { login: "guest104", pass: "a6M9zQ" },
  { login: "guest105", pass: "h2T5pW" },
  { login: "guest106", pass: "j7U4mE" },
  { login: "guest107", pass: "v9X1sA" },
  { login: "guest108", pass: "p4N8cY" },
  { login: "guest109", pass: "t3L6kH" },
  { login: "guest110", pass: "m8Z5gR" },
  { login: "guest111", pass: "y1D7qL" },
  { login: "guest112", pass: "n2H9wB" },
  { login: "guest113", pass: "u6S4vJ" },
  { login: "guest114", pass: "k5P8xF" },
  { login: "guest116", pass: "e4Q9tM" },
  { login: "guest116", pass: "r7B3yZ" },
  { login: "guest117", pass: "o9C2gV" },
  { login: "guest118", pass: "z6M8pT" },
  { login: "guest119", pass: "l1K7jC" },
  { login: "guest120", pass: "f3W5nH" }
];
const BLOCKED       = ["baduser"];     // Кого не пускать
const AUTH_VERSION  = "1";             // Сменишь на "2" — всех разлогинит
const AUTH_TTL_MS   = 10 * 60 * 1000;  // 10 minutes
const SESSION_KEY   = "cr2_auth";
/*************************************/

function setAuthed(v, user){
  try {
    if (v) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        u: user, t: Date.now(), v: AUTH_VERSION
      }));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch(e){}
}
function readSession(){
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch(e){ return null; }
}
function isAuthedFresh(){
  const s = readSession();
  if (!s) return false;
  if (BLOCKED.includes(s.u)) return false;
  if (s.v !== AUTH_VERSION) return false;
  if (Date.now() - s.t > AUTH_TTL_MS) return false;
  return true;
}

function showGate(){ document.getElementById("gate").classList.remove("hidden"); document.getElementById("app").classList.add("hidden"); }
function showApp(){  document.getElementById("gate").classList.add("hidden");    document.getElementById("app").classList.remove("hidden"); }

window.addEventListener("DOMContentLoaded", () => {
  // Показ в зависимости от сессии
  if (isAuthedFresh()) showApp(); else showGate();

  // ====== GATE (EN) ======
  const form       = document.getElementById("gate-form"); // важно: gate-form
  const loginInput = document.getElementById("login");
  const passInput  = document.getElementById("password");
  const errBox     = document.getElementById("gate-error");
  const getDataBtn = document.getElementById("get-data");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const login = (loginInput.value || "").trim();
      const pass  = (passInput.value  || "");
      const ok = ALLOWED.some(u => u.login === login && u.pass === pass);

      if (!ok) {
        errBox.hidden = false;
        setTimeout(() => errBox.hidden = true, 2000);
        return;
      }
      if (BLOCKED.includes(login)) {
        errBox.textContent = "Access denied";
        errBox.hidden = false;
        setTimeout(() => { errBox.hidden = true; errBox.textContent = "Invalid login or password"; }, 2000);
        return;
      }
      // ВАЖНО: сразу пускаем, не делаем повторную проверку до следующего старта
      setAuthed(true, login);
      showApp();
    });
  }

  // Кнопка "Получить данные" — просто ссылка (поведенчески не обязателен JS), оставим про запас
  if (getDataBtn) {
    getDataBtn.addEventListener("click", (e) => {
      // Даём перейти по ссылке; JS не обязателен
      // window.location.href = "https://t.me/Mr_He1p";
    });
  }

  // ====== ИГРА ======
  const modes = {
    easy:[1.01,1.03,1.06,1.10,1.15,1.19,1.24,1.30,1.35,1.42,1.48,1.56,1.65,1.75,1.85,1.98,2.12,2.28,2.47,2.70,2.96,3.28,3.70,4.11,4.64,5.39,6.50,8.36,12.08,23.24],
    medium:[1.08,1.21,1.37,1.56,1.78,2.05,2.37,2.77,3.24,3.85,4.62,5.61,6.91,8.64,10.99,14.29,18.96,26.07,37.24,53.82,82.36,137.59,265.35,638.82,2457.00],
    hard:[1.18,1.46,1.83,2.31,2.95,3.82,5.02,6.66,9.04,12.52,17.74,25.80,38.71,60.21,97.34,166.87,305.94,595.86,1283.03,3267.64,10898.54,62162.09],
    hardcore:[1.44,2.21,3.45,5.53,9.09,15.30,26.78,48.70,92.54,185.08,391.25,894.28,2235.72,6096.15,18960.33,72432.75,379632.82,3608855.25]
  };

  let currentMode = 'easy';
  document.querySelectorAll('.mode').forEach(b=>{
    b.addEventListener('click', ()=>{
      document.querySelectorAll('.mode').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      currentMode = b.dataset.mode;
    });
  });

  const chicken = document.getElementById('chicken');
  const btnJump = document.getElementById('btn-jump');
  const modal   = document.getElementById('modal');
  const xVal    = document.getElementById('xval');
  const btnNext = document.getElementById('btn-next');

  btnJump?.addEventListener('click', ()=>{
    chicken.style.transform = 'translate(-50%,-44px)';
    setTimeout(()=>{
      chicken.style.transform = 'translate(-50%,0)';
      const arr = modes[currentMode] || modes.easy;
      const x = arr[Math.floor(Math.random()*arr.length)];
      xVal.textContent = x;
      modal.classList.remove('hidden');
    }, 600);
  });
  btnNext?.addEventListener('click', ()=> modal.classList.add('hidden'));
});
