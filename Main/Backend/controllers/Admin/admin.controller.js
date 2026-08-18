const RawMaterial = require("../../models/RawMaterial.model");
const Product = require("../../models/Product.model");
const User = require("../../models/user.model");
const getAllRawMaterials = async (req, res) => {
  try {
    const materials = await RawMaterial.find().sort({ UniqueId: 1 });
    res.status(200).json({
      success: true,
      count: materials.length,
      data: materials,
    });
  } catch (error) {
    console.error("Error fetching raw materials:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching raw materials.",
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(490).json({
        success: true,
        message: "No products found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    });
  }
};


const getAllProductionWorkers = async (req, res) => {
  try {

    const workers = await User.find({ role: "productionworker" })
      .select("name email profilePhoto role createdAt"); // only needed fields
    if (!workers || workers.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No production workers found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Production workers fetched successfully",
      total: workers.length,
      data: workers,
    });
  } catch (error) {
    console.error("Error fetching production workers:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching production workers",
      error: error.message,
    });
  }
};

// add  new production worker 

module.exports = {getAllRawMaterials , getAllProducts , getAllProductionWorkers};