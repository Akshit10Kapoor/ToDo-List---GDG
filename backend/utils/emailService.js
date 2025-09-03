const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendOTP(email, otp, userName) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Project Manager - Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #3b82f6; color: white; padding: 20px; border-radius: 10px 10px 0 0;">
            <h2 style="margin: 0;">Project Manager</h2>
          </div>
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
            <h3 style="color: #1e293b; margin-bottom: 20px;">Hello ${userName}!</h3>
            <p style="color: #475569; margin-bottom: 20px;">
              Welcome to Project Manager! Please use the following OTP to verify your email address:
            </p>
            <div style="background-color: #3b82f6; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 8px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
              This OTP will expire in 10 minutes. If you didn't request this, please ignore this email.
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, message: 'Failed to send OTP' };
    }
  }

  async sendWelcomeEmail(email, userName) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Project Manager!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #10b981; color: white; padding: 20px; border-radius: 10px 10px 0 0;">
            <h2 style="margin: 0;">Welcome to Project Manager! 🎉</h2>
          </div>
          <div style="background-color: #f0fdf4; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #bbf7d0;">
            <h3 style="color: #1e293b; margin-bottom: 20px;">Hello ${userName}!</h3>
            <p style="color: #475569; margin-bottom: 20px;">
              Congratulations! Your email has been verified successfully. You're now ready to start managing your projects efficiently.
            </p>
            <div style="margin: 30px 0;">
              <h4 style="color: #059669; margin-bottom: 10px;">What you can do now:</h4>
              <ul style="color: #475569;">
                <li>Create and manage multiple projects</li>
                <li>Add tasks and track progress</li>
                <li>Monitor your activity feed</li>
                <li>Collaborate with team members</li>
              </ul>
            </div>
            <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
              Happy project managing! 🚀
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true, message: 'Welcome email sent successfully' };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, message: 'Failed to send welcome email' };
    }
  }
}

module.exports = new EmailService();