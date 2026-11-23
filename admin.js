// Front-end demo only: these sample codes do NOT grant internet access.
const createBtn=document.getElementById('create');
const clearBtn=document.getElementById('clear');
const select=document.getElementById('package');
const rows=document.getElementById('rows');
const count=document.getElementById('count');
const notice=document.getElementById('notice');
let vouchers=[];
function makeCode(){const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<8;i++)s+=chars[Math.floor(Math.random()*chars.length)];return s.slice(0,4)+'-'+s.slice(4);}
function render(){count.textContent=String(vouchers.length);if(!vouchers.length){rows.innerHTML='<tr class="empty"><td colspan="4">No sample vouchers yet.</td></tr>';return;}rows.innerHTML=vouchers.map(v=>`<tr><td>${v.code}</td><td>₱${v.price}</td><td>${v.duration}</td><td><span class="status">DEMO ONLY</span></td></tr>`).join('');}
createBtn.addEventListener('click',()=>{const [price,duration]=select.value.split('|');vouchers.unshift({code:makeCode(),price,duration});render();notice.textContent='Sample voucher created. It is not valid for internet access and will disappear when this page is refreshed.';});
clearBtn.addEventListener('click',()=>{vouchers=[];render();notice.textContent='The sample voucher list has been cleared.';});
render();
