// src/components/shared/DateTimePicker.js

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays } from "lucide-react";

const DateTimePicker = ({ selectedDate, onChange }) => {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        📅 Schedule Date & Time
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <CalendarDays size={18} />
        </span>
        <DatePicker
          selected={selectedDate}
          onChange={onChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="Pp"
          minDate={new Date()}
          placeholderText="Select date and time"
          className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>
    </div>
  );
};

export default DateTimePicker;
