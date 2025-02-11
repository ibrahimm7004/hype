import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

const SchedulePost = () => {
  const [tweet, setTweet] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");

  const handleSchedule = () => {
    if (!tweet.trim() || !scheduleDate) {
      alert("Please enter a tweet and select a date/time.");
      return;
    }
    alert(`Tweet scheduled for ${format(new Date(scheduleDate), "PPpp")}`);
    setTweet("");
    setScheduleDate("");
  };

  return (
    <Card className="max-w-lg mx-auto p-4 shadow-lg rounded-2xl bg-white">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Schedule a Tweet</h2>
        <Textarea
          placeholder="What's happening?"
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          className="w-full border p-2 rounded-md"
          maxLength={280}
        />
        <div className="flex items-center gap-2 mt-4">
          <CalendarIcon className="w-5 h-5 text-gray-500" />
          <Input
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            className="border p-2 rounded-md w-full"
          />
        </div>
        <Button
          className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          onClick={handleSchedule}
        >
          <Send className="w-5 h-5" />
          Schedule Tweet
        </Button>
      </CardContent>
    </Card>
  );
};

export default SchedulePost;
