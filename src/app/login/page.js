'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f1ec] px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-serif text-[#5a4a3f] mb-6 text-center">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-[#5a4a3f]">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-[#5a4a3f]">Password</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#8b6f47] text-white py-2 rounded-full font-medium hover:bg-[#a78b62] transition-all"
          >
            Sign In
          </button>
        </form>

        <div className="my-6 text-center text-[#888]">or</div>

        <button
          onClick={() => signIn('google')}
          className="w-full border border-[#ccc] py-2 rounded-full flex items-center justify-center gap-2 hover:bg-[#fafafa] transition-all"
        >
          <img src="/google-ico.svg" alt="Google" className="w-5 h-5" />
          <span className="text-sm text-[#333] font-medium">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
