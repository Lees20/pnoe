export const generateBookingConfirmationEmail = (booking) => {
    const { user, numberOfPeople, notes, scheduleSlot } = booking;
    const { date, experience } = scheduleSlot;
  
    return {
      subject: `Booking Confirmation – ${experience.name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #5a4a3f;">Thank you for your booking, ${user.name || user.email}!</h2>
          <p>We're excited to host you for <strong>${experience.name}</strong>.</p>
  
          <ul style="list-style: none; padding: 0;">
            <li><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</li>
            <li><strong>Location:</strong> ${experience.location}</li>
            <li><strong>People:</strong> ${numberOfPeople}</li>
            ${notes ? `<li><strong>Notes:</strong> ${notes}</li>` : ''}
          </ul>
  
          <p>If you have any questions, just reply to this email.</p>
          <p style="margin-top: 2rem;">See you soon,<br/>The Oasis Team</p>
        </div>
      `,
    };
  };
  