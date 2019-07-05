const nodemailer = require("nodemailer");
const hbs = require("hbs");
const fs = require("fs");

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SEND_USER,
    pass: process.env.SEND_PASS
  }
});

transport.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

const generateHTML = (filename, options) => {
  const html = hbs.compile(
    fs.readFileSync((__dirname, `./views/mail/${filename}.hbs`), "utf-8")
  );
  return html(options);
};

exports.send = options => {
  const html = generateHTML(options.filename, options);
  const mailOptions = {
    from: " Mexico Art :<noreply@school-management.com>",
    to: options.email,
    subject: options.subject,
    message: options.message,
    html
  };
  return transport.sendMail(mailOptions);
};