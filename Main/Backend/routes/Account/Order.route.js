const express = require("express");
const router = express.Router();
const {verifyjwt} = require("../../Middleware/auth.middleware");
const {  createOrder,
  getcreatedorders,
  getApprovedOrders,deleteOrder,editOrder,approveOrder,generateQuotationPdf ,getOrdersCurrentStatus} = require("../../controllers/Account/Order.controller")
// router.post("/create-order " , verifyjwt , createOrder);
// router.get("/get-created-orders" , verifyjwt , getcreatedorders );
// router.post("/approve/:id" , verifyjwt);
// router.post("/get-pdf/:id" , verifyjwt );
// router.get("/get-approved-orders" , verifyjwt , getApprovedOrders);
// router.post("/delete/:id" , verifyjwt,deleteOrder);
// router.put("/edit/:id" , verifyjwt ,editOrder );


router.post("/create-order", createOrder);

router.get("/get-created-orders", getcreatedorders);

router.post("/approve/:id", approveOrder);

router.post("/get-pdf/:id", generateQuotationPdf);

router.get("/get-approved-orders", getApprovedOrders);

router.post("/delete/:id", deleteOrder);

router.put("/edit/:id", editOrder);

router.get("/get-order-status" , getOrdersCurrentStatus);


module.exports = router;