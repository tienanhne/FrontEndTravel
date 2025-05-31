/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface ListPlaceOfInputProps {
  resultDestination: any[];
  isDestinationInResults: (result: any) => boolean;
  handleResultSelect: (result: any) => void;
}

const ListPlaceOfInput: React.FC<ListPlaceOfInputProps> = ({
  resultDestination,
  isDestinationInResults,
  handleResultSelect,
}) => {
  return (
    <div>
      <ul className="top-full mt-2 w-full bg-white  dark:bg-gray-800 shadow-lg rounded-md z-10 max-h-40 overflow-auto relative">
        {resultDestination.map((result, index) => {
          const isAdded = isDestinationInResults(result);
          return (
            <li
              key={index}
              className={`p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 overflow-hidden whitespace-nowrap text-ellipsis relative ${
                isAdded ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => {
                if (isAdded) {
                  alert("Địa điểm này đã có trong lịch trình!");
                } else {
                    console.log("Selected result:", result);
                  handleResultSelect(result);
                }
              }}
            >
              {isAdded && (
                <div className="absolute cursor-not-allowed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-white text-sm font-semibold opacity-80">
                  Đã có địa điểm này trong lịch trình
                </div>
              )}
              {result.display_name || "No name"}, {result.city || "Unknown"},{" "}
              {result.state || "Unknown"}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ListPlaceOfInput;
