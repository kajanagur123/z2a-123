// Admin login and simple dashboard (single page for brevity)
const base = 'http://localhost:5000';
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('adminLogin');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
      const res = await fetch(base + '/api/admin/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
      });
      if (!res.ok) throw new Error('Invalid');
      // on success, load dashboard
      document.body.innerHTML = '';
      loadDashboard();
    } catch (err) {
      alert('Login failed');
    }
  });
});

function loadDashboard() {
  document.body.innerHTML = `
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Admin Dashboard</h1>
    <div id="formArea" class="bg-white p-4 rounded shadow mb-6"></div>
    <div id="listArea" class="bg-white p-4 rounded shadow"></div>
  </div>
  `;
  renderForm();
  loadStudents();
}

function renderForm() {
  const formArea = document.getElementById('formArea');
  formArea.innerHTML = `
    <h2 class="font-semibold mb-2">Add Student</h2>
    <div class="space-y-2">
      <input id="s_name" placeholder="Name" class="w-full border p-2"/>
      <input id="s_roll" placeholder="Roll No" class="w-full border p-2"/>
      <input id="s_dob" placeholder="DOB (YYYY-MM-DD)" class="w-full border p-2"/>
      <div id="subjects"></div>
      <div class="mt-2">
        <button id="addSub" class="bg-gray-200 px-2 py-1 rounded">Add Subject Row</button>
      </div>
      <div class="mt-2">
        <button id="saveStudent" class="bg-blue-600 text-white px-4 py-2 rounded">Save Student</button>
      </div>
      <div id="summary" class="mt-2"></div>
    </div>
  `;
  document.getElementById('addSub').addEventListener('click', addSubjectRow);
  document.getElementById('saveStudent').addEventListener('click', saveStudent);
  addSubjectRow(); // start with one
}

function addSubjectRow() {
  const subjects = document.getElementById('subjects');
  if (subjects.children.length >= 10) return alert('Max 10 subjects');
  const idx = subjects.children.length;
  const div = document.createElement('div');
  div.className = 'flex space-x-2 my-1';
  div.innerHTML = `
    <input placeholder="Subject" class="border p-1 subj-name"/>
    <input placeholder="Marks" type="number" class="border p-1 subj-marks" min="0" max="100"/>
    <label class="flex items-center"><input type="checkbox" class="subj-pass" checked/> Pass</label>
  `;
  subjects.appendChild(div);
  // attach change listeners to recalc
  div.querySelector('.subj-marks').addEventListener('input', updateSummary);
  div.querySelector('.subj-pass').addEventListener('change', updateSummary);
  updateSummary();
}

function updateSummary() {
  const names = Array.from(document.querySelectorAll('.subj-name')).map(i=>i.value||'');
  const marks = Array.from(document.querySelectorAll('.subj-marks')).map(i=>Number(i.value||0));
  const passes = Array.from(document.querySelectorAll('.subj-pass')).map(i=>i.checked);
  const total = marks.reduce((a,b)=>a+b,0);
  const percentage = marks.length ? (total / (marks.length*100))*100 : 0;
  const grade = percentage>=75?'A':percentage>=60?'B':percentage>=50?'C':percentage>=40?'D':'F';
  document.getElementById('summary').innerText = `Total: ${total} | Percent: ${percentage.toFixed(2)} | Grade: ${grade}`;
}

async function saveStudent() {
  const name = document.getElementById('s_name').value;
  const roll = document.getElementById('s_roll').value;
  const dob = document.getElementById('s_dob').value;
  const names = Array.from(document.querySelectorAll('.subj-name')).map(i=>i.value);
  const marks = Array.from(document.querySelectorAll('.subj-marks')).map(i=>i.value);
  const passes = Array.from(document.querySelectorAll('.subj-pass')).map(i=>i.checked);
  const subjects = names.map((n,i)=>({name:n, marks: marks[i]||0, pass: passes[i]}));
  // basic validation
  if (!name || !roll || !dob) return alert('Fill student fields');
  try {
    const res = await fetch(base + '/api/students', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({name, roll, dob, subjects})
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error');
    alert('Saved');
    loadStudents();
  } catch (err) {
    alert('Save failed: ' + err.message);
  }
}

async function loadStudents() {
  const listArea = document.getElementById('listArea');
  listArea.innerHTML = '<h2 class="font-semibold mb-2">Students</h2><div id="tbl"></div>';
  try {
    const res = await fetch(base + '/api/students');
    const students = await res.json();
    const tbl = document.getElementById('tbl');
    tbl.innerHTML = '<table class="min-w-full"><thead><tr><th>Roll</th><th>Name</th><th>Total</th><th>Grade</th><th>Pass</th></tr></thead><tbody>' +
      students.map(s=>`<tr><td>${s.roll}</td><td>${s.name}</td><td>${s.total}</td><td>${s.grade}</td><td>${s.overall_pass? 'Pass':'Fail'}</td></tr>`).join('') +
      '</tbody></table>';
  } catch (err) {
    document.getElementById('listArea').innerText = 'Failed to fetch students';
  }
}
