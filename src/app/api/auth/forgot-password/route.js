import  prisma  from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { transporter } from '@/lib/email/nodemailer';
import { NextResponse } from 'next/server';
// Count recent tokens for this user (π.χ. τα τελευταία 15 λεπτά)

  
export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Don't reveal whether the email exists
      return NextResponse.json({ message: 'If your email is registered, a reset link has been sent.' });
    }
    const recentRequests = await prisma.passwordResetToken.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: new Date(Date.now() - 1000 * 60 * 15), // last 15 minutes
          },
        },
      });
      
      if (recentRequests >= 3) {
        return NextResponse.json({ error: 'Please wait before requesting again.' }, { status: 429 });
      }
    
    // Only happens if user exists:
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });
    

    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: expires,
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      to: user.email,
      from: `"Oasis" <${process.env.EMAIL_USER}>`,
      subject: 'Reset Your Password – Oasis Experiences',
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #fdfaf5; color: #333;">
          <h2 style="color: #5a4a3f;">Reset your password</h2>
          <p>Hello ${user.name || 'there'},</p>
          <p>Click the button below to reset your password. This link is valid for 1 hour:</p>
          <div style="margin: 20px 0;">
            <a href="${resetUrl}" style="background: #8b6f47; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Reset Password
            </a>
          </div>
          <p>If you didn’t request this, you can safely ignore it.</p>
          <p style="margin-top: 2rem;">– The Oasis Team</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'If your email is registered, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 });
  }
}
