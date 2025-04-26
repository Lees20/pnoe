import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/lib/email/welcomeEmail';

export async function POST(req) {
  try {
    const { email, password, name, surname, phone, dateOfBirth, recaptchaToken } = await req.json();

    // ✅ Validate required fields
    if (!email || !password || !dateOfBirth || !recaptchaToken) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
    const captchaRes = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`, {
      method: 'POST',
    });
    const captchaData = await captchaRes.json();
    if (!captchaData.success) {
      return new Response(JSON.stringify({ error: 'CAPTCHA verification failed' }), { status: 400 });
    }

    const isStrongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!isStrongPassword.test(password)) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 8 characters long and include both letters and numbers.' }),
        { status: 400 }
      );
    }

    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    if (age < 18) {
      return new Response(JSON.stringify({ error: 'You must be at least 18 years old to register.' }), { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User with this email already exists' }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        surname,
        phone,
        dateOfBirth: new Date(dateOfBirth),
      },
    });

    try {
      await sendWelcomeEmail({ email: newUser.email, name: newUser.name });
      console.log('✅ Welcome email sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send welcome email:', emailError);
    }

    return new Response(JSON.stringify({ message: 'User created successfully' }), { status: 201 });

  } catch (error) {
    console.error('[SIGNUP ERROR]', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again later.' }),
      { status: 500 }
    );
  }
}
