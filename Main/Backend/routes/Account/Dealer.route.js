const express = require("express");
const router = express.Router();
const {verifyjwt} = require("../../Middleware/auth.middleware");
const {addDealer,getDealers} = require("../../controllers/Account/Dealer.controller");
router.post("/add"  , addDealer);
router.get("/get-all-dealers"  , getDealers);
module.exports = router;