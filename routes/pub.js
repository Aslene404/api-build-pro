var express = require('express');
var router = express.Router();
var Pub = require('../db/models/pub-schemas');

router.post('/send', async function (req, res) {

    let new_pub = req.body;
    let pub = await Pub.create(new_pub);
    if (!pub) {
        res.json({
            status: "failed",
            message: "Echec d'envoi de votre demande",
            payload: null
        });
    }
    else {
        res.json({
            status: "success",
            message: "Votre pub est ajoutée avec succès",
            payload: pub
        });
    }
});

router.get('/all', async function (req, res) {
    await Pub.find({}, function (err, pubs) {
        if (err) {
            res.json({
                status: "error",
                message: "Echec d'obtenir les pubs",
                payload: null
            });
        }
        res.json({
            status: "success",
            message: "Tout les pubs",
            payload: pubs
        });
    });
});


//Get Pub By Id
router.get('/:id', async function (req, res) {
    let id = req.params.id;
    const pub = await Pub.findById(id);
    if (!pub) {
        res.json({
            status: "error",
            message: "Echec d'obtenir les pubs",
            payload: null
        });
    } else {
        res.json({
            status: "success",
            message: "Pub",
            payload: pub
        });
    }

});


// Update Pub 
router.patch('/update/:id', async function (req, res) {
    let pubId = req.params.id;
    //let e_projects = req.body.e_projects ? req.body.e_projects : []; 
    const { ...pub } = req.body;

    if (!pub) {
        res.json({
            status: "error",
            message: "There is no field to update",
            payload: null
        });
    } else {
        const updatedPub = await Pub.findByIdAndUpdate(pubId, pub);
        const result = await Pub.findById(pubId);
        if (!updatedPub) {
            res.json({
                status: "error",
                message: "Fail to Update Pub fields",
                payload: null
            });
        } else {
            res.json({
                status: "success",
                message: "Pub Successfully Updated",
                payload: result
            });
        }
    }



});
// Update Pub's projects 
router.put('/update/:id', async function (req, res) {
    const pubId = req.params.id;
    const projectId = req.body.projectId;
    

    const thePub = await Pub.findById(pubId).exec();
    if (thePub) {
        thePub.projects.push(projectId);
        try {
            await thePub.save();
            return res.json({
                status: "success",
                message: "Pub's projects Updated successfully",
                payload: thePub
            });
        } catch (error) {
            res.json({
                status: "error",
                message: "Fail to Update Pub's projects :(",
                payload: null
            });
        }
    }
});

// Delete User
router.delete('/delete/:id', async function (req, res) {
    let pubId = req.params.id;
    await Pub.findByIdAndRemove(pubId, function (err, doc) {
        if (err) {
            res.json({
                status: "error",
                message: "Echec de supprimer l'pub",
                payload: null
            });
        } else {
            res.json({
                status: "success",
                message: "Pub supprimé avec succès",
                payload: doc
            });
        }
    });
});


module.exports = router;