import { Member } from "@/types/Member";
import Card from "./card";

export default function AddressCard({ member }: { member: Member }) {
  if (!member.address) return null;
  const { street, city, postalCode, country } = member.address;

  return (
    <Card title="Adresse">
      <div className="space-y-3">
        {street && (
          <p>
            <span className="text-sm text-gray-500">Rue</span>
            <br />
            <span className="font-medium">{street}</span>
          </p>
        )}
        {city && (
          <p>
            <span className="text-sm text-gray-500">Ville</span>
            <br />
            <span className="font-medium">{city}</span>
          </p>
        )}
        {postalCode && (
          <p>
            <span className="text-sm text-gray-500">Code postal</span>
            <br />
            <span className="font-medium">{postalCode}</span>
          </p>
        )}
        <p>
          <span className="text-sm text-gray-500">Pays</span>
          <br />
          <span className="font-medium">{country}</span>
        </p>
      </div>
    </Card>
  );
}
