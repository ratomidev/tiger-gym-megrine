"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MemberTable } from "@/components/member/MemberTable";
import Loading from "./loading";
import { Member } from "@/components/member/types";
import { sub } from "date-fns";
export default function MemberListPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/members/list");
        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full max-w-6xl px-4 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Liste des Adhérents</h1>
        <Button
          onClick={() => (window.location.href = "/add-member")}
          className="bg-black hover:bg-gray-800 text-white"
        >
          Ajouter un adhérent
        </Button>
      </div>
      <MemberTable
        members={members}
        defaultColumnVisibility={{
          firstname: true,
          lastname: true,
          tel: true,
          subscriptionStatus: true,
          subscriptionType: true,
          subscriptionEndDate: true,
        }}
      />
    </div>
  );
}
