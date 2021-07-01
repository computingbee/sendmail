const cors = require("cors");
const express = require("express");
const https = require("https");
const fs = require("fs");
const compression = require("compression");

const appConfigs = require("./src/config/app.configs");
const initRoutes = require("./src/routes");
const logger = require("./logger");

const app = express();

var corsOptions = {
  origin: appConfigs.CORSOrigins
};

app.use(cors(corsOptions));
app.use(compression());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Upload File REST API" })
});

initRoutes(app);

let port = appConfigs.HTTPServicePort;
let sslkey = appConfigs.sslKey;
let sslcert = appConfigs.sslCert

https.createServer({
	key: fs.readFileSync(sslkey),
	cert: fs.readFileSync(sslcert)
}, app)
.listen(port, () => {
  logger.info(`Upload-File running at localhost:${port}`);
}); 

/*
app.listen(port, () => {
  logger.info(`Upload-File running at localhost:${port}`);
});
*/