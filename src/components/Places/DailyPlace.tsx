// src/components/DailyPlace.tsx
import React from 'react';

interface PlanItem {
  time: string;
  place: string;
  coordinates: string;
  description: string;
  place_details: string;
  image_url: string;
  ticket_pricing: string;
  travel_time: string;
}

interface DayPlan {
  day: number;
  theme: string;
  plan: PlanItem[];
}

interface DailyPlaceProps {
  dayPlan: DayPlan;
}

const DailyPlace: React.FC<DailyPlaceProps> = ({ dayPlan }) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-3">Ngày {dayPlan.day} - {dayPlan.theme}</h3>
      <div className="space-y-4">
        {dayPlan.plan.map((item, index) => (
          <div key={index} className="border p-4 rounded-md shadow-md">
            <h4 className="text-lg font-semibold mb-2">{item.place}</h4>
            <img src={item.image_url} alt={item.place} className="w-full h-48 object-cover mb-2" />
            <p><strong>Thời gian:</strong> {item.time}</p>
            <p><strong>Chi tiết:</strong> {item.description}</p>
            <p><strong>Thông tin:</strong> {item.place_details}</p>
            <p><strong>Giá vé:</strong> {item.ticket_pricing}</p>
            <p><strong>Thời gian di chuyển:</strong> {item.travel_time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyPlace;
