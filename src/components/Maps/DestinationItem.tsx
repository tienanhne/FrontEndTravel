import React from "react";
import { Destination } from "../../redux/type";

// Helper function to truncate text
const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

interface DestinationItemProps {
  destination: Destination;
  onRemove: () => Promise<void>; 
  canRemove: boolean; 
}

const DestinationItem: React.FC<DestinationItemProps> = ({
  destination,
  onRemove,
  canRemove, 
}) => (
  <li className="flex items-center justify-between p-3 border-b w-full border-gray-200 dark:border-gray-700 relative">
    <div className="flex items-center text-left pr-10">
      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
      <span className="text-gray-800 dark:text-white">
        {truncateText(destination.location.display_name, 35)}
      </span>
    </div>
    {canRemove && ( 
      <button
        onClick={onRemove}
        className="absolute remove-destination-button right-3 flex-shrink-0 text-red-500 bg-slate-200 p-2 rounded hover:bg-red-200 dark:hover:bg-red-300 transition-colors duration-200"
      >
        X
      </button>
    )}
  </li>
);

export default DestinationItem;
