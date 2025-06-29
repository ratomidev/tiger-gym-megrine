"use client";

import { useParams } from "next/navigation";

export default function EditAdherentPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Modifier l&apos;Adhérent</h1>
      <p>ID de l&apos;adhérent: {id}</p>
      {/* Add your edit form here */}
    </div>
  );
}
