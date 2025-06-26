
import { Member } from "@/types/Member";
import Card from "./card";

export default function MedicalInfoCard({ member }: { member: Member }) {
  const medical = member.medicalRecord;
  if (!medical) return null;

  return (
    <Card title="Informations médicales">
      <div className="space-y-3">
        <p>
          <span className="text-sm text-gray-500">Certificat médical</span>
          <br />
          <span className="font-medium">
            {medical.hasMedicalCertificate
              ? `Fourni${
                  medical.medicalCertificateDate
                    ? ` (${new Date(
                        medical.medicalCertificateDate
                      ).toLocaleDateString()})`
                    : ""
                }`
              : "Non fourni"}
          </span>
        </p>
        {medical.allergies && (
          <p>
            <span className="text-sm text-gray-500">Allergies</span>
            <br />
            <span className="font-medium">{medical.allergies}</span>
          </p>
        )}
        {medical.healthIssues && (
          <p>
            <span className="text-sm text-gray-500">Problèmes de santé</span>
            <br />
            <span className="font-medium">{medical.healthIssues}</span>
          </p>
        )}
        {medical.contraindications && (
          <p>
            <span className="text-sm text-gray-500">Contre-indications</span>
            <br />
            <span className="font-medium">{medical.contraindications}</span>
          </p>
        )}
      </div>
    </Card>
  );
}
