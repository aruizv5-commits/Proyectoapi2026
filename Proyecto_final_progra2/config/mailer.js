const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "adriruizvega@gmail.com",
    // eslint-disable-next-line no-undef
    clientId: process.env.GOOGLE_CLIENT_ID,
    // eslint-disable-next-line no-undef
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // eslint-disable-next-line no-undef
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },

  tls: {
    rejectUnauthorized: false
  }
});


module.exports = transporter;