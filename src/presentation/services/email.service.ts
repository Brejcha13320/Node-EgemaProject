import nodemailer, { Transporter } from "nodemailer";
import { SendMailOptions } from "../../domain";

export class EmailService {
  private transporter: Transporter;

  constructor(
    MAILER_SERVICE: string,
    MAILER_EMAIL: string,
    MAILER_SECRET_KEY: string,
    private readonly SEND_EMAIL: boolean
  ) {
    this.transporter = nodemailer.createTransport({
      service: MAILER_SERVICE,
      auth: {
        user: MAILER_EMAIL,
        pass: MAILER_SECRET_KEY,
      },
    });
  }

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachements = [] } = options;

    try {
      if (!this.SEND_EMAIL) return true;

      const sentInformation = await this.transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachements,
      });

      // console.log(sentInformation);

      return true;
    } catch (error) {
      return false;
    }
  }
}
