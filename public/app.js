const form = document.getElementById("studentForm");
const tbody = document.getElementById("studentTableBody");

let editingId = null;

async function loadStudents() {
    const res = await fetch("/students");
    const students = await res.json();

     if (!res.ok) {
    console.error("Student load error:", data);
    tbody.innerHTML = `<tr><td colspan="4">Error loading students</td></tr>`;
    return;
  }
  
    renderStudents(students);
}

function renderStudents(students){
    tbody.innerHTML= "";

    students.forEach((student) => {
        const row = document.createElement("tr");
        row.innerHTMl = `
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.course}</td>
            <td>${student.course}</td>
            <td>
                <button onClick = "editStudent('${student.id}')">Edit</button>
                <button onClick = "deleteStudent('${student.id}')">Delete</button>
            </td>
            `;
            tbody.appendChild(row);
    });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const student = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        course: document.getElementById("course").value
    };

    if (editingId) {
        await fetch(`/students/${editingId}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(student)
        });
        editingId = null;
    }else {
        await fetch("/students",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(student)
        })
    }

    form.reset();
    loadStudents();
});

window.editStudent = async function(id) {
    const res = await fetch(`/students/${id}`);
    const student = await res.json();
    document.getElementById("name").value = student.name;
    document.getElementById("email").vaule = student.email;
    document.getElementById("course").value = student.course;
    editingId = id;
};

window.deleteStudent = async function(id) {
    await fetch(`/students/${id}`, {method: "DELETE"});
    loadStudents();
}

loadStudents();