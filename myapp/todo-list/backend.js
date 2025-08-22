// backend.js
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let employees = [
  { empId: 1234, name: "John", designation: "SE" },
  { empId: 4567, name: "Jack", designation: "SSE" },
  { empId: 8910, name: "Harry", designation: "TA" },
];

// GET all employees
app.get("/employee", (req, res) => {
  res.json(employees);
});

// ADD employee
app.post("/employee", (req, res) => {
  const { empId, name, designation } = req.body;
  if (!empId || !name || !designation) {
    return res.status(400).json({ error: "All fields are required" });
  }
  employees.push({ empId, name, designation });
  res.status(201).json({ message: "Employee added successfully" });
});

// UPDATE employee
app.put("/employee/:empId", (req, res) => {
  const empId = parseInt(req.params.empId);
  const { name, designation } = req.body;

  const index = employees.findIndex((emp) => emp.empId === empId);
  if (index === -1) return res.status(404).json({ error: "Employee not found" });

  employees[index] = { empId, name, designation };
  res.json({ message: "Employee updated successfully" });
});

// DELETE employee
app.delete("/employee/:empId", (req, res) => {
  const empId = parseInt(req.params.empId);
  const index = employees.findIndex((emp) => emp.empId === empId);
  if (index === -1) return res.status(404).json({ error: "Employee not found" });

  employees.splice(index, 1);
  res.json({ message: "Employee deleted successfully" });
});

// Start server
app.listen(4500, () => console.log("Server running on port 4500"));
