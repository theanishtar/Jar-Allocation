const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const bodyParser = require('body-parser');
const http = require('http'); // Import module http
const Redis = require("ioredis");
const db = require("./app/models");
const config = require('./app/config/index');
var dotent = require('dotenv');
const axios = require('axios');

const app = express();
const server = http.createServer(app); // Tạo server từ express app

// Increase the limit to 50MB (or more if needed)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

dotent.config();
app.use(cors());
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true); // Enable proxy trust

//---------- CONFIG SERVER  ---------------------
// set port, listen for requests
const PORT = process.env.PORT || 5152;
const mongodbURI = process.env.MONGODB_URI;
/*----------------------------------------------*/
const web_public_url = process.env.PUBLIC_WEB;
/**--------------------- DB CONNECTIONS -------------------------*/
const connectionStatus = {
  mongoDB: false
}

db.mongoose
  .connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    connectionStatus.mongoDB = true;
    console.log("Successfully connect to MongoDB." + mongodbURI);
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

/*-------------------------- ROUTES ------------------- */
app.get('/', (req, res) => {
  res.json({
    live: "Hello server is live",
    connection: connectionStatus
  });
});


require("./app/routes/potara.route")(app, web_public_url);

//Thay vì sử dụng app.listen, sử dụng server.listen để sử dụng cùng một cổng cho cả express app và Socket.IO:
server.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}.`);
});