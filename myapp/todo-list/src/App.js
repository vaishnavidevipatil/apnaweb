// // import './App.css';
// import React, { Component } from "react"; // Correct import for Component
// import DogImages from "./DogImages";

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       dogImages: [] // State should be initialized with an empty array
//     };
//   }

//   componentDidMount() {
//     fetch("https://dog.ceo/api/breeds/image/random/3")
//       .then(res => res.json())
//       .then((data) => {
//         this.setState({ dogImages: data.message }); // Correct way to update state
//       })
//       .catch((error) => console.error('Error fetching dog images:', error)); // Optional: Adding error handling
//   }

//   render() {
//     const dogList = this.state.dogImages.map((url, index) => {
//       return <DogImages key={index} url={url} />; // Correct way to pass the prop and use a key
//     });

//     return (
//       <div className="App">
//         <h1>Hello Dogs</h1>
//         {dogList}
//       </div>
//     );
//   }
// }

// export default App;

// App.js
  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import './App.css';

  function App() {
    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState("");

    const fetchTodos = async () => {
      try {
        const response = await axios.get("http://localhost:8000/todos");
        setTodos(response.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
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
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    };

    const toggleTodo = async (id) => {
      try {
        await axios.put(`http://localhost:8000/update_todo/${id}`);
        fetchTodos();
      } catch (error) {
        console.error("Error updating todo:", error);
      }
    };

    const deleteTodo = async (id) => {
      try {
        await axios.delete(`http://localhost:8000/delete_todo/${id}`);
        fetchTodos();
      } catch (error) {
        console.error("Error deleting todo:", error);
      }
    };

    useEffect(() => {
      fetchTodos();
    }, []);

    return (
      <main>
        <h1>To-Do App</h1>
        <form onSubmit={addTodo}>
          <input
            type="text"
            value={task}
            placeholder="Enter your task"
            onChange={(e) => setTask(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
        {todos.map((todo) => (
          <div className={`task ${todo.completed ? "done" : ""}`} key={todo.id}>
            <div className="checkbox">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
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
  }

  export default App;
