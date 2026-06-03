const express = require('express');
const app = express();
app.use(express.json()); // Parse JSON bodies

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// GET All – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos); // Send array as JSON
});

// Bonus Task: Fetch only uncompleted (active) to-dos
app.get('/todos/status/active', (req, res) => {
    // 1. Use .filter() to collect all items where completed is false
    const activeTodos = todos.filter(t => t.completed === false);
    
    // 2. Return that fresh subset array with a 200 OK status
    res.status(200).json(activeTodos);
});

// Task 1: Get a single to-do by its ID
app.get('/todos/:id', (req, res) => {
    // 1. Convert the ID from text to a number
    const todoId = parseInt(req.params.id);
    
    // 2. Search for the item with a matching ID
    const foundTodo = todos.find(t => t.id === todoId);
    
    // 3. If it doesn't exist, send a 404 error back
    if (!foundTodo) {
        return res.status(404).json({ error: "To-do item not found" });
    }
    
    // 4. If it does exist, send it back with a 200 OK status
    res.status(200).json(foundTodo);
});


// POST New – Create
// Task 2: Create a new to-do with validation rules
app.post('/todos', (req, res) => {
    // 1. Extract the values from the incoming request body
    const { task, completed } = req.body;

    // 2. VALIDATION: Check if 'task' is missing, completely blank, or just spaces
    if (!task || task.trim() === "") {
        // Stop execution right here and return a 400 Bad Request error
        return res.status(400).json({ error: "The 'task' field is strictly required." });
    }

    // 3. If validation passes, construct the clean new object
    const newTodo = {
        id: todos.length + 1,
        task: task,
        completed: completed || false // If completed wasn't provided, default it to false
    };

    // 4. Push it into our mock database array
    todos.push(newTodo);

    // 5. Respond back with a 201 Created status and the new item
    res.status(201).json(newTodo);
});

// PATCH Update – Partial
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  Object.assign(todo, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send(); // Silent success
});

app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.json(completed); // Custom Read!
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
