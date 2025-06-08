import { Resend } from 'resend';

class EmailService {
    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
        this.fromEmail = 'Acme <onboarding@resend.dev>';
    }

    // Send password reset email
    async sendPasswordResetEmail(user, resetToken) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        
        // Log the reset URL for verification (remove in production)
        console.log('Reset URL:', resetUrl);
        
        try {
            await this.resend.emails.send({
                from: this.fromEmail,
                to: user.email,
                subject: 'Reset Your TaskFlow Password',
                html: this.getPasswordResetTemplate(user.name, resetUrl)
            });
            return true;
        } catch (error) {
            console.error('Error sending password reset email:', error);
            throw new Error('Failed to send password reset email');
        }
    }

    // Email templates
    getPasswordResetTemplate(userName, resetUrl) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333; text-align: center;">Reset Your Password</h1>
                <p style="color: #666; font-size: 16px; line-height: 1.5;">
                    Hello ${userName},
                </p>
                <p style="color: #666; font-size: 16px; line-height: 1.5;">
                    We received a request to reset your password for your TaskFlow account. Click the button below to reset it:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background-color: #00FFFF; color: #0A0A0A; padding: 12px 24px; 
                              text-decoration: none; border-radius: 6px; font-weight: bold;
                              display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p style="color: #666; font-size: 14px; line-height: 1.5;">
                    This link will expire in 1 hour. If you didn't request this password reset, 
                    you can safely ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">
                    This is an automated message, please do not reply to this email.
                </p>
            </div>
        `;
    }

    // Add more email templates and methods here as needed
    // For example:
    // - Welcome email
    // - Account verification
    // - Task notifications
    // - etc.
}

// Export a singleton instance
export default new EmailService(); 