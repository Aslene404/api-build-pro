const express = require('express');
const router = express.Router();
const Task = require('../db/models/task-schema');
const helpers = require('../helpers/user-validation');
const { check, validationResult } = require('express-validator');


const taskService = require('../services/task-service')(Task);



// @ts-check
// POST /addTask
router.post('/addtask/:projectId', async function (req, res, next) {
    let projectId=req.params.projectId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({
        status: "fail",
        message: errors.array(),
        payload: null
      });
    } else {
      let {
        ...task
      } = req.body;
    
      try {
        let response = await taskService.addTask(projectId,task);
        console.log(response);
        res.json(response);
      } catch (error) {
        next(error)
      }

    }
  }

);


// @ts-check
// GET / get All tasks
router.get('/', helpers.validateUser, helpers.isAdmin, async function (req, res, next) {
  try {
    let response = await taskService.getAllTasks();
    if (response) {
      res.json(response)
    }
  } catch (error) {
    next(error)
  }
});


/**
 * Get Task By Id
 * GET /task/:id
 */

router.get('/task/:id', helpers.validateUser, async function (req, res,next) {
  let id = req.params.id;
  try {
    let response = await taskService.getTaskById(id);
    if (response) {
      return res.json(response);
    }
  } catch (error) {
    next(error);
  }

})


// Update Task Info
// PUT /update/:id
router.put('/update/:id', helpers.validateUser, async function (req, res,next) {
  if (
    !req.body.hasOwnProperty('taskname') &&
    !req.body.hasOwnProperty('quantity') &&
    !req.body.hasOwnProperty('status')) {
    res.status(422).json({
      status: "error",
      message: 'You Should send taskname and/or quantity and/or status',
      payload: null
    });
  } else {
    let taskId = req.params.id;
    let task = {
      ...req.body
    };

    try {
      let response = await taskService.updateTask(taskId, task);
      if (response) {
        res.json(response);
      }
    } catch (error) {
      next(error);
    }

  }
});









// Delete Task
// DELETE /delete/:id
router.delete('/delete/:id', async function (req, res, next) {
  let id = req.params.id;
  try {
    let response = await taskService.deleteTask(id);
    if(response){
      res.json(response);
    }
  } catch (error) {
    next(error);
  }
});


module.exports = router;