import transporter from "../../libs/mail/mail";
import { env } from "../../env";
import { SendMailOptions } from "nodemailer";

export interface TemplateMailOptions extends SendMailOptions {
  template: string;
  context: Record<string, any>;
}

interface SendMailJobData {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

export const MailService = {
  async queueForgotPasswordEmail(to: string, context: Record<string, any>) {
    const jobData: SendMailJobData = {
      to,
      subject: "Reset your password",
      template: "forgotPassword",
      context,
    };

    await this.sendMailNow(jobData);
  },

  async sendMailNow({ to, subject, template, context }: SendMailJobData) {
    
    const mailOptions: TemplateMailOptions = {
      from: env.mail.from_address,
      to,
      subject,
      template,
      context,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error: any) {
      console.error("Email sending failed:", error);
      throw new Error("Failed to send email");
    }
  },
};
