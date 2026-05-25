const express = require("express");
const router = express.Router();
const {getAllProducts,getHistoryofProduct} = require("../../controllers/store/Product.controlller");
const {verifyjwt} = require("../../Middleware/auth.middleware");

// router.get("/getProducts" ,verifyjwt ,getAllProducts );
router.get("/getProducts"  ,getAllProducts );
router.get("/getHistory/:id" , verifyjwt , getHistoryofProduct);
module.exports = router; 