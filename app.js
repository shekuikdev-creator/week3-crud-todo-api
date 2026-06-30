require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Import your custom middleware
const logRequest = require('./middleware/logger');
const { validateTodo, validateTodoPatch } = require('./middleware/validator');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./database/db.js');
const Todo = require('./models/todo.model'); // adjust path if needed

// Built-in middleware
app.use(express.json());

// Third-party middleware
app.use(cors());

// Connect to MongoDB 
connectDB();

// Custom logger middleware - logs ALL requests
app.use(logRequest);

// ============================================
//  WEEK 3 TODO DATA
// ============================================
let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false }
];
let nextId = 3;

// ============================================
// ROUTES WITH TRY-CATCH BLOCKS
// ============================================

// ==============
// GET all todos
// ==============
app.get('/todos', async (req, res) => {
  try {
    const { completed } = req.query; // e.g., ?completed=false
    let filter = {};

    if (completed) {
      // Convert the string "true" or "false" to a real Boolean
      filter.completed = completed === 'true';
    }

    const todos = await Todo.find(filter);
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===============
// GET single todo
// ===============
app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================================
// POST new todo - WITH VALIDATION
// ================================ 
app.post('/todos', async (req, res) => {
  try {
    const newTodo = new Todo({
      task: req.body.task,
      completed: req.body.completed || false,
    });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===================================
// PATCH update todo - WITH VALIDATION
// ===================================
app.patch('/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // This returns the updated version, not the old one
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===========
// DELETE todo
// ===========
app.delete('/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json({ message: 'Todo deleted', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ============================================
// GLOBAL ERROR HANDLER - MUST BE LAST!
// ============================================
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});