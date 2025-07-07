"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgramCard, { ProgramProps } from "./program";

// Sample program data
const programsData: ProgramProps[] = [
	{
		id: "1",
		title: "Musculation & Force",
		description:
			"Programme complet de musculation conçu pour développer votre force et votre masse musculaire.",
		imageUrl: "/images/program-musculation.jpg",
		duration: "12 semaines",
		level: "intermédiaire",
		category: "Musculation",
		modules: [
			"Développé du haut du corps",
			"Renforcement du bas du corps",
			"Techniques d'hypertrophie",
			"Nutrition pour la prise de masse",
		],
	},
	{
		id: "2",
		title: "Cardio Intensif",
		description:
			"Brûlez des calories et améliorez votre endurance avec ce programme cardio à haute intensité.",
		imageUrl: "/images/program-cardio.jpg",
		duration: "8 semaines",
		level: "avancé",
		category: "Cardio",
		modules: [
			"HIIT (High Intensity Interval Training)",
			"Cardio de longue durée",
			"Exercices de récupération active",
			"Suivi de la fréquence cardiaque",
		],
	},
	{
    id: "5",
    title: "Spinning & Cycling",
    description:
        "Cours collectifs dynamiques de vélo en salle pour brûler des calories et améliorer votre endurance cardiovasculaire.",
    imageUrl: "/images/program-spinning.jpg", // You may want to update this image
    duration: "Sessions de 45 min",
    level: "débutant",
    category: "Cours",
    modules: [
        "Spinning endurance",
        "HIIT Cycling",
        "Power Ride",
        "Récupération active et étirements",
    ],
},
];

// All available categories
const categories = [
	"Tous",
	...new Set(programsData.map((program) => program.category)),
];

export default function ProgramsList() {
	const [activeCategory, setActiveCategory] = useState("Tous");

	// Filter programs based only on active category
	const filteredPrograms = programsData.filter((program) => {
		return activeCategory === "Tous" || program.category === activeCategory;
	});

	return (
		<section className="py-16 bg-background" id="programmes">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold mb-4">Nos Programmes</h2>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
						Découvrez nos programmes d'entraînement spécialisés conçus pour vous
						aider à atteindre vos objectifs de fitness et de bien-être.
					</p>
				</div>

				<div className="mb-8 flex justify-center">
					{/* Category tabs */}
					<Tabs
						defaultValue="Tous"
						value={activeCategory}
						onValueChange={setActiveCategory}
						className="w-full md:w-auto"
					>
						<TabsList className="w-full overflow-x-auto grid grid-flow-col auto-cols-max gap-2">
							{categories.map((category) => (
								<TabsTrigger key={category} value={category}>
									{category}
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
				</div>

				{filteredPrograms.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredPrograms.map((program) => (
							<ProgramCard key={program.id} {...program} />
						))}
					</div>
				) : (
					<div className="text-center py-16">
						<p className="text-lg text-muted-foreground">
							Aucun programme ne correspond à la catégorie sélectionnée.
						</p>
					</div>
				)}
			</div>
		</section>
	);
}