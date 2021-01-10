var express = require('express');
var router = express.Router();
var Contact = require('../db/models/contact-schemas');

router.post('/send', async function (req, res) {
    let new_contact=req.body;
    await Contact.create(new_contact, function (err, result) {
        if (err)
            res.json({
                status: "failed",
                message: "failed to send your form !!",
                payload: null
            });
        else
            res.json({
                status: "success",
                message: "Your Opinion sended successfully!!!",
                payload: result
            });

    });
});

router.get('/all', async function (req, res) {
    await Contact.find({}, function (err, contacts) {
        if (err) {
            res.json({
                status: "error",
                message: "error to get contacts",
                payload: null
            });
        }
        res.json({
            status: "success",
            message: "All contact",
            payload: contacts
        });
    });
});

// Delete User
router.delete('/delete/:id',async function(req,res){
    let contactId=req.params.id;
    await Contact.findByIdAndRemove(contactId,function(err,doc){
        if(err){
        res.json({
          status: "error",
          message: "Fail to delete the contact",
          payload: null
        });
      } else {
        res.json({
          status: "success",
          message: "Contact deleted successfully",
          payload: doc
        });
      }
    });
  });
  

module.exports=router;