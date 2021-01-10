const addProject = Project => async (p) => {

    const project = new Project(p)
    try {
        const save = await project.save();
        if (save) {
            return ({
                status: "success",
                message: "project added succssfully!!!",
                payload: save
            })
        }
    } catch (error) {
        return ({
            status: "failed",
            message: "failed to add project!!!",
            payload: error
        })
    }

}


//TODO: to fix getAllProject Service and route

const getAllProjects = Project => async () => {
    try {
        let projects = await Project.find().populate({
                path: 'owner'
            })
            .populate({
                path: 'tasks',
                populate: {
                    path: "tasks"
                }
            })
            .populate({
                path: 'materials',
                populate: {
                    path: "materials"
                }
            })
            .populate({
                path: 'staff',
                populate: {
                    path: "staff"
                }
            });
        if (project) {
            return ({
                status: "success",
                message: "all projects",
                payload: projects
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: "failed to get projects",
            payload: null
        });
    }
}

const getProjectById = Project => async (id) => {
    if (id === undefined) {
        return ({
            status: "error",
            message: `Can't get project without a given id`,
            payload: null
        });
    }
    try {
        let project = await Project.findById(id).populate({
                path: 'owner'
            })
            .populate({
                path: 'tasks',
                populate: {
                    path: "tasks"
                }
            })
            .populate({
                path: 'materials',
                populate: {
                    path: "materials"
                }
            })
            .populate({
                path: 'staff',
                populate: {
                    path: "staff"
                }
            });
        if (project) {
            return ({
                status: "success",
                message: `Get Project with _id=${id}`,
                payload: project
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: `Error to get project with _id=${id}`,
            payload: null
        });
    }
}


const getUserProjects = Project => async (userId) => {
    if (userId === undefined) {
        return ({
            status: "error",
            message: `Can't get project for this user`,
            payload: null
        });
    }
    try {
        let projects = await Project.find({
                owner: userId
            })
            .populate({
                path: 'owner'
            })
            .populate({
                path: 'tasks',
                populate: {
                    path: "tasks"
                }
            })
            .populate({
                path: 'materials',
                populate: {
                    path: "materials"
                }
            })
            .populate({
                path: 'staff',
                populate: {
                    path: "staff"
                }
            });
        if (projects) {
            return ({
                status: "success",
                message: `All Projects for this user`,
                payload: projects
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: `Error can't get projects for this user`,
            payload: null
        });
    }
}

const updateProject = Project => async (id, project) => {
    if (project === undefined || JSON.stringify(project) === "{}") {
        return ({
            status: "error",
            message: "You should send projectname,status and owner",
            payload: null
        })
    }
    try {
        let updatedProject = await Project.findByIdAndUpdate(id, project);
        if (updatedProject) {
            return ({
                status: "success",
                message: "Project updated successfully",
                payload: await Project.findById(id)
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: "failed to update project",
            payload: error
        })
    }

}

const updateProjectStatus = Project => async (id, status) => {
    statuses = Object.values(STATUSES);
    const isStatusValid = statuses.includes(status);

    if (!isStatusValid) {
        return ({
            status: "error",
            message: "wrong Status",
            payload: null
        });
    } else {
        try {
            let project = await Project.findById(id);
            if (project) {
                project.set({
                    status: status
                });
                await project.save();
                return ({
                    status: "success",
                    message: "Project Status updated successfully",
                    payload: project
                })
            } else {
                return ({
                    status: "error",
                    message: "project not found, update status is failed",
                    payload: null
                })
            }

        } catch (error) {
            return ({
                status: "error",
                message: "Update project status is failed",
                payload: null
            })
        }
    }
}



const deleteProject = Project => async (id) => {
    if (id === undefined) {
        return ({
            status: "error",
            message: `Can't delete project without a given id`,
            payload: null
        });
    }
    try {
        let project = await Project.deleteOne({
            _id: id
        });
        if (project) {
            return ({
                status: "success",
                message: `Project with _id=${id} has been deleted`,
                payload: project
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: `Failed to delete project with _id=${id}`,
            payload: null
        });
    }
}


const assignTaskToProject = Project => Task => async (projectId, taskId) => {
    if (projectId === undefined || taskId === undefined) {
        return ({
            status: "error",
            message: `Can't assign task to project`,
            payload: null
        });
    }

    try {
        let project = await Project.findById(projectId);
        project.task = taskId;
        await project.save();

        let task = await Task.findById(taskId);
        task.project.push(projectId);
        await task.save();
        return ({
            status: "success",
            message: `Task assigned to Project`,
            payload: {
                project: project,
                task: task
            }
        })


    } catch (error) {
        return ({
            status: "error",
            message: `Error can't assign Task to Project`,
            payload: error
        });

    }
}
const assignMaterialToProject = Project => Material => async (projectId, materialId) => {
    if (projectId === undefined || materialId === undefined) {
        return ({
            status: "error",
            message: `Can't assign material to project`,
            payload: null
        });
    }

    try {
        let project = await Project.findById(projectId);
        project.material = materialId;
        await project.save();

        let material = await Material.findById(materialId);
        material.project.push(projectId);
        await material.save();
        return ({
            status: "success",
            message: `Material assigned to Project`,
            payload: {
                project: project,
                material: material
            }
        })


    } catch (error) {
        return ({
            status: "error",
            message: `Error can't assign Material to Project`,
            payload: error
        });

    }
}
const assignStaffToProject = Project => User => async (projectId, userId) => {
    if (projectId === undefined || userId === undefined) {
        return ({
            status: "error",
            message: `Can't assign staff to project`,
            payload: null
        });
    }

    try {
        let project = await Project.findById(projectId);
        project.staff = userId;
        await project.save();

        let user = await User.findById(userId);
        user.project.push(projectId);
        await user.save();
        return ({
            status: "success",
            message: `Staff assigned to Project`,
            payload: {
                project: project,
                user: user
            }
        })


    } catch (error) {
        return ({
            status: "error",
            message: `Error can't assign Staff to Project`,
            payload: error
        });

    }
}

const updateProjectStaff = Project => async (projectId, stafIds) => {
    try {
        let res = await Project.findByIdAndUpdate(
                {_id:projectId} , 
                { "staff": stafIds},
            function (err, model) {
                console.log(err);
            });
            console.log(res);
            return ({
                status: "success",
                message: `Staff assigned to Project`,
                payload: res
            })

    } catch (error) {
        return ({
            status: "error",
            message: `Error can't assign Staff to Project`,
            payload: error
        });

    }
}

module.exports = (Project) => {
    return {
        addProject: addProject(Project),

        getAllProjects: getAllProjects(Project),
        getProjectById: getProjectById(Project),
        updateProject: updateProject(Project),
        updateProjectStatus: updateProjectStatus(Project),
        deleteProject: deleteProject(Project),
        assignStaffToProject: assignStaffToProject(Project),
        assignTaskToProject: assignTaskToProject(Project),
        getUserProjects: getUserProjects(Project),
        updateProjectStaff: updateProjectStaff(Project)
    }
}