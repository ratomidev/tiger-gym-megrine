"use client";

import { useState } from "react";
import { Search, Star, Trash2, Mail } from "lucide-react";

export default function InboxPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Alice Johnson",
      email: "alice.johnson@example.com",
      subject: "Project Deadline Extension",
      content:
        "Hi Team,\n\nI'm writing to inform you that we've been granted a two-week extension for the client project. This gives us more time to refine the UX/UI aspects that we discussed in our last meeting.\n\nThe new deadline is June 1st, 2025. Let's use this time wisely to deliver exceptional quality.\n\nPlease let me know if you have any questions.\n\nBest regards,\nAlice",
      date: "Today, 10:23 AM",
      read: false,
      starred: true,
      hasAttachment: false,
      labels: ["work", "important"],
    },
    {
      id: 2,
      sender: "David Smith",
      email: "d.smith@designstudio.com",
      subject: "New Design Mockups",
      content:
        "Hey,\n\nI've attached the latest mockups for the dashboard redesign. I've incorporated all the feedback from our last review session.\n\nThe main changes include:\n• Simplified navigation structure\n• New color scheme aligned with brand guidelines\n• Improved data visualization components\n• Mobile-responsive layouts\n\nLet me know what you think!\n\nRegards,\nDavid",
      date: "Today, 8:47 AM",
      read: false,
      starred: false,
      hasAttachment: true,
      labels: ["design", "work"],
    },
    {
      id: 3,
      sender: "Marketing Team",
      email: "marketing@company.com",
      subject: "Q2 Campaign Strategy",
      content:
        "Team,\n\nAttached is our comprehensive strategy for the Q2 marketing campaigns. We'll be focusing on three main channels:\n\n1. Social Media - Increased video content and engagement tactics\n2. Email Marketing - Personalized customer journeys based on recent data\n3. Partner Co-marketing - Leveraging our new strategic partnerships\n\nWe'll review this in detail during tomorrow's meeting.\n\nBest,\nMarketing Team",
      date: "Yesterday",
      read: true,
      starred: true,
      hasAttachment: true,
      labels: ["marketing"],
    },
    {
      id: 4,
      sender: "HR Department",
      email: "hr@company.com",
      subject: "New Remote Work Policy",
      content:
        "Dear All,\n\nWe're pleased to announce our updated remote work policy, effective June 1st, 2025.\n\nKey highlights:\n• Flexible 3/2 work arrangement (3 days remote, 2 days in office)\n• Core hours from 10 AM to 3 PM for team collaboration\n• Enhanced home office stipend\n• Quarterly in-person team building events\n\nPlease review the attached document for full details and don't hesitate to reach out with any questions.\n\nBest regards,\nHR Team",
      date: "May 15",
      read: true,
      starred: false,
      hasAttachment: true,
      labels: ["hr", "important"],
    },
    {
      id: 5,
      sender: "Tech Support",
      email: "support@company.com",
      subject: "Scheduled System Maintenance",
      content:
        "Important Notice:\n\nWe will be performing scheduled maintenance on our servers this weekend.\n\nMaintenance window: Saturday, May 20th, from 11 PM to 4 AM (EST)\n\nDuring this time, the following systems will be unavailable:\n• Email services\n• Project management tools\n• Internal knowledge base\n\nPlease save your work and log out before the maintenance begins.\n\nThank you for your understanding,\nIT Support Team",
      date: "May 14",
      read: true,
      starred: false,
      hasAttachment: false,
      labels: ["system"],
    },
    {
      id: 6,
      sender: "Sarah Williams",
      email: "sarahw@partner.org",
      subject: "Collaboration Opportunity",
      content:
        "Hello,\n\nI'm reaching out from Partner Organization regarding a potential collaboration opportunity. We've been following your recent projects and believe there could be strong synergies between our teams.\n\nWould you be available for a brief call next week to discuss this further?\n\nLooking forward to your response,\nSarah Williams\nPartnership Director",
      date: "May 12",
      read: true,
      starred: false,
      hasAttachment: false,
      labels: ["partnership"],
    },
  ]);

  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectMessage = (id: number) => {
    setSelectedMessage(id);
    setMessages(
      messages.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
    );
  };

  const handleStarMessage = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setMessages(
      messages.map((msg) =>
        msg.id === id ? { ...msg, starred: !msg.starred } : msg
      )
    );
  };

  const handleDeleteMessage = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setMessages(messages.filter((msg) => msg.id !== id));
    if (selectedMessage === id) {
      setSelectedMessage(null);
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Simple Header */}
      <div className="border-b px-6 py-4 bg-white">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Inbox</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-3 py-1.5 border rounded-md focus:outline-none w-48"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-4 h-4 absolute left-2.5 top-2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Message List - Simplified */}
        <div className="w-2/5 border-r overflow-y-auto">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-50 ${
                  !message.read ? "font-medium" : ""
                } ${selectedMessage === message.id ? "bg-blue-50" : ""}`}
                onClick={() => handleSelectMessage(message.id)}
              >
                <div className="flex justify-between items-center">
                  <span>{message.sender}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleStarMessage(e, message.id)}
                      className="text-gray-400 hover:text-yellow-500"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          message.starred
                            ? "fill-yellow-400 text-yellow-400"
                            : ""
                        }`}
                      />
                    </button>
                    <span className="text-xs text-gray-500">
                      {message.date}
                    </span>
                  </div>
                </div>
                <div className="text-sm mt-1 truncate">{message.subject}</div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No messages found
            </div>
          )}
        </div>

        {/* Message Content - Simplified */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {selectedMessage ? (
            <div className="p-6">
              {messages
                .filter((m) => m.id === selectedMessage)
                .map((message) => (
                  <div key={message.id} className="bg-white rounded p-6">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b">
                      <h2 className="text-lg font-medium">{message.subject}</h2>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleDeleteMessage(e, message.id)}
                          className="p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          onClick={(e) => handleStarMessage(e, message.id)}
                          className="p-1 hover:bg-yellow-50 rounded"
                        >
                          <Star
                            className={`h-4 w-4 ${
                              message.starred
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-500"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="font-medium">{message.sender}</div>
                      <div className="text-xs text-gray-500">
                        {message.email} • {message.date}
                      </div>
                    </div>

                    <div className="text-sm text-gray-800 whitespace-pre-line">
                      {message.content}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Mail className="h-8 w-8 mb-2" />
              <p className="text-sm">Select a message</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
