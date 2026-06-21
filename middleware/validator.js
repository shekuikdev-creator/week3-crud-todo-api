// middleware/validator.js
const Joi = require('joi');

// Schema for POST /todos (creating a new todo)
const validateTodo = (req, res, next) => {
  const schema = Joi.object({
    task: Joi.string().min(3).max(100).required(),
    completed: Joi.boolean().default(false)
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }

  next();
};

// Schema for PATCH /todos/:id (updating a todo)
const validateTodoPatch = (req, res, next) => {
  const schema = Joi.object({
    task: Joi.string().min(3).max(100),  // NOT required - optional for patch
    completed: Joi.boolean()              // NOT required - optional for patch
  }).min(1);  // At least one field must be provided

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }

  next();
};

module.exports = {
  validateTodo,
  validateTodoPatch
};