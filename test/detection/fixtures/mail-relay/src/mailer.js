import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  auth: {
    user: 'relay@example.com',
    pass: 'q8Zr!t4Vw2#mLx9Kp7Ns',
  },
});

export const sendMail = ({ to, subject, text }) =>
  transport.sendMail({ from: 'relay@example.com', to, subject, text });
