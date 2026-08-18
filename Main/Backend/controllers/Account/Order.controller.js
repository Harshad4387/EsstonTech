const Order = require("../../models/Order.Model");
const Product = require("../../models/Product.model");
const ProductionRequest = require("../../models/Request");
const RawMaterial = require("../../models/RawMaterial.model");
const puppeteer = require("puppeteer-core");

const createOrder = async (req, res) => {
  try {

    const {
      dealer,
      products = [],
      rawMaterials = [],
      remarks,
      compleletion_date,
      arrival_date
    } = req.body;

    let grandTotal = 0;

    const orderProducts = [];
    const orderRawMaterials = [];

   
    for (const item of products) {

      const productExists = await Product.findById(item.product);

      if (!productExists) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      const quantity = Number(item.quantity);
      const price = Number(item.price);
      const discount = Number(item.discount || 0);

      const totalAmount =
        (quantity * price) -
        ((quantity * price) * discount / 100);

      grandTotal += totalAmount;

      orderProducts.push({
        product: item.product,
        quantity,
        price,
        discount,
        totalAmount
      });
    }

   
    for (const item of rawMaterials) {

      const rawMaterialExists = await RawMaterial.findById(item.rawMaterial);

      if (!rawMaterialExists) {
        return res.status(404).json({
          success: false,
          message: "Raw Material not found"
        });
      }

      const quantity = Number(item.quantity);
      const price = Number(item.price);
      const discount = Number(item.discount || 0);

      const totalAmount =
        (quantity * price) -
        ((quantity * price) * discount / 100);

      grandTotal += totalAmount;

      orderRawMaterials.push({
        rawMaterial: item.rawMaterial,
        quantity,
        price,
        discount,
        totalAmount
      });
    }

    // ✅ Create Order
    const order = new Order({
      dealer,
      products: orderProducts,
      rawMaterials: orderRawMaterials,
      grandTotal,
      remarks,
      compleletion_date,
      arrival_date
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });

  }
};

const getApprovedOrders = async (req, res) => {
  try {

    const orders = await Order.find({
      status: "approved"
    })
      .populate("dealer")
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

const getcreatedorders = async (req, res) => {
  try {

    const orders = await Order.find({
      status: "pending"
    })
      .populate("dealer")
      .populate("products.product")
      .populate("rawMaterials.rawMaterial")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

const approveOrder = async (req, res) => {
  try {

    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.status = "approved";

    for (const item of order.products) {

      const productDoc = await Product.findById(item.product);

      if (!productDoc) {
        continue;
      }

      const orderedQty = item.quantity;

      const availableQty = productDoc.quantity;

      // Stock available
      const readyQty = Math.min(orderedQty, availableQty);

      // Need manufacturing
      const manufacturingQty =
        orderedQty > availableQty
          ? orderedQty - availableQty
          : 0;


      item.readyQuantity = readyQty;

      item.manufacturingQuantity = manufacturingQty;

      // Create request only if needed
      if (manufacturingQty > 0) {

        const newRequest = new ProductionRequest({
          product: item.product,
          // requestedBy: req.user.id,
          quantity: manufacturingQty,
          status: "pending"
        });

        await newRequest.save();

        item.productionRequest = newRequest._id;
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order approved successfully",
      order
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });

  }
};

const deleteOrder = async (req, res) => {
  try {

    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Delete linked production requests
    for (const item of order.products) {

      if (item.productionRequest) {

        await ProductionRequest.findByIdAndDelete(
          item.productionRequest
        );
      }
    }

    // Delete order
    await Order.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });

  }
};


const editOrder = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      dealer,
      products = [],
      rawMaterials = [],
      remarks,
      compleletion_date,
      arrival_date
    } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    let grandTotal = 0;

    const updatedProducts = [];
    const updatedRawMaterials = [];

    // Update Products
    for (const item of products) {

      const productExists = await Product.findById(item.product);

      if (!productExists) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      const quantity = Number(item.quantity);

      const price = Number(item.price);

      const discount = Number(item.discount || 0);

      const totalAmount =
        (quantity * price) -
        ((quantity * price) * discount / 100);

      grandTotal += totalAmount;

      updatedProducts.push({
        product: item.product,
        quantity,
        price,
        discount,
        totalAmount
      });
    }

    
    for (const item of rawMaterials) {

      const rawMaterialExists =
        await RawMaterial.findById(item.rawMaterial);

      if (!rawMaterialExists) {
        return res.status(404).json({
          success: false,
          message: "Raw Material not found"
        });
      }

      const quantity = Number(item.quantity);

      const price = Number(item.price);

      const discount = Number(item.discount || 0);

      const totalAmount =
        (quantity * price) -
        ((quantity * price) * discount / 100);

      grandTotal += totalAmount;

      updatedRawMaterials.push({
        rawMaterial: item.rawMaterial,
        quantity,
        price,
        discount,
        totalAmount
      });
    }

    // Update Order
    order.dealer = dealer || order.dealer;

    order.products = updatedProducts;

    order.rawMaterials = updatedRawMaterials;

    order.grandTotal = grandTotal;

    order.remarks = remarks;

    order.compleletion_date = compleletion_date;

    order.arrival_date = arrival_date;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });

  }
};


const generateQuotationPdf = async (req, res) => {
  try {

    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("dealer")
      .populate("products.product")
      .populate("rawMaterials.rawMaterial");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const html = `
    <!DOCTYPE html>
    <html>

    <head>

      <style>

        body{
          font-family: Arial, sans-serif;
          background:#f4f6f9;
          padding:40px;
        }

        .invoice-box{
          max-width:900px;
          margin:auto;
          background:white;
          padding:40px;
          border-radius:12px;
          box-shadow:0 0 10px rgba(0,0,0,0.1);
        }

        .header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:40px;
          border-bottom:2px solid #27ae60;
          padding-bottom:20px;
        }

        .company{
          font-size:34px;
          font-weight:bold;
          color:#2c3e50;
        }

        .quotation{
          font-size:34px;
          font-weight:bold;
          color:#27ae60;
        }

        .details{
          margin-bottom:30px;
          line-height:2;
          font-size:16px;
        }

        .section-title{
          margin-top:30px;
          margin-bottom:10px;
          font-size:22px;
          font-weight:bold;
          color:#2c3e50;
        }

        table{
          width:100%;
          border-collapse:collapse;
        }

        th{
          background:#2c3e50;
          color:white;
          padding:14px;
          font-size:15px;
        }

        td{
          padding:14px;
          border:1px solid #ddd;
          text-align:center;
        }

        tr:nth-child(even){
          background:#f8f8f8;
        }

        .total-section{
          margin-top:30px;
          text-align:right;
        }

        .grand-total{
          font-size:28px;
          font-weight:bold;
          color:#27ae60;
        }

        .remarks{
          margin-top:40px;
          background:#f4f4f4;
          padding:20px;
          border-radius:10px;
        }

        .footer{
          margin-top:80px;
          text-align:right;
          font-size:16px;
        }

      </style>

    </head>

    <body>

      <div class="invoice-box">

        <div class="header">

          <div class="company">
            Esston Technology
          </div>

          <div class="quotation">
            QUOTATION
          </div>

        </div>

        <div class="details">

          <strong>Dealer Name:</strong>
          ${order.dealer?.name || ""}

          <br>

          <strong>Order ID:</strong>
          ${order._id}

          <br>

          <strong>Date:</strong>
          ${new Date(order.orderDate).toLocaleDateString()}

        </div>

        <!-- Products -->

        <div class="section-title">
          Products
        </div>

        <table>

          <thead>

            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Total</th>
            </tr>

          </thead>

          <tbody>

            ${order.products.map(item => `
              <tr>

                <td>${item.product?.name || ""}</td>

                <td>${item.quantity}</td>

                <td>₹${item.price}</td>

                <td>${item.discount || 0}%</td>

                <td>₹${item.totalAmount}</td>

              </tr>
            `).join("")}

          </tbody>

        </table>

        <!-- Raw Materials -->

        ${
          order.rawMaterials.length > 0
          ?
          `
          <div class="section-title">
            Raw Materials
          </div>

          <table>

            <thead>

              <tr>
                <th>Raw Material</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Total</th>
              </tr>

            </thead>

            <tbody>

              ${order.rawMaterials.map(item => `
                <tr>

                  <td>${item.rawMaterial?.name || ""}</td>

                  <td>${item.quantity}</td>

                  <td>₹${item.price}</td>

                  <td>${item.discount || 0}%</td>

                  <td>₹${item.totalAmount}</td>

                </tr>
              `).join("")}

            </tbody>

          </table>
          `
          :
          ""
        }

        <div class="total-section">

          <div class="grand-total">
            Grand Total : ₹${order.grandTotal}
          </div>

        </div>

        <div class="remarks">

          <strong>Remarks:</strong>

          <p>
            ${order.remarks || "No Remarks"}
          </p>

        </div>

        <div class="footer">

          <strong>
            Authorized Signature
          </strong>

        </div>

      </div>

    </body>

    </html>
    `;

    const browser = await puppeteer.launch({

      headless: true,

      executablePath:
        "C:/Program Files/Google/Chrome/Application/chrome.exe"

    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "domcontentloaded"
    });

    const pdfBuffer = await page.pdf({

      format: "A4",

      printBackground: true

    });

    await browser.close();

    res.set({

      "Content-Type": "application/pdf",

      "Content-Disposition":
        `inline; filename=quotation-${order._id}.pdf`,

      "Content-Length": pdfBuffer.length

    });

    res.send(pdfBuffer);

  } catch (error) {

    res.status(500).json({

      success: false,

      message: "Server Error",

      error: error.message

    });

  }
};


const getOrdersCurrentStatus = async (req, res) => {
  try {

    const orders = await Order.find()

      .populate("dealer")

      .populate("products.product")

      .populate("products.productionRequest")

      .sort({ createdAt: -1 });

    const updatedOrders = [];

    for (const order of orders) {

      let hasManufacturing = false;

      let allCompleted = true;

      let allReceived = true;

      // Product response
      const productsResponse = [];

      for (const item of order.products) {

        let productCurrentStatus = "ready";

        if (item.productionRequest) {

          const requestStatus =
            item.productionRequest.status;

          productCurrentStatus = requestStatus;

          // Manufacturing states
          if (
            requestStatus === "accepted" ||
            requestStatus === "materials_collected" ||
            requestStatus === "in_progress"
          ) {

            hasManufacturing = true;
          }

          // Not completed yet
          if (
            requestStatus !== "completed" &&
            requestStatus !== "received"
          ) {

            allCompleted = false;
          }

          // Not delivered yet
          if (requestStatus !== "received") {

            allReceived = false;
          }
        }

        productsResponse.push({

          product: {
            _id: item.product?._id,
            name: item.product?.name
          },

          quantity: item.quantity,

          readyQuantity:
            item.readyQuantity,

          manufacturingQuantity:
            item.manufacturingQuantity,

          currentStatus:
            productCurrentStatus,

          price: item.price,

          discount: item.discount,

          totalAmount:
            item.totalAmount
        });
      }

      // Update order status
      if (allReceived) {

        order.status = "delivered";
      }

      else if (allCompleted) {

        order.status = "completed";
      }

      else if (hasManufacturing) {

        order.status = "manufacturing";
      }

      else {

        order.status = "approved";
      }

      await order.save();

      updatedOrders.push({

        _id: order._id,

        status: order.status,

        dealer: {
          _id: order.dealer?._id,
          name: order.dealer?.name
        },

        products: productsResponse,

        grandTotal: order.grandTotal,

        remarks: order.remarks,

        orderDate: order.orderDate,

        compleletion_date:
          order.compleletion_date,

        arrival_date:
          order.arrival_date

      });
    }

    res.status(200).json({

      success: true,

      count: updatedOrders.length,

      orders: updatedOrders

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: "Server Error",

      error: error.message

    });

  }
};


module.exports = {
  createOrder,
  getcreatedorders,
  getApprovedOrders,
  approveOrder,
  deleteOrder,
  editOrder,
  generateQuotationPdf,
  getOrdersCurrentStatus
};