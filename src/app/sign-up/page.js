'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', surname: '', phone: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const text = await res.text(); // read body once
      let data;

      try {
        data = JSON.parse(text); // try to parse JSON
      } catch {
        data = { message: text }; // fallback to plain text
      }

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Sign in automatically after successful signup
      const signInRes = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInRes?.error) {
        setError('Signup succeeded but login failed');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f1ec] px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-serif text-[#5a4a3f] mb-6 text-center">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-[#5a4a3f]">First Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-[#5a4a3f]">Last Name</label>
            <input
              type="text"
              name="surname"
              value={form.surname}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-[#5a4a3f]">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-[#5a4a3f]">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-[#5a4a3f]">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8b6f47] text-white py-2 rounded-full font-medium hover:bg-[#a78b62] transition-all"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[#4a4a4a]">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-[#8b6f47] underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
