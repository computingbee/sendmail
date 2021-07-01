const util = require("util");
const multer = require("multer");

const appConfigs   = require("../config/app.configs");

const maxSize = appConfigs.attachmentMaxSizeInMB * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, appConfigs.attachmentsUploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;