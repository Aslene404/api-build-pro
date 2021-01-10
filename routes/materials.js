const express = require('express');
const router = express.Router();
const Material = require('../db/models/material-schema');
const helpers = require('../helpers/user-validation');
const { check, validationResult } = require('express-validator');


const materialService = require('../services/material-service')(Material);



// @ts-check
// POST /addMaterial
router.post('/addmaterial/:projectId', async function (req, res, next) {
    let projectId=req.params.projectId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({
        status: "fail",
        message: errors.array(),
        payload: null
      });
    } else {
      let {
        ...material
      } = req.body;
    
      try {
        let response = await materialService.addMaterial(projectId,material);
        console.log(response);
        res.json(response);
      } catch (error) {
        next(error)
      }

    }
  }

);


// @ts-check
// GET / get All materials
router.get('/', helpers.validateUser, helpers.isAdmin, async function (req, res, next) {
  try {
    let response = await materialService.getAllMaterials();
    if (response) {
      res.json(response)
    }
  } catch (error) {
    next(error)
  }
});


/**
 * Get Material By Id
 * GET /material/:id
 */

router.get('/material/:id', helpers.validateUser, async function (req, res,next) {
  let id = req.params.id;
  try {
    let response = await materialService.getMaterialById(id);
    if (response) {
      return res.json(response);
    }
  } catch (error) {
    next(error);
  }

})


// Update Material Info
// PUT /update/:id
router.put('/update/:id', helpers.validateUser, async function (req, res,next) {
  if (
    !req.body.hasOwnProperty('materialname') &&
    !req.body.hasOwnProperty('quantity') &&
    !req.body.hasOwnProperty('status')) {
    res.status(422).json({
      status: "error",
      message: 'You Should send materialname and/or quantity and/or status',
      payload: null
    });
  } else {
    let materialId = req.params.id;
    let material = {
      ...req.body
    };

    try {
      let response = await materialService.updateMaterial(materialId, material);
      if (response) {
        res.json(response);
      }
    } catch (error) {
      next(error);
    }

  }
});









// Delete Material
// DELETE /delete/:id
router.delete('/delete/:id', async function (req, res, next) {
  let id = req.params.id;
  try {
    let response = await materialService.deleteMaterial(id);
    if(response){
      res.json(response);
    }
  } catch (error) {
    next(error);
  }
});


module.exports = router;