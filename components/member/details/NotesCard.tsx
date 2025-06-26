import { Member } from "@/types/Member";
import Card from "./card";

export default function NotesCard({ member }: { member: Member }) {
  return (
    <Card title="Notes">
      <p>{member.notes}</p>
    </Card>
  );
}
