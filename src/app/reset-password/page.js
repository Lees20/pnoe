'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ResetPasswordPage() {
  const token = useSearchParams().get('token');
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    if (res.ok) {
      setMessage('Password updated! Redirecting...');
      setTimeout(() => router.push('/login'), 2000);
    } else {
      const data = await res.json();
      setMessage(data.error || 'Something went wrong.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded text-[#5a4a3f]">
      <h1 className="text-xl font-bold mb-4">Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-[#d8cfc3] rounded"
        />
        <button type="submit" className="w-full bg-[#8b6f47] text-white py-2 rounded hover:bg-[#7a5f3a]">
          Reset Password
        </button>
      </form>
      {message && <p className="text-sm mt-4">{message}</p>}
    </div>
  );
}