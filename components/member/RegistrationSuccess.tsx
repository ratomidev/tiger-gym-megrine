
import { Card, CardContent, CardDescription,  CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface RegistrationSuccessProps {
  onReset?: () => void;
}

export default function RegistrationSuccess({ }: RegistrationSuccessProps) {
  return (
    <Card className="w-full max-w-3xl shadow-lg border-gray-200">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">Inscription Réussie</CardTitle>
        <CardDescription className="text-gray-600">
          Votre demande a été envoyée avec succès
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4 text-center">
        <div className="space-y-4">
          <p className="text-gray-700">
            Merci pour votre inscription à Tiger Gym Megrine. Notre équipe va traiter votre demande dans les plus brefs délais.
          </p>
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-1">Prochaines étapes</h3>
            <p className="text-blue-700 text-sm">
              Nous vous contacterons bientôt pour confirmer votre adhésion et finaliser votre abonnement.
            </p>
          </div>
          <p className="text-gray-600 text-sm">
            Pour toute question, n&apos;hésitez pas à nous contacter au <span className="font-semibold">+216 XX XXX XXX</span> ou par email à <span className="font-semibold">contact@tigergym.tn</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}