'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface FormData {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    isAdmin: boolean;
  }
}

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // React.ChangeEvent<HTMLInputElement> = type for an event triggered by a change in the value of an input element
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // updates the state whenever an input field changes
    setFormData({
      ...formData,
      [e.target.name]: e.target.value  // updates the value of the input field that triggered the event
    });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // prevents default action of an event (in this case leave page and reload)
    setError('') // updates the error state to display messages to the user when something goes wrong

    const requestBody = {
      email: formData.email,
      password: formData.password
    }

    console.log('Making request with:', requestBody)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error('response not ok');
      }

      // Store access token and user data in AuthContext
      login(data.accessToken, data.user);

      console.log('Logged in:', data.user);

      // Clear form
      setFormData({ email: '', password: '' });

      // Redirect to dashboard
      // router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Log In</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Log In
        </button>
      </form>
    </div>
  )
}
