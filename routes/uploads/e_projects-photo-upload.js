var express = require('express');
var multer = require('multer');
var router = express.Router();
var e_projects = require('../../db/models/e_projects-schemas');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/photos');
    },
    filename: function (req, file, cb) {
        var e_projectsId = req.body.id;
        var path = file.fieldname + '-' + Date.now() + '-'+e_projectsId + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
        cb(null, path);

        updateE_projects(e_projectsId, path)
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

async function updateE_projects(id, path) {
    await e_projects.findByIdAndUpdate({ _id: id }, { $set: { photo_url: 'uploads/photos/'+path } },
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
                message: "Sorry an error occured while upload the E_projects Picture :(",
                payload: null
            });
        } else {
            res.json({
                status: "success",
                message: "E_projects picture uploaded and updated succssufully",
                payload: null
            });
        }
    });
});

module.exports = router;
