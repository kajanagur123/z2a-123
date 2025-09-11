const base = 'http://localhost:5000';
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const roll = document.getElementById('roll').value;
    const dob = document.getElementById('dob').value;
    try {
      const res = await fetch(`${base}/api/students/${encodeURIComponent(roll)}/${encodeURIComponent(dob)}`);
      if (!res.ok) throw new Error('Not found');
      const student = await res.json();
      showResult(student);
    } catch (err) {
      alert('Student not found');
    }
  });

  document.getElementById('downloadPdf').addEventListener('click', () => {
    const name = document.getElementById('studentName').innerText;
    const details = document.getElementById('details').innerText;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Result Card', 20, 20);
    doc.setFontSize(12);
    doc.text(name, 20, 30);
    doc.text(details, 20, 40);
    doc.save('result.pdf');
  });
});

function showResult(student) {
  document.getElementById('result').classList.remove('hidden');
  document.getElementById('studentName').innerText = `${student.name} (Roll: ${student.roll})`;
  let html = `
    <p>DOB: ${student.dob}</p>
    <p>Total: ${student.total}</p>
    <p>Percentage: ${student.percentage}%</p>
    <p>Grade: ${student.grade}</p>
    <p>Overall Pass: ${student.overall_pass ? 'Pass' : 'Fail'}</p>
    <h3 class="mt-2 font-semibold">Subjects</h3>
    <ul>
  `;
  for (const s of student.subjects) {
    html += `<li>${s.name} - ${s.marks} (${s.pass ? 'Pass' : 'Fail'})</li>`;
  }
  html += '</ul>';
  document.getElementById('details').innerHTML = html;
}
