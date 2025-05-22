"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface PhoneAuthButtonProps {
  onClick: () => void;
}

export function PhoneAuthButton({ onClick }: PhoneAuthButtonProps) {
  return (
    <Button
      variant="outline"
      type="button"
      onClick={onClick}
      className="w-full"
    >
      <Icons.phone className="mr-2 h-4 w-4" />
      Phone
    </Button>
  );
}