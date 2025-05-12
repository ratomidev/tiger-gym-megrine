"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Rocket, BarChart2, FileText } from "lucide-react";

export default function ChatPage() {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="min-h-screen max-w-screen-lg mx-auto flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold mb-12 text-center">
        What can I help with?
      </h1>

      {/* Chat Input Card */}

      <Card className="w-full max-w-3xl border-none shadow-none">
        <div className="p-4">
          <div className="relative">
            <Input
              placeholder="Ask anything"
              className="pl-4 pr-10 py-6 text-base rounded-xl"
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </Card>
      {/* Suggestion Chips */}
      <div className="flex flex-wrap gap-2 mt-6 justify-center">
        <Button
          variant="outline"
          className="rounded-full flex items-center gap-2"
        >
          <Search size={16} />
          <span>Get advice</span>
        </Button>
        <Button
          variant="outline"
          className="rounded-full flex items-center gap-2"
        >
          <BarChart2 size={16} />
          <span>Analyze data</span>
        </Button>
        <Button
          variant="outline"
          className="rounded-full flex items-center gap-2"
        >
          <FileText size={16} />
          <span>Summarize text</span>
        </Button>
        <Button
          variant="outline"
          className="rounded-full flex items-center gap-2"
        >
          <Rocket size={16} />
          <span>Surprise me</span>
        </Button>
        <Button variant="outline" className="rounded-full">
          <span>More</span>
        </Button>
      </div>
    </div>
  );
}
