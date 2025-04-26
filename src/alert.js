const fs = require('fs-extra');
const nodemailer = require('nodemailer');
const logs = require("../data/log.json");
const secrets = require('../secrets.json');

(async() => {
  // only do something if we have logs to do alert to
  if (logs.length > 0) {
    console.log('⛈️  Logs found, something has been failing');

    // connect to smtp server to send an email
    const transporter = nodemailer.createTransport({
      service: "Mailgun",
      auth: {
        user: `postmaster@${secrets.mailgun.domain}`,
        pass: secrets.mailgun.password
      }
    });

    // send an email to me with all the errors
    transporter.sendMail({
      from: `no-reply@${secrets.mailgun.domain}`,
      to: secrets.mailgun.to,
      subject: `Interactive Alerts – ${logs.length} new error${logs.length !== 1 ? 's' : ''}`,
      html: logs.map(log => {
        return `<h3>${log.publication} at ${log.timestamp}</h3> <code>${log.error}</code>`
      }).join('<br />')
    });

    // clear the file
    fs.writeFileSync("./data/log.json", "[]");
  } else {
    console.log('☀️  No logs found, everything good')
  }

})()
