import { useState, useEffect } from "react";
import axios from "axios";
import './emp.css'

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ empId: "", name: "", designation: "" });
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchEmployees = () => {
    axios.get("http://localhost:4500/employee")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching:", err));
  };

  const addEmployee = (e) => {
    e.preventDefault();
    const newEmp = { ...form, empId: Number(form.empId) };
    axios.post("http://localhost:4500/employee", newEmp)
      .then(fetchEmployees)
      .then(() => setForm({ empId: "", name: "", designation: "" }));
  };

  const updateEmployee = (empId) => {
    axios.put(`http://localhost:4500/employee/${empId}`, form)
      .then(fetchEmployees)
      .then(() => {
        setForm({ empId: "", name: "", designation: "" });
        setEditId(null);
      });
  };

  const deleteEmployee = (empId) => {
    axios.delete(`http://localhost:4500/employee/${empId}`)
      .then(fetchEmployees);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <>
    <h1>Employee Management</h1>
        <form className="employee-form" onSubmit={editId ? () => updateEmployee(editId) : addEmployee}>
    <input
      type="number"
      name="empId"
      placeholder="Emp ID"
      value={form.empId}
      onChange={handleChange}
      required
      disabled={editId !== null}
      min="0"
    />
    <input
      type="text"
      name="name"
      placeholder="Name"
      value={form.name}
      onChange={handleChange}
      required
    />
    <input
      type="text"
      name="designation"
      placeholder="Designation"
      value={form.designation}
      onChange={handleChange}
      required
    />
    <button type="submit">{editId ? "Update" : "Add"} Employee</button>
  </form>

  <div className="table-container">
    <table className="employee-table">
      <thead>
        <tr>
          <th>EmpID</th>
          <th>Name</th>
          <th>Designation</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((emp) => (
          <tr key={emp.empId}>
            <td>{emp.empId}</td>
            <td>{emp.name}</td>
            <td>{emp.designation}</td>
            <td>
              <button className="edit-btn" onClick={() => { setForm(emp); setEditId(emp.empId); }}>Edit</button>
              <button className="delete-btn" onClick={() => deleteEmployee(emp.empId)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
    </>
  );
};

export default Employees;
