var express = require('express');
var router = express.Router();
var Entreprise = require('../db/models/entreprise-schemas');

router.post('/send', async function (req, res) {

    let new_entreprise = req.body;
    let entreprise = await Entreprise.create(new_entreprise);
    if (!entreprise) {
        res.json({
            status: "failed",
            message: "Echec d'envoi de votre demande",
            payload: null
        });
    }
    else {
        res.json({
            status: "success",
            message: "Votre entreprise est ajoutée avec succès",
            payload: entreprise
        });
    }
});

router.get('/all', async function (req, res) {
    await Entreprise.find({}, function (err, entreprises) {
        if (err) {
            res.json({
                status: "error",
                message: "Echec d'obtenir les entreprises",
                payload: null
            });
        }
        res.json({
            status: "success",
            message: "Tout les entreprises",
            payload: entreprises
        });
    });
});


//Get Entreprise By Id
router.get('/:id', async function (req, res) {
    let id = req.params.id;
    const entreprise = await Entreprise.findById(id);
    if (!entreprise) {
        res.json({
            status: "error",
            message: "Echec d'obtenir les entreprises",
            payload: null
        });
    } else {
        res.json({
            status: "success",
            message: "Entreprise",
            payload: entreprise
        });
    }

});


// Update Entreprise 
router.patch('/update/:id', async function (req, res) {
    let entrepriseId = req.params.id;
    //let e_projects = req.body.e_projects ? req.body.e_projects : []; 
    const { ...entreprise } = req.body;

    if (!entreprise) {
        res.json({
            status: "error",
            message: "There is no field to update",
            payload: null
        });
    } else {
        const updatedEntreprise = await Entreprise.findByIdAndUpdate(entrepriseId, entreprise);
        const result = await Entreprise.findById(entrepriseId);
        if (!updatedEntreprise) {
            res.json({
                status: "error",
                message: "Fail to Update Entreprise fields",
                payload: null
            });
        } else {
            res.json({
                status: "success",
                message: "Entreprise Successfully Updated",
                payload: result
            });
        }
    }



});
// Update Entreprise's projects 
router.put('/update/:id', async function (req, res) {
    const entrepriseId = req.params.id;
    const projectId = req.body.projectId;
    

    const theEntreprise = await Entreprise.findById(entrepriseId).exec();
    if (theEntreprise) {
        theEntreprise.projects.push(projectId);
        try {
            await theEntreprise.save();
            return res.json({
                status: "success",
                message: "Entreprise's projects Updated successfully",
                payload: theEntreprise
            });
        } catch (error) {
            res.json({
                status: "error",
                message: "Fail to Update Entreprise's projects :(",
                payload: null
            });
        }
    }
});

// Delete User
router.delete('/delete/:id', async function (req, res) {
    let entrepriseId = req.params.id;
    await Entreprise.findByIdAndRemove(entrepriseId, function (err, doc) {
        if (err) {
            res.json({
                status: "error",
                message: "Echec de supprimer l'entreprise",
                payload: null
            });
        } else {
            res.json({
                status: "success",
                message: "Entreprise supprimé avec succès",
                payload: doc
            });
        }
    });
});


module.exports = router;