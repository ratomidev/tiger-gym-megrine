import { Member } from "@/types/Member";
import Card from "./card";

export default function SubscriptionCard({ member }: { member: Member }) {
  const typeMap: Record<string, string> = {
    monthly: "Mensuel",
    quarterly: "Trimestriel",
    biannual: "Semestriel",
    annual: "Annuel",
  };

  return (
    <Card title="Abonnement">
      <div className="space-y-3">
        <p>
          <span className="text-sm text-gray-500">Type d&apos;abonnement</span>
          <br />
          <span className="font-medium">
            {typeMap[member.subscriptionType] || member.subscriptionType}
          </span>
        </p>
        <p>
          <span className="text-sm text-gray-500">Date d&apos;inscription</span>
          <br />
          <span className="font-medium">
            {new Date(member.inscriptionDate).toLocaleDateString()}
          </span>
        </p>
        <p>
          <span className="text-sm text-gray-500">
            Début de l&apos;abonnement
          </span>
          <br />
          <span className="font-medium">
            {new Date(member.subscriptionStartDate).toLocaleDateString()}
          </span>
        </p>
        <p>
          <span className="text-sm text-gray-500">
            Fin de l&apos;abonnement
          </span>
          <br />
          <span className="font-medium">
            {new Date(member.subscriptionEndDate).toLocaleDateString()}
          </span>
        </p>
        <p>
          <span className="text-sm text-gray-500">Statut</span>
          <br />
          <span
            className={`font-medium px-2 py-1 rounded-full text-xs inline-block ${
              member.subscriptionStatus === "actif"
                ? "bg-green-100 text-green-800"
                : member.subscriptionStatus === "expiré"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {member.subscriptionStatus}
          </span>
        </p>
      </div>
    </Card>
  );
}
