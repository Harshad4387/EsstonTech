const User = require("../../models/user.model");
const bcrypt = require("bcryptjs");
const generatejwt = require("../../utils/generatetoken");

const Company = require("../../models/main_system/company_model");

const getTenantConnection = require("../../db/tenantDB");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = await generatejwt(user._id, res);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const registerUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role,
      companyEmail
    } = req.body;

    // Validation
    if (
      !name ||
      !email ||
      !password ||
      !companyEmail
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields",
      });
    }

   
    const company = await Company.findOne({
      companyEmail
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Get tenant DB connection
    const tenantDB = await getTenantConnection(
      company.databaseName
    );

    // Create User model from tenant DB
    const User = tenantDB.model(
      "User",
      UserSchema.schema
    );

    // Check existing user
    const existingUser = await User.findOne({
      email
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists with this email.",
      });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      role,
      profilePhoto: "",
    });

    // Generate JWT
    await generatejwt(
      newUser._id,
      company.databaseName,
      res
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      database: company.databaseName,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {

    console.error(
      "Error registering user:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Internal server error while registering user.",
    });
  }
};


module.exports = { loginUser  , registerUser};
