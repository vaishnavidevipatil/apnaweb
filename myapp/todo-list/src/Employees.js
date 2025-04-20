import { useState, useEffect } from "react";
import axios from "axios";

const Employees = () => {
  const [employees, setEmployees] = useState([]);

  const addEmployee = () => {
    setEmployees([
      ...employees,
      { empId: 6789, name: "Clara", designation: "TL" },
      {empId:797, name:"devi", designation:"TL"}
    // Added a new employee object with empId, name, and designation
    ]);
  };

  useEffect(() => {
    axios
      .get("http://localhost:4500/employee")
      .then((result) => setEmployees(result.data))
      .catch((error) => console.error("Error fetching data:", error)); // Added error handling
  }, []);

  return (
    <>
      <table style={{ width: "60%" }} className="table">
        <thead className="thead-light">
          <tr>
            <th>EmpID</th>
            <th>Name</th>
            <th>Designation</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => ( // Added index as key
            <tr key={index}>
              <td>{employee.empId}</td>
              <td>{employee.name}</td>
              <td>{employee.designation}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addEmployee}>Add an Employee</button>
    </>
  );
};

export default Employees;
