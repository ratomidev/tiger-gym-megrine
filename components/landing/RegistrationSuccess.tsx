import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface RegistrationSuccessProps {
  onReset?: () => void;
}

export default function RegistrationSuccess({}: RegistrationSuccessProps) {
  return (
    <Card className="w-full max-w-3xl shadow-lg border-white/20 bg-transparent mt-20">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-400" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">
          Inscription Réussie
        </CardTitle>
        <CardDescription className="text-white/80">
          Votre demande a été envoyée avec succès
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 text-center">
        <div className="space-y-4">
          <p className="text-white/90">
            Merci pour votre inscription à Tiger Gym Megrine. Notre équipe va
            traiter votre demande dans les plus brefs délais.
          </p>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-md border border-white/20">
            <h3 className="font-medium text-white mb-1">Prochaines étapes</h3>
            <p className="text-white/80 text-sm">
              Nous vous contacterons bientôt pour confirmer votre adhésion et
              finaliser votre abonnement.
            </p>
          </div>
          <p className="text-white/70 text-sm">
            Pour toute question, n&apos;hésitez pas à nous contacter au{" "}
            <span className="font-semibold text-white">+216 XX XXX XXX</span> ou
            par email à{" "}
            <span className="font-semibold text-white">
              contact@tigergym.tn
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
