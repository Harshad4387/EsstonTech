require('dotenv').config();
const express = require("express");
const app = express();
const morgan = require('morgan');
const connect = require("./db/db");
const cors = require('cors');
connect();
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit
    : "50mb" }));

app.use(morgan('dev'));

app.get('/', (req,res)=>{
    res.status(200).json('server is running fine this is the main server');
    console.log("yes done");
    
})
const auth = require("./routes/auth/auth.route");
app.use('/api/auth',auth);

const store_rawMaterial = require("./routes/store/RawMaterial.route");
const store_Product = require("./routes/store/Product.route");
const store_request = require("./routes/store/request.route");
app.use("/api/store/RawMaterial",store_rawMaterial);
app.use("/api/store/Product" , store_Product)

app.use("/api/store/request",store_request)

const admin = require("./routes/Admin/admin.route");
app.use("/api/admin" ,admin);

const production = require("./routes/Production/request.route");
app.use("/api/production" ,production );

const sales = require("./routes/Sales/product.route")
app.use("/api/sales" , sales );

const common = require("./routes/common/common.route");

app.use("/api/common" , common);


const account_dealer = require("./routes/Account/Dealer.route");
app.use("/api/account/dealer" , account_dealer);

const account_order = require("./routes/Account/Order.route");
app.use("/api/account/order" , account_order);
const port = process.env.PORT ;
app.listen(port, ()=>{
    console.log('server is running on port 3001 ~ built by harshu');
})
//https://fc3thch8-3000.inc1.devtunnels.ms/
//https://fc3thch8-3000.inc1.devtunnels.ms/