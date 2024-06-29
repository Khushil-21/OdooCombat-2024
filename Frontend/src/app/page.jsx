"use client";
import { useState, useEffect } from "react";
import FurnitureGrid from "@/components/FurnitureGrid";
import SearchSection from "@/components/SearchSection";

async function getFurnitureData() {
	try {
		const response = await fetch(
			"https://furniture-rental-backend.vercel.app/api/furniture/getAll"
		);
		if (!response.ok) {
			throw new Error("Failed to fetch furniture data");
		}
		return response.json();
	} catch (error) {
		console.error("Error fetching furniture data:", error);
		return [];
	}
}

export default function Home() {
	const [furnitureData, setFurnitureData] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedType, setSelectedType] = useState("all");
	const furnitureTypes = ["all", "chair", "sofa", "table", "bed", "dinning table"];
	useEffect(() => {
		async function fetchData() {
			const data = await getFurnitureData();
			setFurnitureData(data);
		}
		fetchData();
	}, []);

	const filteredFurniture = furnitureData.filter(
		(furniture) =>
			furniture.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
			(selectedType === "" || selectedType === "all" || furniture.type === selectedType)
	);

	const handleSearch = (query, type) => {
		setSearchQuery(query);
		setSelectedType(type);
	};

	return (
		<main className="">
			<SearchSection
				furnitureTypes={furnitureTypes}
				onSearch={handleSearch}
				selectedType={selectedType}
				setSelectedType={setSelectedType}
			/>
			<FurnitureGrid allFurniture={filteredFurniture} />
		</main>
	);
}
