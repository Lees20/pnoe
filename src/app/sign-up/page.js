'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { useSession } from 'next-auth/react';  // Import useSession to check if user is already logged in

export default function Register() {
  const { data: session, status } = useSession();  // Check session status
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // Loading state
  const [isSuccess, setIsSuccess] = useState(false);  // Success message visibility
  const router = useRouter();  // Initialize useRouter for page redirection
  const [dateOfBirth, setDateOfBirth] = useState('');


  const isLegalAge = (dob) => { //checks if user is 18+
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    return age > 18 || (age === 18 && m >= 0);
  };

  // Redirect to the dashboard if the user is already logged in
  useEffect(() => {
    if (session) {
      router.push('/dashboard'); // Redirect to dashboard if already signed in
    }
  }, [session, router]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when the form is submitting
    console.log({
      email,
      password,
      name,
      surname,
      phone,
      dateOfBirth,
    });
    
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, surname, phone, dateOfBirth }),
      headers: {
        'Content-Type': 'application/json',
      },
    });


    
    const data = await res.json();

    setIsLoading(false); // Set loading to false after form submission

    if (!isLegalAge(dateOfBirth)) {
      setError('You must be at least 18 years old to register.');
      setIsLoading(false);
      return;
    }
  
    if (res.ok) {
      setIsSuccess(true);  // Show success message
      setError('');  // Clear any previous errors
      setTimeout(() => router.push('/login'), 2000);  // Redirect to sign-in after 2 seconds
    } else {
      setError(data.error || 'Something went wrong');
      setIsSuccess(false);  // Hide success message if error occurs
    }
  };

  // Loading state while session is being fetched
  if (status === 'loading') return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f1ec] p-8">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-lg">
        {session ? (
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-[#5a4a3f] mb-4">You're already signed in</h2>
            <p className="text-lg text-[#888]">Redirecting you to the dashboard...</p>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-semibold text-[#5a4a3f] mb-6 text-center">Create an Account</h1>
            
            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-8">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-[#5a4a3f] mb-2">First Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your first name"
                  className="w-full px-6 py-4 rounded-lg border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47] shadow-lg transition-all duration-300"
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
                  className="w-full px-6 py-4 rounded-lg border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47] shadow-lg transition-all duration-300"
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
                  className="w-full px-6 py-4 rounded-lg border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47] shadow-lg transition-all duration-300"
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
                  className="w-full px-6 py-4 rounded-lg border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47] shadow-lg transition-all duration-300"
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
                  className="w-full px-6 py-4 rounded-lg border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47] shadow-lg transition-all duration-300"
                  autoComplete="off"
                />
              </div>

              {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-[#5a4a3f] mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-6 py-4 rounded-lg border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47] shadow-lg transition-all duration-300"
                    required
                  />
                </div>


              {/* Error Message */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-full text-lg text-white bg-[#8b6f47] hover:bg-[#a78b62] transition-all duration-300 ease-in-out shadow-md"
                disabled={isLoading}  // Disable the button while loading
              >
                {isLoading ? 'Creating Account...' : 'Register'}  {/* Change text to 'Loading...' while submitting */}
              </button>
            </form>

            {/* Success Message */}
            {isSuccess && (
              <div className="mt-6 p-6 text-center bg-green-100 text-green-800 border border-green-300 rounded-md shadow-lg transition-all">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <p className="text-xl font-medium">Account created successfully!</p>
                </div>
                <p className="text-sm mt-3">Redirecting to the login page...</p>
              </div>
            )}

            {/* Sign In Redirect Button */}
            <div className="mt-6 text-center">
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
          </>
        )}
      </div>
    </div>
  );
}
