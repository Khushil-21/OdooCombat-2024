"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker"; // Make sure to install this package
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from 'next/navigation';

export default function FurnitureCard({ furniture }) {
	const [showPopup, setShowPopup] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [user, setUser] = useState(null);
	const router = useRouter();

	useEffect(() => {
		const userFromSession = sessionStorage.getItem('user');
		if (userFromSession) {
			const parsedUser = JSON.parse(userFromSession);
			setUser(parsedUser);
			// Add user details from session storage to local storage
			const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
			const updatedUser = { ...existingUser, ...parsedUser };
			localStorage.setItem('user', JSON.stringify(updatedUser));
		}
	}, []);

	const handleCardClick = () => {
		setShowPopup(true);
	};

	const handleClosePopup = () => {
		setShowPopup(false);
		setShowDatePicker(false);
	};

	const handleRent = () => {
		if (!user) {
			router.push('/login'); // Redirect to login page if user is not logged in
			return;
		}
		setShowDatePicker(true);
	};

	const handleConfirmRent = async () => {
		setIsLoading(true);
		const numberOfDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
		try {
			const response = await fetch('/api/stripe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					furnitureName: furniture.name,
					pricePerDay: furniture.pricePerDay,
					numberOfDays: numberOfDays,
				}),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();

			// Update user history in local storage
			const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
			const history = userFromStorage.history || [];
			const newRentalHistory = {
				furnitureName: furniture.name,
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
				numberOfDays,
				totalPrice: furniture.pricePerDay * numberOfDays,
				paymentStatus: 'Pending',
				type: furniture.type,
				pricePerDay: furniture.pricePerDay,
				description: furniture.description,
				location: furniture.location,
				image: furniture.image
			};
			history.push(newRentalHistory);
			const updatedUser = { ...userFromStorage, history };
			localStorage.setItem('user', JSON.stringify(updatedUser));

			window.location.href = data.url; // Redirect to Stripe Checkout
		} catch (error) {
			console.error('Error:', error);
			alert('There was an error processing your request. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="p-5">
			<div
				className="min-h-[300px] w-[330px] rounded p-3 shadow-lg cursor-pointer"
				onClick={handleCardClick}
			>
				<div className="relative pb-[75%]">
					<img
						className="absolute top-0 left-0 w-full h-full object-cover"
						src={furniture.image}
						alt={furniture.name}
					/>
				</div>
				<div className="my-3 flex flex-col justify-between">
					<div className="font-bold text-xl mb-2">{furniture.name}</div>
					<p className="text-gray-700 text-base mb-4">
						₹{furniture.pricePerDay} per day
					</p>
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={(e) => {
							e.stopPropagation();
							handleRent();
						}}
						disabled={isLoading}
					>
						{isLoading ? 'Processing...' : 'Rent'}
					</button>
				</div>
			</div>

			{showPopup && (
				<div
					className="fixed z-30 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
					onClick={handleClosePopup}
				>
					<div
						className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="mt-3 text-center">
							<h3 className="text-lg leading-6 font-medium text-gray-900">
								{furniture.name}
							</h3>
							<div className="mt-2 px-7 py-3">
								<div className="relative pb-[75%] mb-4">
									<img
										className="absolute top-0 left-0 w-full h-full object-cover"
										src={furniture.image}
										alt={furniture.name}
									/>
								</div>
								<p className="text-sm text-gray-500 mb-2">
									Type: {furniture.type}
								</p>
								<p className="text-sm text-gray-500 mb-2">
									Price: ₹{furniture.pricePerDay} per day
								</p>
								<p className="text-sm text-gray-500 mb-2">
									Description: {furniture.description}
								</p>
								<p className="text-sm text-gray-500 mb-2">
									Location: {furniture.location}
								</p>
							</div>
							<div className="items-center px-4 py-3">
								<button
									className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 mb-2"
									onClick={handleRent}
									disabled={isLoading}
								>
									{isLoading ? 'Processing...' : 'Rent'}
								</button>
								<button
									className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
									onClick={handleClosePopup}
								>
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{showDatePicker && user && (
				<div
					className="fixed z-40 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
					onClick={() => setShowDatePicker(false)}
				>
					<div
						className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
						onClick={(e) => e.stopPropagation()}
					>
						<h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
							Select Rental Period
						</h3>
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700">Start Date</label>
							<DatePicker
								selected={startDate}
								onChange={(date) => setStartDate(date)}
								selectsStart
								startDate={startDate}
								endDate={endDate}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700">End Date</label>
							<DatePicker
								selected={endDate}
								onChange={(date) => setEndDate(date)}
								selectsEnd
								startDate={startDate}
								endDate={endDate}
								minDate={startDate}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
							/>
						</div>
						<button
							className="w-full px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
							onClick={handleConfirmRent}
						>
							Confirm Rental
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
