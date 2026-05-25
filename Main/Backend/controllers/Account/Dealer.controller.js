const Dealer = require("../../models/Dealer.model");

const addDealer = async (req, res) => {
  try {
    const {
      phoneNumber,
      name,
      address,
      information
    } = req.body;

    const existingDealer = await Dealer.findOne({ phoneNumber });

    if (existingDealer) {
      return res.status(400).json({
        success: false,
        message: "Dealer already exists"
      });
    }

    const dealer = new Dealer({
      phoneNumber,
      name,
      address,
      information
    });

    await dealer.save();

    res.status(201).json({
      success: true,
      message: "Dealer added successfully",
      dealer
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

const getDealers = async (req, res) => {
  try {

    const dealers = await Dealer.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: dealers.length,
      dealers
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
  addDealer,
  getDealers
};