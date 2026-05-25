const express = require("express");
const router = express.Router();
const {getAllRawMaterials,InwardRawMaterial,getRawMaterialsByCategory} = require("../../controllers/store/RawMaterial.controller");

const {verifyjwt} = require("../../Middleware/auth.middleware");

router.post("/inward", verifyjwt, InwardRawMaterial);
// router.get("/getRawmaterial" , verifyjwt ,getAllRawMaterials );
router.get("/getRawmaterial"  ,getAllRawMaterials );
router.get("/category/:category", getRawMaterialsByCategory);
module.exports = router;