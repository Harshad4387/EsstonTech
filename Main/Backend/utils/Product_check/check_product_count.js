const Product = require("../../models/Product.model");
const getRequiredProductionRequests = async (products) => {


  const requests = [];

  for (const item of products) {

    const productDoc = await Product.findById(item.product);

    if (!productDoc) {
      continue;
    }

    // Ordered quantity
    const orderedQty = item.quantity;

    // Available stock
    const availableQty = productDoc.quantity;

    // Quantity needed for production
    const requiredQty = orderedQty - availableQty;

    // If stock is insufficient
    if (requiredQty > 0) {

      requests.push({
        product: item.product,
        requiredQuantity: requiredQty
      });

    }
  }

  return requests;
};