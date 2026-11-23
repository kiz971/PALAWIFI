// PALAWIFI front-end demo.
// Real voucher validation and time control require a compatible captive-portal
// gateway/backend. This page intentionally does not grant internet access.
const form = document.getElementById('voucher-form');
const input = document.getElementById('voucher-code');
const message = document.getElementById('form-message');

document.getElementById('year').textContent = new Date().getFullYear();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const code = input.value.trim();

  if (!code) {
    message.textContent = 'Please enter your voucher code.';
    input.focus();
    return;
  }

  message.textContent = 'Demo page only: voucher checking is not connected yet. Your code has not been used.';
});
