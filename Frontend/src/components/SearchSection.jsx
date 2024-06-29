import React, { useState } from "react";

export default function SearchSection({
	onSearch,
	selectedType,
    setSelectedType,
    furnitureTypes,
}) {
	const [searchQuery, setSearchQuery] = useState("");
	

	const handleInputChange = (e) => {
		const query = e.target.value;
		setSearchQuery(query);
		onSearch(query, selectedType);
	};

	const handleTypeChange = (type) => {
		setSelectedType(type);
		onSearch(searchQuery, type);
	};

	return (
		<div className="p-10 flex flex-col gap-5">
			<input
				type="text"
				placeholder="Search furniture..."
				value={searchQuery}
				onChange={handleInputChange}
				className="w-full p-2 rounded-md border-2 border-gray-300"
			/>
			<div className="flex flex-wrap gap-2">
				{furnitureTypes.map((type) => (
					<button
						key={type}
						onClick={() => handleTypeChange(type)}
						className={`px-4 py-2 rounded-md ${
							selectedType === type
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-700"
						} hover:bg-blue-600 hover:text-white transition-colors`}
					>
						{type}
					</button>
				))}
			</div>
		</div>
	);
}
