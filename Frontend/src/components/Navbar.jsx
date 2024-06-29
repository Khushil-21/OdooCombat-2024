'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleViewHistory = () => {
    setShowHistory(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-blue-500 text-white">
      <div className="text-xl font-bold">
        <Link href="/">Rental Furniture</Link>
      </div>
      <div className="flex items-center">
        {user ? (
          <>
            <span className="mr-4">Welcome, {user.name}</span>
            <button
              onClick={handleViewHistory}
              className="px-3 py-2 bg-blue-600 rounded hover:bg-blue-700 mr-4"
            >
              View History
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/signup" className="mr-4 px-3 py-2 bg-blue-600 rounded hover:bg-blue-700">
              Sign Up
            </Link>
            <Link href="/login" className="px-3 py-2 bg-blue-600 rounded hover:bg-blue-700">
              Login
            </Link>
          </>
        )}
      </div>

      {showHistory && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">User Details and History</h2>
            <div className="mb-4">
              <p className="text-gray-700"><strong>Name:</strong> {user.name}</p>
              <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
              <p className="text-gray-700"><strong>Address:</strong> {user.address}</p>
              <p className="text-gray-700"><strong>Contact Number:</strong> {user.contactNumber}</p>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Rental History</h3>
            {user.history && user.history.length > 0 ? (
              user.history.map((item, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-100 rounded">
                  <p className="text-gray-700"><strong>Furniture:</strong> {item.furnitureName}</p>
                  <p className="text-gray-700"><strong>Start Date:</strong> {new Date(item.startDate).toLocaleDateString()}</p>
                  <p className="text-gray-700"><strong>End Date:</strong> {new Date(item.endDate).toLocaleDateString()}</p>
                  <p className="text-gray-700"><strong>Number of Days:</strong> {item.numberOfDays}</p>
                  <p className="text-gray-700"><strong>Total Price:</strong> ₹{item.totalPrice}</p>
                  <p className="text-gray-700"><strong>Payment Status:</strong> {item.paymentStatus}</p>
                  <p className="text-gray-700"><strong>Type:</strong> {item.type}</p>
                  <p className="text-gray-700"><strong>Price Per Day:</strong> ₹{item.pricePerDay}</p>
                  <p className="text-gray-700"><strong>Description:</strong> {item.description}</p>
                  <p className="text-gray-700"><strong>Location:</strong> {item.location}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-700">No rental history available.</p>
            )}
            <button
              onClick={() => setShowHistory(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
