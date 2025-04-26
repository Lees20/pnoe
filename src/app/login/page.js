'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA.');
      setLoading(false);
      return;
    }

    const { email, password } = form;

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      recaptchaToken, // send token
    });

    setLoading(false);

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        setError('Invalid email or password.');
      } else {
        setError('Something went wrong.');
      }
    } else {
      router.push('/dashboard');
    }
  }

  if (status === 'loading') return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f1ec] px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        {session ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#5a4a3f] mb-4">You're already signed in</h2>
            <p className="text-lg text-[#888]">Redirecting you to the dashboard...</p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-serif text-[#5a4a3f] mb-6 text-center">Welcome Back</h2>

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

              {/* ReCAPTCHA V2 */}
              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  onChange={handleRecaptchaChange}
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button
                type="submit"
                className="w-full bg-[#8b6f47] text-white py-2 rounded-full font-medium hover:bg-[#a78b62] transition-all"
                disabled={loading}
              >
                {loading ? 'Logging In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#5a4a3f]">
                Don't have an account?{' '}
                <button
                  onClick={() => router.push('/sign-up')}
                  className="text-[#8b6f47] underline"
                >
                  Register
                </button>
              </p>
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="text-sm text-[#8b6f47] hover:underline"
              >
                Forgot your password?
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
