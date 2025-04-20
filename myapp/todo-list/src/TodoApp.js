// TodoApp.js
import { useEffect, useState } from "react";
import axios from "axios";
import './App.css'; // Reuse your styling

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:8000/todos");
      setTodos(response.data);
    } catch (err) {
      console.error("Failed to fetch todos", err);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/add_todo", {
        task,
      });
      setTodos([...todos, response.data]);
      setTask("");
    } catch (err) {
      console.error("Failed to add todo", err);
    }
  };


//   const updateTodo = async (todo) => {
//     await axios.put(`http://localhost:8000/update_todo/${todo.id}`, {
//       task: todo.task,
//       completed: !todo.completed
//     });
//   };
const updateTodo = async (todo) => {
    try {
      await axios.put(`http://localhost:8000/update_todo/${todo.id}`, {
        task: todo.task,
        completed: !todo.completed,
        // optional: user_id: "123" 
      });
      fetchTodos(); // refresh list
    } catch (error) {
      console.error("Error updating todo:", error.response?.data || error.message);
    }
  };

  
  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:8000/delete_todo/${id}`);
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <main>
      <h1>Todo App</h1>
      <form onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Enter task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      {todos.map((todo) => (
        <div className={`task ${todo.completed ? "done" : ""}`} key={todo.id}>
          <div className="checkbox">
            {/* <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => updateTodo(todo.id)}
            /> */}
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => updateTodo(todo)}
            />
          </div>
          <div className="task-name">
            <span>{todo.task}</span>
          </div>
          <button className="trash" onClick={() => deleteTodo(todo.id)}>
            🗑️
          </button>
        </div>
      ))}
    </main>
  );
};

export default TodoApp;
