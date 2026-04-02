const express = require("express");
const Todo = require("../models/Todo");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { completed } = req.query;
    const filter = {};
    if (completed === "true") filter.completed = true;
    if (completed === "false") filter.completed = false;

    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    res.json({ data: todos });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ data: todo });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid todo id" });
    }
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;
    const todo = await Todo.create({ title, description, completed });
    res.status(201).json({ data: todo });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (completed !== undefined) update.completed = completed;

    const todo = await Todo.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ data: todo });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid todo id" });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(204).send();
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid todo id" });
    }
    next(err);
  }
});

module.exports = router;
