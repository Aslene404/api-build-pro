const Project = require('../db/models/project-schema');
const mongoose = require('mongoose');

const addTask = Task => async (_projectId, _task) => {

    const task = new Task(_task);
    task.projectId = _projectId;

    try {
        const saved = await task.save();
        await Project.findByIdAndUpdate(_projectId, {
                $push: {
                    "tasks": saved._id
                }
            },
            function (err, model) {
                console.log(err);
            }
        );



        return ({
            status: "success",
            message: "task added succssfully!!!",
            payload: {
                task: saved
            }
        })


    } catch (error) {
        return ({
            status: "failed",
            message: "failed to add task!!!",
            payload: error
        })
    }

}



const getAllTasks = Task => async () => {
    try {
        let tasks = await Task.find({}).populate('task');
        if (task) {
            return ({
                status: "success",
                message: "all tasks",
                payload: tasks
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: "failed to get tasks",
            payload: null
        });
    }
}

const getTaskById = Task => async (id) => {
    if (id === undefined) {
        return ({
            status: "error",
            message: `Can't get task without a given id`,
            payload: null
        });
    }
    try {
        let task = await Task.findById(id);
        if (task) {
            return ({
                status: "success",
                message: `Get Task with _id=${id}`,
                payload: task
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: `Error to get task with _id=${id}`,
            payload: null
        });
    }
}


const updateTask = Task => async (id, task) => {
    if (task === undefined || JSON.stringify(task) === "{}") {
        return ({
            status: "error",
            message: "You should send taskname,quantity and unitprice",
            payload: null
        })
    }
    try {
        let updatedTask = await Task.findByIdAndUpdate(id, task);
        if (updatedTask) {
            return ({
                status: "success",
                message: "Task updated successfully",
                payload: await Task.findById(id)
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: "failed to update task",
            payload: error
        })
    }

}

const updateTaskStatus = Task => async (id, quantity) => {
    quantityes = Object.values(STATUSES);
    const isStatusValid = quantityes.includes(quantity);

    if (!isStatusValid) {
        return ({
            status: "error",
            message: "wrong Status",
            payload: null
        });
    } else {
        try {
            let task = await Task.findById(id);
            if (task) {
                task.set({
                    quantity: quantity
                });
                await task.save();
                return ({
                    status: "success",
                    message: "Task Status updated successfully",
                    payload: task
                })
            } else {
                return ({
                    status: "error",
                    message: "task not found, update quantity is failed",
                    payload: null
                })
            }

        } catch (error) {
            return ({
                status: "error",
                message: "Update task quantity is failed",
                payload: null
            })
        }
    }
}



const deleteTask = Task => async (id) => {
    if (id === undefined) {
        return ({
            status: "error",
            message: `Can't delete task without a given id`,
            payload: null
        });
    }
    try {
        let task = await Task.deleteOne({
            _id: id
        });
        if (task) {
            return ({
                status: "success",
                message: `Task with _id=${id} has been deleted`,
                payload: task
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: `Failed to delete task with _id=${id}`,
            payload: null
        });
    }
}




module.exports = (Task) => {
    return {
        addTask: addTask(Task),
        getAllTasks: getAllTasks(Task),
        getTaskById: getTaskById(Task),
        updateTask: updateTask(Task),

        deleteTask: deleteTask(Task)
    }
}