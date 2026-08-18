// const jwt = require("jsonwebtoken");

// const generatejwt = async (userid , res)=>{
//     const token = await jwt.sign({userid}, process.env.JWT_TOKEN_SECRET , {
//        expiresIn : process.env.JWT_TOKEN_EXPIRY
//     });

//     const options = {
//   httpOnly: true,
//   secure: true,
//   sameSite: 'None', 
// };

//    res.cookie("jwt", token, options); 
//     return token;
// };


// module.exports = generatejwt;

const jwt = require("jsonwebtoken");

const generatejwt = async (
  userid,
  dbName,
  res
) => {

  const token = await jwt.sign(
    {
      userid,
      dbName,
    },
    process.env.JWT_TOKEN_SECRET,
    {
      expiresIn:
        process.env.JWT_TOKEN_EXPIRY,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res.cookie("jwt", token, options);

  return token;
};

module.exports = generatejwt;
