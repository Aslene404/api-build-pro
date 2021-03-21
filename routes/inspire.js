var express = require('express');
var router = express.Router();
var Inspire = require('../db/models/inspire-schemas');

router.post('/send', async function (req, res) {

    let new_inspire = req.body;
    let inspire = await Inspire.create(new_inspire);
    if (!inspire) {
        res.json({
            status: "failed",
            message: "Echec d'envoi de votre demande",
            payload: null
        });
    }
    else {
        res.json({
            status: "success",
            message: "Votre inspire est ajoutée avec succès",
            payload: inspire
        });
    }
});

router.get('/all', async function (req, res) {
    await Inspire.find({}, function (err, inspires) {
        if (err) {
            res.json({
                status: "error",
                message: "Echec d'obtenir les inspires",
                payload: null
            });
        }
        res.json({
            status: "success",
            message: "Tout les inspires",
            payload: inspires
        });
    });
});


//Get Inspire By Id
router.get('/:id', async function (req, res) {
    let id = req.params.id;
    const inspire = await Inspire.findById(id);
    if (!inspire) {
        res.json({
            status: "error",
            message: "Echec d'obtenir les inspires",
            payload: null
        });
    } else {
        res.json({
            status: "success",
            message: "Inspire",
            payload: inspire
        });
    }

});


// Update Inspire 
router.patch('/update/:id', async function (req, res) {
    let inspireId = req.params.id;
    //let e_projects = req.body.e_projects ? req.body.e_projects : []; 
    const { ...inspire } = req.body;

    if (!inspire) {
        res.json({
            status: "error",
            message: "There is no field to update",
            payload: null
        });
    } else {
        const updatedInspire = await Inspire.findByIdAndUpdate(inspireId, inspire);
        const result = await Inspire.findById(inspireId);
        if (!updatedInspire) {
            res.json({
                status: "error",
                message: "Fail to Update Inspire fields",
                payload: null
            });
        } else {
            res.json({
                status: "success",
                message: "Inspire Successfully Updated",
                payload: result
            });
        }
    }



});
// Update Inspire's projects 
router.put('/update/:id', async function (req, res) {
    const inspireId = req.params.id;
    const projectId = req.body.projectId;
    

    const theInspire = await Inspire.findById(inspireId).exec();
    if (theInspire) {
        theInspire.projects.push(projectId);
        try {
            await theInspire.save();
            return res.json({
                status: "success",
                message: "Inspire's projects Updated successfully",
                payload: theInspire
            });
        } catch (error) {
            res.json({
                status: "error",
                message: "Fail to Update Inspire's projects :(",
                payload: null
            });
        }
    }
});

// Delete User
router.delete('/delete/:id', async function (req, res) {
    let inspireId = req.params.id;
    await Inspire.findByIdAndRemove(inspireId, function (err, doc) {
        if (err) {
            res.json({
                status: "error",
                message: "Echec de supprimer l'inspire",
                payload: null
            });
        } else {
            res.json({
                status: "success",
                message: "Inspire supprimé avec succès",
                payload: doc
            });
        }
    });
});


module.exports = router;