// utils/sendVerificationEmail.js
import nodemailer from 'nodemailer';

export const senderVerificationEmail = async (userEmail, verificationUrl) => {
  try {
    // 1. Transporter object ko Brevo ki details ke saath configure karein
    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_SMTP_HOST,
      port: process.env.BREVO_SMTP_PORT,
      secure: false, // Port 587 ke liye 'false' istemal hota hai, kyunki connection STARTTLS par upgrade hota hai
      auth: {
        user: process.env.BREVO_SMTP_USER, // .env se Brevo ka login uthayein
        pass: process.env.BREVO_SMTP_PASS, // .env se Brevo ka password (API key) uthayein
      },
    });

    // 2. Email options (Yeh bilkul waise hi rahenge)
    const mailOptions = {
      from: `"E-commerce" <${process.env.SENDER_EMAIL}>`, // From mein verified sender ka email
      to: userEmail,
      subject: 'Verify Your Email Address',
      html: `<p>Please click on the link below to verify your email address:</p>
             <a href="${verificationUrl}">${verificationUrl}</a>`,
    };

    // 3. Email bhejein
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully using Brevo SMTP.');

  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Could not send verification email.');
  }
};

export default senderVerificationEmail;