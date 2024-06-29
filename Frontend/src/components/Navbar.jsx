'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <nav className="flex justify-between items-center p-4 bg-blue-500 text-white">
      <div className="text-xl font-bold">
        <Link href="/">Rental Furniture</Link>
      </div>
      <div>
        {user ? (
          <span className="mr-4">Welcome, {user.name}</span>
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
    </nav>
  );
}
