import { Destination } from "../redux/type";

export const calculateDistance = (
  dest1: Destination,
  dest2: Destination
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const lat1 = dest1.lat * (Math.PI / 180); // Convert degrees to radians
  const lng1 = dest1.lng * (Math.PI / 180);
  const lat2 = dest2.lat * (Math.PI / 180);
  const lng2 = dest2.lng * (Math.PI / 180);

  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; 

  return distance;
};

export const calculateTravelTime = (
  distance: number,
  speedKmPerHour: number
): number => {
  const travelTimeInHours = distance / speedKmPerHour;
  const totalMinutes = travelTimeInHours * 60 + 10; 

  return Math.round(totalMinutes); 
};
export const formatTravelTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return hours > 0 ? `${hours} giờ ${minutes} phút` : `${minutes} phút`;
};

