const express = require("express");
const router = express.Router();
const {getAllRawMaterials,getAllProducts , getAllProductionWorkers} = require("../../controllers/Admin/admin.controller");
const {verifyjwt} = require("../../Middleware/auth.middleware");
router.get("/get-all-raw-material" , verifyjwt , getAllRawMaterials);
router.get("/get-all-products", verifyjwt ,getAllProducts );
router.get("/get-production-workers" , verifyjwt ,getAllProductionWorkers);
// add new production worker -- /add-production-worker
// add new route for change account password  for each role -- (name , email , role , password)

module.exports = router;