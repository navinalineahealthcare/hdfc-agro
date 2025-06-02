import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import { env } from "../../env";
const options = {
  host: env.mail.host,
  port: env.mail.port,
  secure: env.mail.port === 465 ? true : false,
  auth: {
    user: env.mail.username,
    pass: env.mail.password,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const transporter = nodemailer.createTransport(options);

transporter.use(
  "compile",
  hbs({
    viewPath: `${env.app.root_dir}/views/email`,
    extName: ".hbs",
    viewEngine: {
      extname: ".hbs", // handlebars extension
      layoutsDir: `${env.app.root_dir}/views/email/`, // location of handlebars templates
      defaultLayout: "layout", // name of main template
      // defaultLayout: false,
      partialsDir: `${env.app.root_dir}/views/email/`, // location of your subtemplates aka. header, footer etc
    },
  })
);

export default transporter;

export async function testSMTP() {
  try {
    await transporter.verify();
    console.log("SMTP server is ready to take messages");
  } catch (error) {
    console.error("SMTP connection failed:", error);
  }
}
