'use client';
import React from 'react';

const Denied = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
      <h1 className="text-red-500 text-4xl font-bold mb-4">Access Denied</h1>
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md">
        <p className="mb-4">You need to be signed in to access this page.</p>
        <p className="mb-6">Please sign in to continue or return to the home page.</p>
        <div className="flex space-x-4">
          <button
            onClick={() => window.location.href = '/signin'}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign In
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Denied;
