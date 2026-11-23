// PALAWIFI V6 DEMO ONLY. GitHub Pages is public; localStorage login is not secure authentication.
const USERNAME_KEY = "palawifiDemoAdminUsernameV4";
const PASSWORD_KEY = "palawifiDemoAdminPasswordV4";
const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "palawifi123";
const DESIGN_KEY = "palawifiVoucherDesignV6";
const DEFAULT_RATES = [
  { price: "1", duration: "10 Minutes" },
  { price: "5", duration: "1 Hour" },
  { price: "10", duration: "3 Hours" }
];

const $ = (id) => document.getElementById(id);
const loginView = $("loginView");
const dashboardView = $("dashboardView");
const loginForm = $("loginForm");
const loginError = $("loginError");
const vouchers = [];
const voucherRows = $("voucherRows");
let latestVoucher = null;
let rates = loadDesign().rates;

function loadDesign() {
  try {
    const saved = JSON.parse(localStorage.getItem(DESIGN_KEY) || "null");
    return {
      message: typeof saved?.message === "string" ? saved.message : "THANK YOU FOR CONNECTING TO PALAWIFI!",
      rates: Array.isArray(saved?.rates) && saved.rates.length ? saved.rates : DEFAULT_RATES
    };
  } catch (_) {
    return { message: "THANK YOU FOR CONNECTING TO PALAWIFI!", rates: DEFAULT_RATES };
  }
}

if (!localStorage.getItem(USERNAME_KEY)) localStorage.setItem(USERNAME_KEY, DEFAULT_USERNAME);
if (!localStorage.getItem(PASSWORD_KEY)) localStorage.setItem(PASSWORD_KEY, DEFAULT_PASSWORD);

function showLogin() {
  dashboardView.classList.add("hidden");
  loginView.classList.remove("hidden");
  loginForm.reset();
  loginError.textContent = "";
}
function showDashboard() {
  loginView.classList.add("hidden");
  dashboardView.classList.remove("hidden");
  $("reportDate").textContent = new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  $("welcomeUser").textContent = localStorage.getItem(USERNAME_KEY) || DEFAULT_USERNAME;
  renderRateEditor();
  renderPackageOptions();
  renderVouchers();
}
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = $("username").value.trim();
  const password = $("password").value;
  if (username === localStorage.getItem(USERNAME_KEY) && password === localStorage.getItem(PASSWORD_KEY)) showDashboard();
  else loginError.textContent = "Incorrect username or password.";
});
$("logoutBtn").addEventListener("click", showLogin);

$("accountSettingsForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const message = $("changeMessage");
  const current = $("currentPassword").value;
  const username = $("newUsername").value.trim();
  const next = $("newPassword").value;
  const confirm = $("confirmNewPassword").value;
  message.classList.remove("error-text");
  if (current !== localStorage.getItem(PASSWORD_KEY)) {
    message.textContent = "Current password is incorrect."; message.classList.add("error-text"); return;
  }
  if (!username) {
    message.textContent = "Username cannot be empty."; message.classList.add("error-text"); return;
  }
  if (next.length < 8) {
    message.textContent = "New password must be at least 8 characters."; message.classList.add("error-text"); return;
  }
  if (next !== confirm) {
    message.textContent = "New passwords do not match."; message.classList.add("error-text"); return;
  }
  localStorage.setItem(USERNAME_KEY, username);
  localStorage.setItem(PASSWORD_KEY, next);
  $("accountSettingsForm").reset();
  $("welcomeUser").textContent = username;
  message.textContent = "Username and password updated in this browser.";
});

function makeCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return "PALA-" + code;
}
function peso(value) { return "₱" + Number(value).toLocaleString("en-PH"); }
function getRateRows() {
  return [...$("rateEditor").querySelectorAll(".rate-row")].map(row => ({
    price: row.querySelector(".rate-price").value.trim(),
    duration: row.querySelector(".rate-duration").value.trim()
  })).filter(rate => rate.price !== "" && rate.duration !== "");
}
function renderRateEditor() {
  const editor = $("rateEditor");
  editor.innerHTML = "";
  rates.forEach((rate, index) => {
    const row = document.createElement("div");
    row.className = "rate-row";
    const price = document.createElement("input");
    price.className = "rate-price"; price.type = "number"; price.min = "1"; price.step = "1";
    price.value = rate.price; price.setAttribute("aria-label", "Rate price in pesos"); price.placeholder = "₱ Price";
    const duration = document.createElement("input");
    duration.className = "rate-duration"; duration.type = "text"; duration.maxLength = 35;
    duration.value = rate.duration; duration.setAttribute("aria-label", "Internet time duration"); duration.placeholder = "e.g. 30 Minutes";
    const remove = document.createElement("button");
    remove.className = "remove-rate"; remove.type = "button"; remove.textContent = "×"; remove.title = "Remove rate";
    remove.disabled = rates.length <= 1;
    remove.addEventListener("click", () => {
      rates.splice(index, 1); renderRateEditor(); renderPackageOptions();
    });
    row.append(price, duration, remove);
    editor.appendChild(row);
  });
}
function renderPackageOptions() {
  const select = $("packageSelect");
  const previous = select.value;
  select.innerHTML = "";
  getRateRows().forEach(rate => {
    const option = document.createElement("option");
    option.value = String(Number(rate.price));
    option.textContent = `${peso(rate.price)} — ${rate.duration}`;
    option.dataset.duration = rate.duration;
    select.appendChild(option);
  });
  if (previous && [...select.options].some(o => o.value === previous)) select.value = previous;
  if (!select.options.length) {
    const option = document.createElement("option"); option.value = "0"; option.textContent = "Save at least one valid rate first"; select.appendChild(option);
  }
}
$("addRateBtn").addEventListener("click", () => {
  if (rates.length >= 6) { $("rateMessage").textContent = "Maximum of 6 rates reached."; return; }
  rates = getRateRows(); rates.push({ price: "", duration: "" }); renderRateEditor();
});
$("saveVoucherDesignBtn").addEventListener("click", () => {
  const message = $("rateMessage");
  const nextRates = getRateRows();
  if (!nextRates.length) { message.textContent = "Add at least one valid price and time rate."; message.classList.add("error-text"); return; }
  if (nextRates.some(r => !Number.isFinite(Number(r.price)) || Number(r.price) <= 0)) {
    message.textContent = "Each price must be a number greater than zero."; message.classList.add("error-text"); return;
  }
  rates = nextRates;
  localStorage.setItem(DESIGN_KEY, JSON.stringify({ message: $("voucherTopText").value.trim(), rates }));
  renderRateEditor(); renderPackageOptions();
  message.classList.remove("error-text"); message.textContent = "Voucher text and time rates saved in this browser.";
});

function renderVouchers() {
  const used = vouchers.filter(v => v.used).length;
  const totalSales = vouchers.reduce((sum, v) => sum + v.price, 0);
  const today = new Date().toDateString();
  const todays = vouchers.filter(v => v.created.toDateString() === today);
  $("totalSales").textContent = peso(totalSales);
  $("totalCount").textContent = vouchers.length;
  $("unusedCount").textContent = vouchers.length - used;
  $("usedCount").textContent = used;
  $("todayCount").textContent = todays.length;
  $("todaySales").textContent = peso(todays.reduce((sum, v) => sum + v.price, 0));
  if (!vouchers.length) {
    voucherRows.innerHTML = '<tr><td colspan="4" class="empty">No sample vouchers yet.</td></tr>'; return;
  }
  voucherRows.innerHTML = "";
  vouchers.slice().reverse().forEach(v => {
    const tr = document.createElement("tr");
    const code = document.createElement("td"); code.textContent = v.code;
    const pack = document.createElement("td"); pack.textContent = v.label;
    const statusCell = document.createElement("td");
    const badge = document.createElement("span"); badge.className = v.used ? "status used" : "status"; badge.textContent = v.used ? "Used" : "Unused"; statusCell.appendChild(badge);
    const actionCell = document.createElement("td");
    const action = document.createElement("button"); action.className = "use-button"; action.textContent = v.used ? "Used" : "Mark used"; action.disabled = v.used;
    action.addEventListener("click", () => { v.used = true; renderVouchers(); }); actionCell.appendChild(action);
    tr.append(code, pack, statusCell, actionCell); voucherRows.appendChild(tr);
  });
}
function renderTicket(voucher) {
  $("voucherPreview").classList.remove("hidden");
  $("ticketMessage").textContent = $("voucherTopText").value.trim() || "THANK YOU FOR CONNECTING TO PALAWIFI!";
  $("ticketCode").textContent = voucher.code;
  $("generatedCode").textContent = voucher.code;
  const rateBox = $("ticketRates"); rateBox.innerHTML = "";
  getRateRows().forEach(rate => {
    const line = document.createElement("div"); line.textContent = `${peso(rate.price)}  •  ${rate.duration}`; rateBox.appendChild(line);
  });
  const qr = $("ticketQr"); qr.innerHTML = "";
  if (window.QRCode) {
    new QRCode(qr, { text: voucher.code, width: 104, height: 104, colorDark: "#102b52", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
  } else {
    qr.textContent = "QR library unavailable";
  }
  $("printVoucherBtn").disabled = false;
  $("copyVoucherBtn").disabled = false;
}
$("generateBtn").addEventListener("click", () => {
  const select = $("packageSelect");
  if (!select.value || Number(select.value) <= 0) { $("rateMessage").textContent = "Save a valid time rate before generating a voucher."; return; }
  const price = Number(select.value);
  const selected = select.options[select.selectedIndex];
  const label = selected.textContent;
  latestVoucher = { code: makeCode(), price, label, used: false, created: new Date() };
  vouchers.push(latestVoucher);
  renderTicket(latestVoucher);
  renderVouchers();
});
$("printVoucherBtn").addEventListener("click", () => window.print());
$("copyVoucherBtn").addEventListener("click", async () => {
  if (!latestVoucher) return;
  try { await navigator.clipboard.writeText(latestVoucher.code); $("copyVoucherBtn").textContent = "Copied!"; }
  catch (_) { $("copyVoucherBtn").textContent = "Copy unavailable"; }
});
$("clearBtn").addEventListener("click", () => {
  vouchers.length = 0; latestVoucher = null;
  $("generatedCode").textContent = "Your sample code will appear here.";
  $("voucherPreview").classList.add("hidden");
  $("printVoucherBtn").disabled = true; $("copyVoucherBtn").disabled = true;
  renderVouchers();
});

// Load saved local voucher design into the editor.
const savedDesign = loadDesign();
$("voucherTopText").value = savedDesign.message;
rates = savedDesign.rates.map(r => ({ price: String(r.price), duration: String(r.duration) }));
showLogin();
