var express = require('express');
var router = express.Router();
var Devis = require('../db/models/devis-schemas');

router.post('/send', async function (req, res) {
    
    let new_devis = req.body;
    let devis = await Devis.create(new_devis);
    if (!devis) {
        res.json({
            status: "failed",
            message: "Echec d'envoi de votre demande",
            payload: null
        });
    }
    else {
        res.json({
            status: "success",
            message: "Votre demande est envoyée avec succès",
            payload: devis
        });
    }
});

router.get('/all', async function (req, res) {
    await Devis.find({}, function (err, devises) {
        if (err) {
            res.json({
                status: "error",
                message: "Echec d'obtenir les devis",
                payload: null
            });
        }
        res.json({
            status: "success",
            message: "Tout les devis",
            payload: devises
        });
    });
});

// Delete User
router.delete('/delete/:id', async function (req, res) {
    let devisId = req.params.id;
    await Devis.findByIdAndRemove(devisId, function (err, doc) {
        if (err) {
            res.json({
                status: "error",
                message: "Echec de supprimer le devis",
                payload: null
            });
        } else {
            res.json({
                status: "success",
                message: "Devis supprimé avec succès",
                payload: doc
            });
        }
    });
});


module.exports = router;