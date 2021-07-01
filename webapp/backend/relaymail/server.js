const cors = require("cors");
const express = require("express");
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");
const compression = require("compression");

const appConfigs = require("./app/config/app.configs");
const logger = require("./logger");

const app = express();

var corsOptions = {
  origin: appConfigs.CORSOrigins
};

app.use(cors(corsOptions));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    logger.info("Connected to Mongo DB");
  })
  .catch(err => {
    logger.error("Cannot connect to the database", err);
    process.exit();
  });

require("./app/routes/relay.routes")(app);

const port = appConfigs.HTTPServicePort;
const sslkey = appConfigs.sslKey;
const sslcert = appConfigs.sslCert

https.createServer({
	key: fs.readFileSync(sslkey),
	cert: fs.readFileSync(sslcert)
}, app)
.listen(port, () => {
  logger.info(`RelayMail running at localhost:${port}`);
}); 

/*app.listen(port, () => {
  logger.info(`RelayMail running at localhost:${port}`);
});
*/