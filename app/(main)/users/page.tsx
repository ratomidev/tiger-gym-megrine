import UsersList from "@/components/users/usersList";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Utilisateurs - Tiger Gym",
};
export default function UsersPage() {
  return <UsersList />;
}
