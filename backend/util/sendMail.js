import { createTransport } from "nodemailer";

export const sendEmail = async (options) => {
  const transporter = createTransport({
    service: process.env.SMPT_MAIL_HOST,

    auth: {
      user: process.env.SMPT_MAIL,
      pass: "egnchfzuqejhjshj",
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options?.email,
    subject: options?.subject,
    text: options?.message,
  };

  await transporter.sendMail(mailOptions);
};
