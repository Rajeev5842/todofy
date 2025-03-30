import { useEffect, useState } from "react";
import { MdOutlineAddComment as AddTodoIcon } from "react-icons/md";
import { MdDelete as DeleteTodoIcon } from "react-icons/md";
import { MdOutlineEdit as EditTodoIcon } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodo,setEditTodo]= useState("");

  const addTodoHandler = async (e) => {
    e.preventDefault();
    if (!todoInput) {
      toast.error("Todo cannot be empty");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/todos", {
        todo: todoInput,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setTodoInput("");
      }
    } catch (error) {}
  };
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/todos/${id}`);
      if (response.data.success) {
        toast.success("Todo deleted successfully");
        setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      }
    } catch (error) {
      toast.error("Failed to delete todo");
      console.error("Error deleting todo:", error);
    }
  };

  const handleEditIcon = (todoObject) => {
    setIsOpenEdit(true);
    setTodoInput(todoObject.todo);
    setEditTodoId(todoObject._id);
  };

  useEffect(() => {
    const alltodos = async () => {
      try {
        const response = await axios.get("http://localhost:8000/todos");
        setTodos(response.data.todos);
      } catch (error) {
        console.log("Error while fetching todos");
      }
    };
    alltodos();
  }, [todos]);

  const toggleCompletion = (index) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      );
    });
  };

  const handleUpdate = async () => {
    console.log(editTodo)
    if(!editTodo)
    {
      toast.error("Todo cannot be exmpty");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8000/todos/${editTodoId}`,
        {editTodo}

      );
      console.log(response.data);
      toast.success("Todo updated");
      setIsOpenEdit(false);
    } catch (error) {}
  };
  const handleCheckbox = async (todoObject) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/todos/toggle/${todoObject._id}`, // ✅ Correct endpoint
        { completed: !todoObject.completed }
      );
  
      if (response.data.success) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === todoObject._id
              ? { ...todo, completed: !todo.completed }
              : todo
          )
        );
      }
    } catch (error) {
      toast.error("Failed to update completion status");
      console.error("Error updating todo:", error);
    }
  };
  
  return (
    <div className="bg-neutral-900  relative text-white h-screen w-screen flex justify-center items-center">
      <div
        className={`todo-container ${
          isOpenEdit && "blur"
        } w-[60%] h-[70%] flex gap-6`}
      >
        {/* Left Section */}
        <div className="left w-1/2 bg-gradient-to-t from-neutral-800 to-neutral-900 rounded-xl p-6 flex flex-col">
          <div className="top h-1/3 flex flex-col items-center justify-center">
            <div className="heading text-[3rem] font-bold text-green-400 drop-shadow-md">
              ToDoFy
            </div>
            <div className="slogan text-[1rem] text-gray-400 italic">
              Simplify. Organize. Achieve.
            </div>
          </div>
          

          {/* Input Section */}
          <div className="bottom flex items-center justify-center gap-3 h-2/3">
            <input
              type="text"
              value={todoInput}
              placeholder="Enter Your Task"
              className="p-3 w-[80%] rounded-lg bg-neutral-700 bg-opacity-50 backdrop-blur-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500"
              onChange={(e) => setTodoInput(e.target.value)}
            />
            <button
              className="text-[2rem] hover:cursor-pointer hover:scale-105 transition-all duration-300 text-green-500 hover:text-green-600"
              onClick={addTodoHandler}
            >
              <AddTodoIcon />
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="right w-1/2 bg-gradient-to-t from-neutral-800 to-neutral-900 rounded-xl flex flex-col">
          <div className="heading h-[20%] flex justify-center items-end text-[2rem] font-semibold text-green-400 drop-shadow-md">
            All Todos
          </div>

          {/* Todo List */}
          <div className="overflow-y-auto h-[80%] flex items-center">
            <div className="todos bg-red-40 h-[90%] w-full rounded-md flex items-center overflow-y-auto bg-opacity-50 backdrop-blur-lg flex flex-col gap-4">
              {todos.length > 0 ? (
                todos.map((todoObject, index) => {
                  return (
                    <div
                      key={index}
                      className="bg-neutral-800 rounded-xl flex justify-between items-center text-lg p-4 w-full"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={todoObject.completed}
                          onChange={() => handleCheckbox(todoObject)}

                          className="w-5 h-5 accent-yellow-400"
                        />

                        <span
                          className={
                            todoObject.completed
                              ? "line-through text-gray-400"
                              : ""
                          }
                        >
                          {index + 1}.) {todoObject.todo}
                        </span>
                      </div>
                      <div className="flex gap-4 text-2xl">
                        <EditTodoIcon
                          onClick={() => handleEditIcon(todoObject)}
                          className="text-yellow-500 hover:cursor-pointer hover:scale-110 hover:text-yellow-600 duration-300"
                        />
                        <DeleteTodoIcon
                          onClick={() => handleDelete(todoObject._id)}
                          className="text-red-500 hover:text-red-600 hover:cursor-pointer hover:scale-110 duration-300"
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-green-400 text-[1.2rem] text-center">
                  No todos yet. Add a todo to start your task.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={` absolute shadow-[0px_4px_20px_gray]  rounded-xl p-6 ${
          isOpenEdit ? "flex" : "hidden"
        } flex-col  top-1/2 left-1/2 justify-around h-[40vh] transform -translate-x-1/2 -translate-y-1/2  w-[30vw] bg-neutral-800`}
      >
        <div className="heading  text-center text-[2rem] text-green-600">
          Edit Todo
        </div>
        <div className="new-input ">
          <input
            type="text"
            value={editTodo}
            placeholder="New todo"
            className="w-full p-3 bg-neutral-700 rounded-xl focus:outline-none"
            onChange={(e)=>setEditTodo(e.target.value)}

          />
        </div>

        <div className="update-button flex justify-center">
          <button
            className="bg-green-800 hover:bg-green-900 hover:cursor-pointer hover:scale-105 duration-300 p-3 text-xl rounded-xl w-full"
            onClick={handleUpdate}
          >
            Update Todo
          </button>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
