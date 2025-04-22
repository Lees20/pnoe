'use client';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded text-[#5a4a3f]">
      <h1 className="text-xl font-bold mb-4">Forgot Password</h1>
      {submitted ? (
        <p className="text-sm">If the email exists, a reset link has been sent.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 mb-4 border border-[#d8cfc3] rounded"
          />
          <button type="submit" className="w-full bg-[#8b6f47] text-white py-2 rounded hover:bg-[#7a5f3a]">
            Send Reset Link
          </button>
        </form>
      )}
    </div>
  );
}