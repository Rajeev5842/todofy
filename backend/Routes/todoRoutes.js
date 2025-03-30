import express from "express";
import {
  addTodo,
  deleteTodo,
  editTodo,
  fetchTodo,
  editCheckbox,
} from "../controllers/todoControllers.js";
const router = express.Router();

router.post("/", addTodo);
router.get("/",fetchTodo)
router.delete("/:id",deleteTodo)
router.put("/:id",editTodo)
router.put("/toggle/:id",editCheckbox)

export default router;
