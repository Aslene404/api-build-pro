var express = require('express');
var router = express.Router();
var Trend = require('../db/models/trend-schemas');

router.post('/send', async function (req, res) {

    let new_trend = req.body;
    let trend = await Trend.create(new_trend);
    if (!trend) {
        res.json({
            status: "failed",
            message: "Echec d'envoi de votre demande",
            payload: null
        });
    }
    else {
        res.json({
            status: "success",
            message: "Votre trend est ajoutée avec succès",
            payload: trend
        });
    }
});

router.get('/all', async function (req, res) {
    await Trend.find({}, function (err, trends) {
        if (err) {
            res.json({
                status: "error",
                message: "Echec d'obtenir les trends",
                payload: null
            });
        }
        res.json({
            status: "success",
            message: "Tout les trends",
            payload: trends
        });
    });
});


//Get Trend By Id
router.get('/:id', async function (req, res) {
    let id = req.params.id;
    const trend = await Trend.findById(id);
    if (!trend) {
        res.json({
            status: "error",
            message: "Echec d'obtenir les trends",
            payload: null
        });
    } else {
        res.json({
            status: "success",
            message: "Trend",
            payload: trend
        });
    }

});


// Update Trend 
router.patch('/update/:id', async function (req, res) {
    let trendId = req.params.id;
    //let e_projects = req.body.e_projects ? req.body.e_projects : []; 
    const { ...trend } = req.body;

    if (!trend) {
        res.json({
            status: "error",
            message: "There is no field to update",
            payload: null
        });
    } else {
        const updatedTrend = await Trend.findByIdAndUpdate(trendId, trend);
        const result = await Trend.findById(trendId);
        if (!updatedTrend) {
            res.json({
                status: "error",
                message: "Fail to Update Trend fields",
                payload: null
            });
        } else {
            res.json({
                status: "success",
                message: "Trend Successfully Updated",
                payload: result
            });
        }
    }



});
// Update Trend's projects 
router.put('/update/:id', async function (req, res) {
    const trendId = req.params.id;
    const projectId = req.body.projectId;
    

    const theTrend = await Trend.findById(trendId).exec();
    if (theTrend) {
        theTrend.projects.push(projectId);
        try {
            await theTrend.save();
            return res.json({
                status: "success",
                message: "Trend's projects Updated successfully",
                payload: theTrend
            });
        } catch (error) {
            res.json({
                status: "error",
                message: "Fail to Update Trend's projects :(",
                payload: null
            });
        }
    }
});

// Delete User
router.delete('/delete/:id', async function (req, res) {
    let trendId = req.params.id;
    await Trend.findByIdAndRemove(trendId, function (err, doc) {
        if (err) {
            res.json({
                status: "error",
                message: "Echec de supprimer l'trend",
                payload: null
            });
        } else {
            res.json({
                status: "success",
                message: "Trend supprimé avec succès",
                payload: doc
            });
        }
    });
});


module.exports = router;