module.exports = {
    HTTPServicePort: 6084,
    CORSOrigins: "https://sendmail.carebmc.com",
    dbURL:"mongodb://sendmailuser:sendmail4321@localhost:37017/sendmail?authSource=sendmail",
    smtpRelayHost: "irelay.carebmc.com",
    smtpRelayPort: 25,
    paginationDefaultLimit: 3,
    paginationDefaultOffset: 0,
    attachmentsUploadDirectory: 'S:/sendmail/uploads/',
	sslKey: 'S:/eClinicalWorks/eBO/c10_64/tomcat/starcarebmc.pem',
	sslCert: 'S:/eClinicalWorks/eBO/c10_64/tomcat/starcarebmc.crt'
}