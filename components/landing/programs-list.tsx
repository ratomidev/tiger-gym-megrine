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
		id: "3",
		title: "Yoga & Bien-être",
		description:
			"Améliorez votre flexibilité, votre équilibre et réduisez votre stress avec ce programme de yoga.",
		imageUrl: "/images/program-yoga.jpg",
		duration: "10 semaines",
		level: "débutant",
		category: "Bien-être",
		modules: [
			"Postures de base du yoga",
			"Techniques de respiration",
			"Méditation guidée",
			"Étirements pour la récupération",
		],
	},
	{
		id: "4",
		title: "Perte de Poids",
		description:
			"Programme complet combinant exercices et nutrition pour une perte de poids durable.",
		imageUrl: "/images/program-weight-loss.jpg",
		duration: "16 semaines",
		level: "débutant",
		category: "Fitness",
		modules: [
			"Exercices brûle-graisses",
			"Plan nutritionnel personnalisé",
			"Suivi des progrès",
			"Adaptations progressives",
		],
	},
	{
		id: "5",
		title: "Cross Training",
		description:
			"Entraînement fonctionnel varié pour améliorer vos performances globales et votre condition physique.",
		imageUrl: "/images/program-cross-training.jpg",
		duration: "12 semaines",
		level: "avancé",
		category: "Fitness",
		modules: [
			"Mouvements olympiques",
			"Entraînement métabolique",
			"Gymnastique fonctionnelle",
			"Récupération et mobilité",
		],
	},
	{
		id: "6",
		title: "Remise en Forme",
		description:
			"Programme idéal pour les débutants souhaitant reprendre une activité physique régulière.",
		imageUrl: "/images/program-fitness.jpg",
		duration: "8 semaines",
		level: "débutant",
		category: "Fitness",
		modules: [
			"Introduction aux exercices de base",
			"Renforcement musculaire doux",
			"Cardio adapté",
			"Étirements essentiels",
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