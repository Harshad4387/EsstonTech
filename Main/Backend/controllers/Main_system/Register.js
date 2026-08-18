const bcrypt = require("bcryptjs");
const Company = require("../../models/main_system/company_model");

const registerCompany = async (req, res) => {
  try {

    const {
      companyName,
      companyEmail,
      phoneNumber,
      alternatePhoneNumber,
      address,
      city,
      state,
      country,
      pincode,
      adminName,
      adminEmail,
      adminPassword,
      gstNumber,
      panNumber,
      industryType,
      website,
      companyLogo,
    } = req.body;

    // Check Existing Company
    const existingCompany = await Company.findOne({
      $or: [
        { companyEmail },
        { adminEmail },
        { companyName }
      ]
    });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "Company already exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create Company
    const company = await Company.create({

      companyName,
      companyEmail,
      phoneNumber,
      alternatePhoneNumber,
      address,
      city,
      state,
      country,
      pincode,

      adminName,
      adminEmail,
      adminPassword: hashedPassword,

      gstNumber,
      panNumber,
      industryType,
      website,
      companyLogo,
    });

    return res.status(201).json({
      success: true,
      message: "Company Registered Successfully",
      company,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerCompany,
};