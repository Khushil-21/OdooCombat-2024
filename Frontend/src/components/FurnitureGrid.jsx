import React from "react";
import FurnitureCard from "./FurnitureCard";

export default function FurnitureGrid({ allFurniture }) {
	console.log("allFurniture: ", allFurniture);
	return (
		<div className="flex flex-wrap">
			{allFurniture.map((furniture, index) => (
				<FurnitureCard key={index} furniture={furniture} />
			))}
		</div>
	);
}
