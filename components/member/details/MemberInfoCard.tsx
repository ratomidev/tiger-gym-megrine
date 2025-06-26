import { Member } from "@/types/Member";
import Image from "next/image";
import Card from "./card";

export function MemberInfoCard({ member }: { member: Member }) {
  return (
    <Card title="Informations personnelles">
      {member.photoUrl && (
        <div className="mb-6 flex justify-center">
          <Image
            src={member.photoUrl}
            alt={`${member.firstname} ${member.lastname}`}
            width={128}
            height={128}
            className="w-32 h-32 object-cover rounded-full border-2 border-gray-200"
          />
        </div>
      )}
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">N° d&apos;adhérent</p>
          <p className="font-medium">{member.membershipNumber}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Nom complet</p>
          <p className="font-medium">
            {member.firstname} {member.lastname}
          </p>
        </div>
        {member.sexe && (
          <div>
            <p className="text-sm text-gray-500">Sexe</p>
            <p className="font-medium">
              {member.sexe === "male" ? "Homme" : "Femme"}
            </p>
          </div>
        )}
        {member.birthdate && (
          <div>
            <p className="text-sm text-gray-500">Date de naissance</p>
            <p className="font-medium">
              {new Date(member.birthdate).toLocaleDateString()}
            </p>
          </div>
        )}
        {member.email && (
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{member.email}</p>
          </div>
        )}
        {member.tel && (
          <div>
            <p className="text-sm text-gray-500">Téléphone</p>
            <p className="font-medium">{member.tel}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
