import nodemailer from 'nodemailer';

export async function POST(req) {
  const { name, email, message } = await req.json();

  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : req.headers.get("x-real-ip") || "Unknown";

  //  IP
  let location = "Unknown";
  try {
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        'User-Agent': 'Node.js Contact Form',
      },
    });
    const geoData = await geoRes.json();

    if (!geoData || geoData.error) {
      console.warn("IP API returned error or empty response:", geoData);
    } else {
      const city = geoData.city || 'Unknown city';
      const country = geoData.country_name || 'Unknown country';
      location = `${city}, ${country}`;
    }
  } catch (err) {
    console.warn("Geolocation fetch failed", err);
  }


  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Main email
  const mailOptions = {
    from: `"Pantelis Karabetsos" <${process.env.EMAIL_USER}>`,
    replyTo: email,
    to: 'karapantelis21@gmail.com',
    subject: `New message from ${name}`,
    text: message,
    html: `
      <div style="font-family: 'Segoe UI'; background: #f9fafb; padding: 24px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 18px; box-shadow: 0 8px 30px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
          <div style="text-align: center; padding: 32px 24px; background: linear-gradient(to right, #6366f1, #8b5cf6); color: white;">
            <h1 style="margin: 0; font-size: 22px;">📨 New Message</h1>
          </div>
          <div style="padding: 24px; color: #1f2937;">
            <p><strong>👤 Name:</strong> ${name}</p>
            <p><strong>📧 Email:</strong> ${email}</p>
            <p><strong>🕓 Received:</strong> ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/Athens' })}</p>
            <p><strong>📍 IP Address:</strong> ${ip}</p>
            <p><strong>🌍 Location:</strong> ${location}</p>
          </div>
          <div style="padding: 0 24px 24px;">
            <p><strong>💬 Message:</strong></p>
            <div style="background: #f3f4f6; border-radius: 12px; padding: 16px;">${message}</div>
          </div>
        </div>
      </div>
    `,
  };

  // Auto-reply email
  const autoReply = {
    from: `"Pantelis Karabetsos" <noreply@pkarabetsos.com>`,
    replyTo: "contact@pkarabetsos.com",
    to: email,
    subject: `We've received your message, ${name}!`,
    html: `
    <div style="font-family: 'Segoe UI', Roboto, sans-serif; background: #f3f4f6; padding: 32px 16px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 20px; box-shadow: 0 10px 35px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e5e7eb;">
        
        <!-- Banner -->
        <div style="text-align: center; padding: 40px 24px; background: #4f46e5; background: linear-gradient(to right, #6366f1, #8b5cf6); color: #ffffff;">
          <img src="https://panteliskarabetsos.com/favicon.ico" alt="Logo" width="48" height="48" style="border-radius: 12px; margin-bottom: 16px;" />
          <h1 style="margin: 0; font-size: 24px; font-weight: 700;">✉️ Message Received</h1>
          <p style="margin-top: 8px; font-size: 16px; font-weight: 500;">
            We've got your message and will be in touch soon.
          </p>
        </div>
  
        <!-- Body -->
        <div style="padding: 32px 24px; font-size: 15px; color: #1f2937; line-height: 1.75;">
          <p>Hi <strong>${name}</strong>,</p>
          <p>Thank you for getting in touch! 👋</p>
          <p>I've received your message and will respond as soon as possible.</p>
          <p>If it's urgent, feel free to reply directly to this email.</p>
        </div>
  
        <!-- Divider -->
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0 24px;" />
  
        <!-- Signature / Footer -->
        <div style="padding: 24px; font-size: 14px; color: #6b7280; text-align: center;">
          <p style="margin-bottom: 6px;">— Pantelis Karabetsos</p>
          <a href="https://panteliskarabetsos.com" target="_blank" style="color: #6366f1; font-weight: 500; text-decoration: none;">
            panteliskarabetsos.com
          </a>
        </div>
      </div>
    </div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(autoReply);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Email sending error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
