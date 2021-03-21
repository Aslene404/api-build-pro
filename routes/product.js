var express = require('express');
var router = express.Router();
var Product = require('../db/models/product-schemas');

router.post('/send', async function (req, res) {

    let new_product = req.body;
    let product = await Product.create(new_product);
    if (!product) {
        res.json({
            status: "failed",
            message: "Echec d'envoi de votre demande",
            payload: null
        });
    }
    else {
        res.json({
            status: "success",
            message: "Votre product est ajoutée avec succès",
            payload: product
        });
    }
});

router.get('/all', async function (req, res) {
    await Product.find({}, function (err, products) {
        if (err) {
            res.json({
                status: "error",
                message: "Echec d'obtenir les products",
                payload: null
            });
        }
        res.json({
            status: "success",
            message: "Tout les products",
            payload: products
        });
    });
});


//Get Product By Id
router.get('/:id', async function (req, res) {
    let id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
        res.json({
            status: "error",
            message: "Echec d'obtenir les products",
            payload: null
        });
    } else {
        res.json({
            status: "success",
            message: "Product",
            payload: product
        });
    }

});


// Update Product 
router.patch('/update/:id', async function (req, res) {
    let productId = req.params.id;
    //let e_projects = req.body.e_projects ? req.body.e_projects : []; 
    const { ...product } = req.body;

    if (!product) {
        res.json({
            status: "error",
            message: "There is no field to update",
            payload: null
        });
    } else {
        const updatedProduct = await Product.findByIdAndUpdate(productId, product);
        const result = await Product.findById(productId);
        if (!updatedProduct) {
            res.json({
                status: "error",
                message: "Fail to Update Product fields",
                payload: null
            });
        } else {
            res.json({
                status: "success",
                message: "Product Successfully Updated",
                payload: result
            });
        }
    }



});
// Update Product's projects 
router.put('/update/:id', async function (req, res) {
    const productId = req.params.id;
    const projectId = req.body.projectId;
    

    const theProduct = await Product.findById(productId).exec();
    if (theProduct) {
        theProduct.projects.push(projectId);
        try {
            await theProduct.save();
            return res.json({
                status: "success",
                message: "Product's projects Updated successfully",
                payload: theProduct
            });
        } catch (error) {
            res.json({
                status: "error",
                message: "Fail to Update Product's projects :(",
                payload: null
            });
        }
    }
});

// Delete User
router.delete('/delete/:id', async function (req, res) {
    let productId = req.params.id;
    await Product.findByIdAndRemove(productId, function (err, doc) {
        if (err) {
            res.json({
                status: "error",
                message: "Echec de supprimer l'product",
                payload: null
            });
        } else {
            res.json({
                status: "success",
                message: "Product supprimé avec succès",
                payload: doc
            });
        }
    });
});


module.exports = router;