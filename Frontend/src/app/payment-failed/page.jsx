'use client';

import { useRouter } from 'next/navigation';

export default function page() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
        <p className="text-gray-700 mb-6">
          We're sorry, but your payment could not be processed. Please try again or contact support if the issue persists.
        </p>
        <button
          onClick={handleGoHome}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
}
