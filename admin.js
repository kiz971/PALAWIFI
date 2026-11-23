// DEMO ONLY: password is stored in this browser's localStorage.
// This is not secure authentication. A real multi-user login needs a backend.
const PASSWORD_KEY = "palawifiDemoAdminPassword";
const loginView = document.getElementById("loginView");
const dashboardView = document.getElementById("dashboardView");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const vouchers = [];
const voucherRows = document.getElementById("voucherRows");

function hasPassword() {
  return Boolean(localStorage.getItem(PASSWORD_KEY));
}
function showLogin() {
  dashboardView.classList.add("hidden");
  loginView.classList.remove("hidden");
  document.getElementById("loginForm").reset();
  const setup = !hasPassword();
  document.getElementById("loginTitle").textContent = setup ? "Set Admin Password" : "Admin Login";
  document.getElementById("loginIntro").textContent = setup
    ? "Create a password for this browser to set up the demo admin."
    : "Enter your admin password to continue.";
  document.getElementById("confirmWrap").classList.toggle("hidden", !setup);
  document.getElementById("loginButton").textContent = setup ? "Save Password" : "Login";
  document.getElementById("password").autocomplete = setup ? "new-password" : "current-password";
  loginError.textContent = "";
}
function showDashboard() {
  loginView.classList.add("hidden");
  dashboardView.classList.remove("hidden");
  document.getElementById("reportDate").textContent =
    new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  renderVouchers();
}
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const password = document.getElementById("password").value;
  if (!hasPassword()) {
    const confirm = document.getElementById("confirmPassword").value;
    if (password.length < 8) {
      loginError.textContent = "Use at least 8 characters for your password.";
      return;
    }
    if (password !== confirm) {
      loginError.textContent = "Passwords do not match.";
      return;
    }
    localStorage.setItem(PASSWORD_KEY, password);
    showDashboard();
    return;
  }
  if (password === localStorage.getItem(PASSWORD_KEY)) {
    showDashboard();
  } else {
    loginError.textContent = "Incorrect password.";
  }
});
document.getElementById("logoutBtn").addEventListener("click", showLogin);

document.getElementById("changePasswordForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const message = document.getElementById("changeMessage");
  const current = document.getElementById("currentPassword").value;
  const next = document.getElementById("newPassword").value;
  const confirm = document.getElementById("confirmNewPassword").value;
  message.classList.remove("error-text");
  if (current !== localStorage.getItem(PASSWORD_KEY)) {
    message.textContent = "Current password is incorrect.";
    message.classList.add("error-text");
    return;
  }
  if (next.length < 8) {
    message.textContent = "New password must be at least 8 characters.";
    message.classList.add("error-text");
    return;
  }
  if (next !== confirm) {
    message.textContent = "New passwords do not match.";
    message.classList.add("error-text");
    return;
  }
  localStorage.setItem(PASSWORD_KEY, next);
  document.getElementById("changePasswordForm").reset();
  message.textContent = "Demo password updated in this browser.";
});

function makeCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return "PALA-" + code;
}
function peso(value) { return "₱" + value.toLocaleString("en-PH"); }
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
  vouchers.slice().reverse().forEach(v => {
    const tr = document.createElement("tr");
    const code = document.createElement("td");
    const pack = document.createElement("td");
    const statusCell = document.createElement("td");
    const actionCell = document.createElement("td");
    code.textContent = v.code;
    pack.textContent = v.label;
    const badge = document.createElement("span");
    badge.className = v.used ? "status used" : "status";
    badge.textContent = v.used ? "Used" : "Unused";
    statusCell.appendChild(badge);
    const action = document.createElement("button");
    action.className = "use-button";
    action.textContent = v.used ? "Used" : "Mark used";
    action.disabled = v.used;
    action.addEventListener("click", () => { v.used = true; renderVouchers(); });
    actionCell.appendChild(action);
    tr.append(code, pack, statusCell, actionCell);
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
showLogin();
