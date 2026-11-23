// DEMO ONLY: credentials are visible in this public front-end file.
// Do not use real or reused passwords here. Real authentication needs a secure backend.
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
function renderVouchers() {
  document.getElementById("totalCount").textContent = vouchers.length;
  document.getElementById("availableCount").textContent = vouchers.length;
  if (!vouchers.length) {
    voucherRows.innerHTML = '<tr><td colspan="2" class="empty">No sample vouchers yet.</td></tr>';
    return;
  }
  voucherRows.innerHTML = "";
  vouchers.slice().reverse().forEach((voucher) => {
    const tr = document.createElement("tr");
    const codeCell = document.createElement("td");
    const packageCell = document.createElement("td");
    codeCell.textContent = voucher.code;
    packageCell.textContent = voucher.package;
    tr.append(codeCell, packageCell);
    voucherRows.appendChild(tr);
  });
}
document.getElementById("generateBtn").addEventListener("click", () => {
  const voucher = {
    code: makeCode(),
    package: document.getElementById("packageSelect").value
  };
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
