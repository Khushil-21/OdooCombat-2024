
import FurnitureGrid from "@/components/FurnitureGrid";

async function getFurnitureData() {
  try {
    const response = await fetch("https://furniture-rental-backend.vercel.app/api/furniture/getAll");
    if (!response.ok) {
      throw new Error('Failed to fetch furniture data');
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching furniture data:", error);
    return [];
  }
}

export default async function Home() {
  const furnitureData = await getFurnitureData();

  return (
    <main className="">
      <FurnitureGrid allFurniture={furnitureData} />
    </main>
  );
}
