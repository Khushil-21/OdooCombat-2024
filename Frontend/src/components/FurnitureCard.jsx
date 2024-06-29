"use client";
import React, { useState } from "react";

export default function FurnitureCard({ furniture }) {
	const [showPopup, setShowPopup] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleCardClick = () => {
		setShowPopup(true);
	};

	const handleClosePopup = () => {
		setShowPopup(false);
	};

	const handleRent = async () => {
		setIsLoading(true);
		try {
			const response = await fetch('/api/stripe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					furnitureName: furniture.name,
					pricePerDay: furniture.pricePerDay,
					numberOfDays: 1, // Default to 1 day, you might want to add a selector for this
				}),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
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
		</div>
	);
}
