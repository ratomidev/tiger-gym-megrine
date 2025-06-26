

import { Button } from "@/components/ui/button";
import Card from "./card";
import { Member } from "@/types/Member";

export default function ActionsCard({ member }: { member: Member }) {
  return (
    <Card title="Actions">
      <div className="flex flex-col space-y-2">
        <Button
          variant="outline"
          onClick={() =>
            (window.location.href = `/edit-member?id=${member.id}`)
          }
          className="w-full justify-start"
        >
          Modifier les informations
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start text-red-600 hover:text-red-700"
        >
          Désactiver l&apos;adhérent
        </Button>
      </div>
    </Card>
  );
}
