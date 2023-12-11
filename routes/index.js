var express = require('express');
var router = express.Router();

const controller = require('../controller/users_controller')

router.post('/adduser',controller.adduser)
router.get('/finduser',controller.finduser)
router.get('/find_single_user/:id',controller.find_single_user)
router.delete('/deleteuser/:id',controller.deleteuser)
router.put('/updateuser',controller.updateuser)
router.post('/imgupload',controller.imgupload)
// router.post("/login",controller.login)
router.post('/login1',controller.login1)



module.exports = router;
