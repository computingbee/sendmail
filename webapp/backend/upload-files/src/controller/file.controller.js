const uploadFile = require("../middleware/upload");
const appConfigs = require("../config/app.configs");
const logger = require("../../logger");

const upload = async (req, res) => {

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var clientIPv4 = ip.replace(/^.*:/, '');

  try {

    await uploadFile(req, res);

    if (req.file == undefined) {
      logger.error("Client IP: " + clientIPv4 + " Error 400: " + "Please upload a file!");
      return res.status(400).send({ message: "Please upload a file!" });
    }

    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
    
  } catch (err) {

    if (err.code == "LIMIT_FILE_SIZE") {
      logger.error("Client IP: " + clientIPv4 + " Error 500: " + "File size cannot be larger than " + appConfigs.attachmentMaxSizeInMB + "MB!");
      return res.status(500).send({
        message: "File size cannot be larger than " + appConfigs.attachmentMaxSizeInMB + "MB!",
      });
    }
	
    logger.error("Client IP: " + clientIPv4 + " Error 500: " + `Could not upload the file: ${err}`);
	
    res.status(500).send({
      message: `Could not upload the file:  ${err}`,
    });
  }
};

module.exports = {
  upload
};