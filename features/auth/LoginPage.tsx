
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { CollegeIcon } from '../../components/Icons';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const success = await login(email, password);
    if (!success) {
      setError('Invalid email or password.');
    }
    setIsLoading(false);
  };
  
  const setDemoCredentials = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-brand-orange-light rounded-full">
            <CollegeIcon className="h-8 w-8 text-brand-orange-dark" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-center text-gray-900 font-poppins">
            College OS
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome to the unified management system
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-orange focus:border-brand-orange focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-orange focus:border-brand-orange focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-orange hover:bg-brand-orange-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange-dark transition-colors disabled:bg-gray-400"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
         <div className="text-sm text-center text-gray-500">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              <button onClick={() => setDemoCredentials('admin@college.com', 'admin123')} className="p-1 bg-gray-100 rounded hover:bg-gray-200">Admin</button>
              <button onClick={() => setDemoCredentials('manager1@college.com', 'demo123')} className="p-1 bg-gray-100 rounded hover:bg-gray-200">Manager</button>
              <button onClick={() => setDemoCredentials('head@college.com', 'demo123')} className="p-1 bg-gray-100 rounded hover:bg-gray-200">Head</button>
              <button onClick={() => setDemoCredentials('faculty@college.com', 'demo123')} className="p-1 bg-gray-100 rounded hover:bg-gray-200">Faculty</button>
              <button onClick={() => setDemoCredentials('student@college.com', 'demo123')} className="p-1 bg-gray-100 rounded hover:bg-gray-200">Student</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
