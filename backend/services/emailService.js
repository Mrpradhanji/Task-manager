import { Resend } from 'resend';

class EmailService {
    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
        this.fromEmail = 'Acme <onboarding@resend.dev>';
    }

    // Send password reset email
    async sendPasswordResetEmail(user, resetToken) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        
        // Log the reset URL for verification
        console.log('Generated reset URL:', resetUrl);
        console.log('Reset token length:', resetToken.length);
        
        try {
            await this.resend.emails.send({
                from: this.fromEmail,
                to: user.email,
                subject: 'Reset Your RTASK Password',
                html: this.getPasswordResetTemplate(user.name, resetUrl)
            });
            console.log('Reset email sent successfully to:', user.email);
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
                    We received a request to reset your password for your RTASK account. Click the button below to reset it:
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
//  ---------------------------- *************************************************---------------------------------------// 
//Need verified domain to send this email and i have notanay domain
    // Send welcome email
    async sendWelcomeEmail(user) {
        console.log('Attempting to send welcome email to:', user.email);
        console.log('Using from email:', this.fromEmail);
        
        try {
            const response = await this.resend.emails.send({
                from: this.fromEmail,
                to: user.email,
                subject: 'Welcome to RTASK!',
                html: this.getWelcomeTemplate(user.name)
            });
            console.log('Welcome email sent successfully:', response);
            return true;
        } catch (error) {
            console.error('Detailed error sending welcome email:', {
                error: error.message,
                code: error.code,
                stack: error.stack
            });
            throw new Error('Failed to send welcome email');
        }
    }

    // Welcome email template
    getWelcomeTemplate(userName) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333; text-align: center;">Welcome to RTASK!</h1>
                <p style="color: #666; font-size: 16px; line-height: 1.5;">
                    Hello ${userName},
                </p>
                <p style="color: #666; font-size: 16px; line-height: 1.5;">
                    Welcome to RTASK! We're excited to have you on board. RTASK is your new task management solution that will help you stay organized and productive.
                </p>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #333; font-size: 18px;">Getting Started:</h2>
                    <ul style="color: #666; font-size: 16px; line-height: 1.6;">
                        <li>Create your first task</li>
                        <li>Organize tasks into projects</li>
                        <li>Set priorities and deadlines</li>
                        <li>Collaborate with team members</li>
                    </ul>
                </div>
                <p style="color: #666; font-size: 16px; line-height: 1.5;">
                    If you have any questions or need assistance, our support team is here to help!
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