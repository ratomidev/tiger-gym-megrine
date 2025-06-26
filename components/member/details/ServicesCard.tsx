import { Member } from "@/types/Member";
import Card from "./card";

export default function ServicesCard({ member }: { member: Member }) {
  const services = member.services;
  if (!services) return null;

  const activeServices = Object.entries(services)
    .filter(([active]) => active)
    .map(([service]) => service.charAt(0).toUpperCase() + service.slice(1));

  return (
    <Card title="Services">
      <ul className="space-y-2">
        {activeServices.length > 0 ? (
          activeServices.map((service) => (
            <li key={service} className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {service}
            </li>
          ))
        ) : (
          <li>Aucun service sélectionné</li>
        )}
      </ul>
    </Card>
  );
}
