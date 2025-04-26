'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function AdminHelpPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    setIsClient(true);
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  if (!isClient || status === 'loading') return null;

  const faqs = [
    {
      question: 'How do I add a new Experience?',
      answer: `
        To add a new experience, navigate to "Manage Experiences" from your Admin Dashboard.
        Click on "Add Experience" and complete the form, providing key details like title, description, images, and frequency of availability (e.g., specific weekdays).
        Ensure all required fields are filled in accurately.
        After saving, the new experience will be instantly available for users to browse and book.
        You can always edit or delete an experience later if needed.
      `
    },
    {
      question: 'How do I manage client bookings?',
      answer: `
        Go to "Manage Reservations" to view all bookings made by clients.
        You can edit booking details, manually add new reservations, or cancel bookings if necessary.
        Bookings are grouped based on the corresponding experience and date for easier management.
        Always confirm with the client before making major changes to their reservation.
      `
    },
    {
        question: 'How do I add a new schedule slot for an experience?',
        answer: `
          To add a new slot, go to "Manage Schedule" in the Admin Dashboard, select the experience, 
          and use the form provided to choose the date, time, and number of total available slots. 
          The date must match the allowed days of the experience (e.g., only weekends if specified).
          Once submitted, the slot is immediately available for users to book.
        `
      },
      {
        question: 'What happens if I delete a schedule slot?',
        answer: `
          When you delete a schedule slot, all reservations linked to that slot are automatically deleted as well.
          Before confirming deletion, a warning is shown explaining this.
          This ensures that users do not keep reservations for unavailable times.
        `
      },
      {
        question: 'Can I manually create a reservation for a user?',
        answer: `
          Yes, from the Admin Reservations page, you can create a new booking by selecting the user, experience and available slot.
          This is useful if you want to handle manual bookings from phone calls, emails or direct requests.
        `
      },
    {
      question: 'When are old slots and bookings deleted automatically?',
      answer: `
        To keep the system clean, any experience slot and its associated bookings that are older than one month from today's date are automatically deleted.
        This helps avoid clutter and ensures that the admin panel remains up-to-date with current and future activities only.
        The cleanup process runs daily through a secure scheduled background task.
      `
    },
    {
      question: 'Can I edit the available slots after a slot has been created?',
      answer: `
        Yes, you can edit an existing slot's available number of slots.
        However, you cannot reduce the number of available slots below the number of already booked participants.
        Example: If 5 users have already booked and the total slots were 10, you can lower the available slots to no less than 5.
        This prevents accidental loss of existing bookings.
      `
    },
    {
      question: 'How can I manage or remove users?',
      answer: `
        Access "Manage Clients" to view the list of all registered users.
        You can delete a user if necessary, but please note that this action is permanent and will remove all related user data, including their bookings and personal information.
        Always proceed with caution and confirm major deletions.
      `
    },
    {
      question: 'What security measures are in place to protect the system?',
      answer: `
        The system uses secure authentication powered by NextAuth.js.
        Passwords are hashed with bcrypt for strong encryption.
        reCAPTCHA v2 is implemented to prevent bots from creating fake accounts.
        Access to the Admin Dashboard is restricted only to users with the 'admin' role.
        Sensitive actions like deleting slots or users are double-checked with confirmation modals.
        All background jobs and scheduled tasks are securely executed via secret-key protected endpoints.
      `
    },
    {
        question: 'How do users check available dates for an experience?',
        answer: `
          Users can visit the "Check Availability" page for each experience.
          They can view an interactive calendar displaying all upcoming available dates and time slots.
          Only slots that have remaining available spots are selectable.
          This ensures a smooth and intuitive booking experience for the user.
        `
      },
      {
        question: 'How does the booking process work for users?',
        answer: `
          Once a user selects a date and time from the availability calendar, they can submit a reservation request.
          During booking, they must specify the number of participants (up to the allowed maximum) and optionally leave notes (e.g., special requests or allergies).
          Bookings are confirmed instantly if slots are available, and users receive confirmation notifications.
        `
      },
      {
        question: 'Can users cancel or modify their bookings?',
        answer: `
          Currently, users cannot directly cancel or modify their bookings from their profile.
          If a change is needed, users must contact the admin team through the provided communication channels.
          Admins have the ability to manage and cancel bookings manually from the Admin Dashboard.
        `
      },
      {
        question: 'What happens if a user tries to overbook a slot?',
        answer: `
          The system automatically prevents users from selecting a slot that does not have enough remaining capacity.
          If a user tries to submit a reservation that exceeds the available seats, they will receive a warning message and the booking will be rejected.
          This ensures fairness and prevents overbooking scenarios.
        `
      },
      {
        question: 'How are email notifications handled?',
        answer: `
          Upon successful registration, each new user automatically receives a customized welcome email.
          Additionally, when a booking is confirmed, users receive an email with all relevant details, including the date, time and number of participants.
          If a booking is created or canceled by the admin, users are also notified via email.
          All email communications are sent securely through a trusted email service provider.
        `
      },
      {
        question: 'Is there automatic cleanup of outdated data?',
        answer: `
          Yes, the system automatically deletes reservations and schedule slots that are older than 1 month.
          This is done through a secure background job to keep the database clean, fast, and relevant.
          Admins don't need to manually remove expired slots — the system handles it automatically.
        `
      },
      {
        question: 'What is the Admin Dashboard and who can access it?',
        answer: `
          The Admin Dashboard is a dedicated interface where administrators can manage experiences, bookings, schedules, and users.
          Only users assigned the 'admin' role can access this dashboard.
          Access control is enforced both on the server and client side to ensure full security.
        `
      },
      {
        question: 'What happens if a non-admin tries to access the Admin Dashboard?',
        answer: `
          If a user without the 'admin' role attempts to access the Admin Dashboard URL, they will be automatically redirected to the homepage.
          This ensures that unauthorized users cannot view or manipulate any administrative functionalities.
        `
      },      
  ];
  

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#f4f1ec] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold text-[#5a4a3f] text-center mb-10">Admin Help Center</h1>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-[#e0dcd4] rounded-2xl shadow-sm">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left text-[#5a4a3f] font-medium text-lg hover:bg-[#faf9f7] transition"
              >
                {faq.question}
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-[#8b6f47]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#8b6f47]" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 text-[#4a4a4a] text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => router.push('/admin')}
            className="inline-block bg-[#8b6f47] text-white px-6 py-3 rounded-full hover:bg-[#7a5f3a] transition shadow"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
