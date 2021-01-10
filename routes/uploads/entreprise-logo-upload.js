var express = require('express');
var multer = require('multer');
var router = express.Router();
var Entreprise = require('../../db/models/entreprise-schemas');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/photos');
    },
    filename: function (req, file, cb) {
        var entrepriseId = req.body.id;
        var path = file.fieldname + '-' + Date.now() + '-'+entrepriseId + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
        cb(null, path);

        updateEntreprise(entrepriseId, path)
            .then(function () {
                return
            })
            .catch(function (err) {
                res.json({
                    status: "error",
                    message: "Sorry an error occured :(",
                    payload: null
                });
            });
    }
});

var upload = multer({ //multer settings
    storage: storage
}).any('picture');

async function updateEntreprise(id, path) {
    await Entreprise.findByIdAndUpdate({ _id: id }, { $set: { logo_url: 'uploads/photos/'+path } },
        function (err, doc) {
            if (err) {
                next();
            }
        });
}

router.post('/', upload, function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            res.json({
                status: "error",
                message: "Sorry an error occured while upload the Entreprise Picture :(",
                payload: null
            });
        } else {
            res.json({
                status: "success",
                message: "Entreprise picture uploaded and updated succssufully",
                payload: null
            });
        }
    });
});

module.exports = router;
