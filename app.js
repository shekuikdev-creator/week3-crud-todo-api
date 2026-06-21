const express = require('express');
const cors = require('cors');
const app = express();

// Import your custom middleware
const logRequest = require('./middleware/logger');
const { validateTodo, validateTodoPatch } = require('./middleware/validator');
const errorHandler = require('./middleware/errorHandler');

// Built-in middleware
app.use(express.json());

// Third-party middleware
app.use(cors());

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

// GET all todos
app.get('/todos', (req, res, next) => {
  try {
    res.json(todos);
  } catch (err) {
    next(err);
  }
});

// GET single todo
app.get('/todos/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      throw new Error('Invalid ID');
    }

    const todo = todos.find(t => t.id === id);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  } catch (err) {
    next(err);
  }
});

// POST new todo - WITH VALIDATION
app.post('/todos', validateTodo, (req, res, next) => {
  try {
    const { task, completed } = req.body;
    
    const newTodo = {
      id: nextId++,
      task,
      completed: completed || false
    };
    
    todos.push(newTodo);
    res.status(201).json(newTodo);
  } catch (err) {
    next(err);
  }
});

// PATCH update todo - WITH VALIDATION
app.patch('/todos/:id', validateTodoPatch, (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      throw new Error('Invalid ID');
    }

    const todo = todos.find(t => t.id === id);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Update only the fields provided
    if (req.body.task !== undefined) {
      todo.task = req.body.task;
    }
    if (req.body.completed !== undefined) {
      todo.completed = req.body.completed;
    }

    res.json(todo);
  } catch (err) {
    next(err);
  }
});

// DELETE todo
app.delete('/todos/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      throw new Error('Invalid ID');
    }

    const index = todos.findIndex(t => t.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todos.splice(index, 1);
    res.status(204).send();
  } catch (err) {
    next(err);
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