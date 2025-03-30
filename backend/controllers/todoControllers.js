import Todo from "../Models/todoModel.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
const fetchTodo = asyncHandler(async (req, res) => {
  const todos = await Todo.find();

  res.status(200).json({
    success: true,
    todos,
  });
});

const addTodo = asyncHandler(async (req, res) => {
  const { todo } = req.body;
  if (!todo) {
    res.status(400);
    throw new Error("Todo is required");
  }

  const newTodo = await Todo.create({ todo: todo });
  res.status(201).json({
    success: true,
    todo: newTodo,
    message: "Todo is added to the queue",
  });
});

const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("Deleting Todo with ID:", id);

  const deletedTodo = await Todo.findByIdAndDelete(id);
  console.log(deletedTodo);
  if (!deletedTodo) {
    res.status(404);
    throw new Error("Todo not found");
  }

  res.status(200).json({
    message: "Todo deleted successfully",
    success: true,
    deletedTodo,
  });
});

const editTodo = asyncHandler(async (req, res) => {
  console.log("hi rajeev editted");
  const { id } = req.params;
  const { editTodo } = req.body;
  console.log(editTodo);
  console.log(id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid Todo ID" });
  }
  const todoObject = await Todo.findById(id);
  
  if(!todoObject) {
    return res.status(404).json({success:false,message:"Todo not found"})
  }
  // console.log(todoObject);
  // console.log(todoObject.todo);

  todoObject.todo=editTodo;
  // console.log(todoObject.todo);
  await todoObject.save();
  res.status(201).json({
    success:true,
    message:"Todo Updated ",
    updatedTodo:todoObject,
  })
   
});
 const editCheckbox = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body; // ✅ Only update `completed`

    if (typeof completed !== "boolean") {
      return res.status(400).json({ success: false, message: "Invalid completed value" });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { completed },  // ✅ Only update `completed`
      { new: true, runValidators: false } // ✅ Disable validation
    );

    if (!updatedTodo) {
      return res.status(404).json({ success: false, message: "Todo not found" });
    }

    res.json({ success: true, message: "Todo status updated", todo: updatedTodo });
  } catch (error) {
    console.error("Error updating todo status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




export { addTodo, deleteTodo, editTodo, fetchTodo,editCheckbox };
