'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // Loading state
  const [isSuccess, setIsSuccess] = useState(false);  // Success message visibility
  const router = useRouter();  // Initialize useRouter for page redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when the form is submitting

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, surname, phone }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    setIsLoading(false); // Set loading to false after form submission

    if (res.ok) {
      setIsSuccess(true);  // Show success message
      setError('');  // Clear any previous errors
      setTimeout(() => router.push('/login'), 2000);  // Redirect to sign-in after 2 seconds
    } else {
      setError(data.error || 'Something went wrong');
      setIsSuccess(false);  // Hide success message if error occurs
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f1ec] p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-semibold text-[#5a4a3f] mb-6 text-center">Create an Account</h1>
        
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-[#5a4a3f] mb-2">First Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your first name"
              className="w-full px-4 py-2 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
              required
              autoComplete="off"
            />
          </div>

          {/* Surname Input */}
          <div>
            <label className="block text-sm font-medium text-[#5a4a3f] mb-2">Surname</label>
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="Enter your surname"
              className="w-full px-4 py-2 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
              required
              autoComplete="off"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-[#5a4a3f] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
              required
              autoComplete="off"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-[#5a4a3f] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
              required
              autoComplete="new-password"
            />
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-sm font-medium text-[#5a4a3f] mb-2">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
              autoComplete="off"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-full text-lg text-white bg-[#8b6f47] hover:bg-[#a78b62] transition-all"
            disabled={isLoading}  // Disable the button while loading
          >
            {isLoading ? 'Creating Account...' : 'Register'}  {/* Change text to 'Loading...' while submitting */}
          </button>
        </form>

        {/* Success Message */}
        {isSuccess && (
          <div className="mt-4 p-4 text-center bg-green-100 text-green-800 border border-green-300 rounded-md">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <p className="text-lg font-medium">Account created successfully!</p>
            </div>
            <p className="text-sm mt-2">Redirecting to the login page...</p>
          </div>
        )}

        {/* Sign In Redirect Button */}
        <div className="mt-4 text-center">
          <p className="text-sm text-[#5a4a3f]">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}  // Use router.push to navigate to the sign-in page
              className="text-[#8b6f47] underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
