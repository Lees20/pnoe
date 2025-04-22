import prisma from '@/lib/prisma'; // Adjust the path as needed
import bcrypt from 'bcryptjs';


export async function POST(req) {
  try {
    const { email, password, name, surname, phone, dateOfBirth } = await req.json();

    // ✅ Validate required fields
    if (!email || !password || !dateOfBirth) {
      return new Response(
        JSON.stringify({ error: 'Email, password, and date of birth are required' }),
        { status: 400 }
      );
    }

    // ✅ Password validation: 8+ characters, must include letters & numbers
    const isStrongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!isStrongPassword.test(password)) {
      return new Response(
        JSON.stringify({
          error:
            'Password must be at least 8 characters long and include both letters and numbers.',
        }),
        { status: 400 }
      );
    }

    // ✅ Legal age check (EU: 18+)
    const isLegalAge = (dob) => {
      const today = new Date();
      const birth = new Date(dob);
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return age >= 18;
    };
    const { captchaToken } = await req.json();

      const captchaRes = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
        { method: 'POST' }
      );

      const captchaData = await captchaRes.json();
      if (!captchaData.success) {
        return new Response(JSON.stringify({ error: 'CAPTCHA verification failed' }), { status: 400 });
      }

    if (!isLegalAge(dateOfBirth)) {
      return new Response(
        JSON.stringify({ error: 'You must be at least 18 years old to register.' }),
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'User with this email already exists' }),
        { status: 400 }
      );
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

    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    console.error('[SIGNUP ERROR]', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong' }),
      { status: 500 }
    );
  }
}
