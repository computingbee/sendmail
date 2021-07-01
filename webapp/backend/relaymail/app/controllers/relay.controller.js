const db = require("../models");
const appConfigs = require("../config/app.configs");
const logger = require("../../logger");
const nodemailer = require("nodemailer");

const Email = db.emails;

let transport = nodemailer.createTransport(
    {
        host: appConfigs.smtpRelayHost,
        port: appConfigs.smtpRelayPort
    }
);

const getPagination = (page, size) => {
    const limit = size ? +size : appConfigs.paginationDefaultLimit;
    const offset = page ? page * limit : appConfigs.paginationDefaultOffset;

    return { limit, offset };
}

exports.relay = (req, res) => {

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var clientIPv4 = ip.replace(/^.*:/, '');

    if (!req.body.from) {
        logger.error("Client IP: " + clientIPv4 + " Error 400: " + "From cannot be empty!");
        res.status(400).send({ messsage: "From cannot be empty!" });
        return;
    }
    if (!req.body.to) {
        logger.error("Client IP: " + clientIPv4 + " Error 400: " + "To cannot be empty!");
        res.status(400).send({ messsage: "To cannot be empty!" });
        return;
    }
    if (!req.body.subject) {
        logger.error("Client IP: " + clientIPv4 + " Error 400: " + "Subject cannot be empty!");
        res.status(400).send({ messsage: "Subject cannot be empty!" });
        return;
    }
    if (!req.body.message) {
        logger.error("Client IP: " + clientIPv4 + " Error 400: " + "Message cannot be empty!");
        res.status(400).send({ messsage: "Message cannot be empty!" });
        return;
    }
    if (!req.body.attachments) {
        logger.error("Client IP: " + clientIPv4 + " Error 400: " + "Please attach at least one file!");
        res.status(400).send({ messsage: "Please attach at least one file!" });
        return;
    }

    files = [];
    req.body.attachments.forEach(element => {
        var file = {
            path: appConfigs.attachmentsUploadDirectory + element
        };
        files.push(file);
    });

    const msg = { //message object required by nodemailer
        from: req.body.from,
        to: req.body.to,
        cc: req.body.cc,
        bcc: req.body.bcc,
        subject: req.body.subject,
        html: req.body.message,
        attachments: files
    };

    transport.sendMail(msg, function (err, info) {

        if (err) {
            logger.error("Client IP: " + clientIPv4 + " " + "NodeMailer Error!" + err);
            res.status(500).send({ message: "NodeMailer Error: " + err });
        } else {
            const email = new Email({
                clientIP: clientIPv4,
                from: req.body.from,
                to: req.body.to,
                cc: req.body.cc,
                bcc: req.body.bcc,
                subject: req.body.subject,
                message: req.body.message,
                attachments: req.body.attachments,
                sent: true
            });

            email
                .save(email)
                .then(data => {
                    res.status(200).send(data);
                })
                .catch(err => {
                    logger.error("Client IP: " + clientIPv4 + " " + "Error creating email history!" + err);
                    res.status(500).send({
                        message: err.message || "Error creating email history!"
                    });
                });
        }
    });
};

exports.history = (req, res) => {

    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    var aggEmail = Email.aggregate();

    aggEmail.match({ sent: true });

    Email.aggregatePaginate(aggEmail, { offset, limit, sort: { createdAt: -1 } })
        .then((data) => {
            res.send({
                totalItems: data.totalDocs,
                emails: data.docs,
                totalPages: data.totalPages,
                currentPage: data.page - 1,
            });
        })
        .catch((err) => {
            logger.error("Client IP: " + clientIPv4 + " " + "Unable to retrieve email history!" + err);
            res.status(500).send({
                message:
                    err.message || "Unable to retrieve email history!"
            });
        });
};