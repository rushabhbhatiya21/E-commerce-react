const bodyParser  = require('body-parser');
const mongoose = require('mongoose');
const router = require("./controll/router");
const cookieParser = require("cookie-parser");
require('dotenv').config();
const cors = require('cors')


const express = require('express');
const server = express();

main().catch(err => console.log(err));
async function main(){
    
  mongoose.connect(process.env.URI, {
    useUnifiedTopology: true,
  })
    .catch((error) => {
      console.error('Error connecting to MongoDB Atlas:', error);
    });
}
// server.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
server.use(cors({credentials:true, origin:"http://localhost:5173"}));
server.use(cookieParser());

server.use(bodyParser.json());
server.use(express.urlencoded({extended: true}));
server.use("/", router);

server.listen(8081, ()=>{
    console.log("server started");
})
