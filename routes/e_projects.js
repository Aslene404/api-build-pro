var express = require('express');
var router = express.Router();
var E_projects = require('../db/models/e_projects-schemas');

router.post('/send', async function (req, res) {
    
    let new_e_projects = req.body;
    let e_projects = await E_projects.create(new_e_projects);
    if (!e_projects) {
        res.json({
            status: "failed",
            message: "Echec d'envoi de votre demande",
            payload: null
        });
    }
    else {
        res.json({
            status: "success",
            message: "Votre projet est ajouté avec succès",
            payload: e_projects
        });
    }
});

router.get('/all', async function (req, res) {
    await E_projects.find({}, function (err, e_projectss) {
        if (err) {
            res.json({
                status: "error",
                message: "Echec d'obtenir les e_projects",
                payload: null
            });
        }
        res.json({
            status: "success",
            message: "Tout les e_projects",
            payload: e_projectss
        });
    });
});
//Get E_project By Id
router.get('/:id', async function (req, res) {
    let id = req.params.id;
    const e_project = await E_projects.findById(id);
    if (!e_project) {
        res.json({
            status: "error",
            message: "Echec d'obtenir les e_project",
            payload: null
        });
    } else {
        res.json({
            status: "success",
            message: "E_project",
            payload: e_project
        });
    }

});


// Update E_project 
router.patch('/update/:id', async function (req, res) {
    let e_projectId = req.params.id;
    //let e_projects = req.body.e_projects ? req.body.e_projects : []; 
    const { ...e_project } = req.body;

    if (!e_project) {
        res.json({
            status: "error",
            message: "There is no field to update",
            payload: null
        });
    } else {
        const updatedE_project = await E_projects.findByIdAndUpdate(e_projectId, e_project);
        const result = await E_projects.findById(e_projectId);
        if (!updatedE_project) {
            res.json({
                status: "error",
                message: "Fail to Update E_project fields",
                payload: null
            });
        } else {
            res.json({
                status: "success",
                message: "E_project Successfully Updated",
                payload: result
            });
        }
    }



});

// Delete User
router.delete('/delete/:id', async function (req, res) {
    let e_projectsId = req.params.id;
    await E_projects.findByIdAndRemove(e_projectsId, function (err, doc) {
        if (err) {
            res.json({
                status: "error",
                message: "Echec de supprimer le e_project",
                payload: null
            });
        } else {
            res.json({
                status: "success",
                message: "e_project supprimé avec succès",
                payload: doc
            });
        }
    });
});


module.exports = router;