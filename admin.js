// DEMO ONLY: credentials are visible in this public front-end file.
// Real account protection and voucher records require a secure backend.
const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "palawifi123";

const loginView = document.getElementById("loginView");
const dashboardView = document.getElementById("dashboardView");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const voucherRows = document.getElementById("voucherRows");
const vouchers = [];

function showDashboard() {
  loginView.classList.add("hidden");
  dashboardView.classList.remove("hidden");
  document.getElementById("reportDate").textContent =
    new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  renderVouchers();
}
function showLogin() {
  dashboardView.classList.add("hidden");
  loginView.classList.remove("hidden");
  sessionStorage.removeItem("palawifiDemoLogin");
}
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
    sessionStorage.setItem("palawifiDemoLogin", "yes");
    loginError.textContent = "";
    showDashboard();
  } else {
    loginError.textContent = "Incorrect demo username or password.";
  }
});
document.getElementById("logoutBtn").addEventListener("click", showLogin);

function makeCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return "PALA-" + code;
}
function peso(value) {
  return "₱" + value.toLocaleString("en-PH");
}
function renderVouchers() {
  const used = vouchers.filter(v => v.used).length;
  const unused = vouchers.length - used;
  const totalSales = vouchers.reduce((sum, v) => sum + v.price, 0);
  const today = new Date().toDateString();
  const todays = vouchers.filter(v => v.created.toDateString() === today);
  const todaysSales = todays.reduce((sum, v) => sum + v.price, 0);

  document.getElementById("totalSales").textContent = peso(totalSales);
  document.getElementById("totalCount").textContent = vouchers.length;
  document.getElementById("unusedCount").textContent = unused;
  document.getElementById("usedCount").textContent = used;
  document.getElementById("todayCount").textContent = todays.length;
  document.getElementById("todaySales").textContent = peso(todaysSales);

  if (!vouchers.length) {
    voucherRows.innerHTML = '<tr><td colspan="4" class="empty">No sample vouchers yet.</td></tr>';
    return;
  }
  voucherRows.innerHTML = "";
  vouchers.slice().reverse().forEach((voucher) => {
    const tr = document.createElement("tr");
    const codeCell = document.createElement("td");
    const packageCell = document.createElement("td");
    const statusCell = document.createElement("td");
    const actionCell = document.createElement("td");
    codeCell.textContent = voucher.code;
    packageCell.textContent = voucher.label;
    const status = document.createElement("span");
    status.className = voucher.used ? "status used" : "status";
    status.textContent = voucher.used ? "Used" : "Unused";
    statusCell.appendChild(status);
    const action = document.createElement("button");
    action.className = "use-button";
    action.textContent = voucher.used ? "Used" : "Mark used";
    action.disabled = voucher.used;
    action.addEventListener("click", () => {
      voucher.used = true;
      renderVouchers();
    });
    actionCell.appendChild(action);
    tr.append(codeCell, packageCell, statusCell, actionCell);
    voucherRows.appendChild(tr);
  });
}
document.getElementById("generateBtn").addEventListener("click", () => {
  const select = document.getElementById("packageSelect");
  const price = Number(select.value);
  const label = select.options[select.selectedIndex].textContent;
  const voucher = { code: makeCode(), price, label, used: false, created: new Date() };
  vouchers.push(voucher);
  document.getElementById("generatedCode").textContent = voucher.code;
  renderVouchers();
});
document.getElementById("clearBtn").addEventListener("click", () => {
  vouchers.length = 0;
  document.getElementById("generatedCode").textContent = "Your sample code will appear here.";
  renderVouchers();
});

if (sessionStorage.getItem("palawifiDemoLogin") === "yes") showDashboard();
