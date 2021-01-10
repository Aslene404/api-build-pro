const Project = require('../db/models/project-schema');
const mongoose = require('mongoose');

const addMaterial = Material => async (_projectId, _material) => {

    const material = new Material(_material);
    material.projectId = _projectId;

    try {
        const saved = await material.save();
        await Project.findByIdAndUpdate(_projectId, {
                $push: {
                    "materials": saved._id
                }
            },
            function (err, model) {
                console.log(err);
            }
        );



        return ({
            status: "success",
            message: "material added succssfully!!!",
            payload: {
                material: saved
            }
        })


    } catch (error) {
        return ({
            status: "failed",
            message: "failed to add material!!!",
            payload: error
        })
    }

}



const getAllMaterials = Material => async () => {
    try {
        let materials = await Material.find({}).populate('task');
        if (material) {
            return ({
                status: "success",
                message: "all materials",
                payload: materials
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: "failed to get materials",
            payload: null
        });
    }
}

const getMaterialById = Material => async (id) => {
    if (id === undefined) {
        return ({
            status: "error",
            message: `Can't get material without a given id`,
            payload: null
        });
    }
    try {
        let material = await Material.findById(id);
        if (material) {
            return ({
                status: "success",
                message: `Get Material with _id=${id}`,
                payload: material
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: `Error to get material with _id=${id}`,
            payload: null
        });
    }
}


const updateMaterial = Material => async (id, material) => {
    if (material === undefined || JSON.stringify(material) === "{}") {
        return ({
            status: "error",
            message: "You should send materialname,quantity and unitprice",
            payload: null
        })
    }
    try {
        let updatedMaterial = await Material.findByIdAndUpdate(id, material);
        if (updatedMaterial) {
            return ({
                status: "success",
                message: "Material updated successfully",
                payload: await Material.findById(id)
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: "failed to update material",
            payload: error
        })
    }

}

const updateMaterialStatus = Material => async (id, quantity) => {
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
            let material = await Material.findById(id);
            if (material) {
                material.set({
                    quantity: quantity
                });
                await material.save();
                return ({
                    status: "success",
                    message: "Material Status updated successfully",
                    payload: material
                })
            } else {
                return ({
                    status: "error",
                    message: "material not found, update quantity is failed",
                    payload: null
                })
            }

        } catch (error) {
            return ({
                status: "error",
                message: "Update material quantity is failed",
                payload: null
            })
        }
    }
}



const deleteMaterial = Material => async (id) => {
    if (id === undefined) {
        return ({
            status: "error",
            message: `Can't delete material without a given id`,
            payload: null
        });
    }
    try {
        let material = await Material.deleteOne({
            _id: id
        });
        if (material) {
            return ({
                status: "success",
                message: `Material with _id=${id} has been deleted`,
                payload: material
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: `Failed to delete material with _id=${id}`,
            payload: null
        });
    }
}




module.exports = (Material) => {
    return {
        addMaterial: addMaterial(Material),
        getAllMaterials: getAllMaterials(Material),
        getMaterialById: getMaterialById(Material),
        updateMaterial: updateMaterial(Material),

        deleteMaterial: deleteMaterial(Material)
    }
}