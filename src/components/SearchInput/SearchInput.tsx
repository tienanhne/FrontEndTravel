/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useDestinationSearch } from "../../hooks/useDestinationSearch";
import { RootState } from "../../redux/store/store";
import { useSelector } from "react-redux";

interface SearchInputProps {
  value: string;
  onSelectResult: (result: any, dayId: number) => void;
  onChange: (value: string) => void;
  dayId: number;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onSelectResult,
  onChange,
  dayId,
  value,
}) => {
  const [query, setQuery] = useState(value || "");
  const { searchResults, error, debouncedFetchResults } =
    useDestinationSearch();
  const results = useSelector((state: RootState) => state.destinations.results);

  const isDestinationInResults = (result: any) => {
    const isInResults = results.some((destination: any) => {
      if (destination.id === dayId) {
        const condition = destination.destinations.some((d: any) => {
          // Kiểm tra place_id có khớp với result.place_id không
          return d.location.place_id === result.place_id;
        });
        // Trả về condition nếu destination.id === dayId và place_id khớp
        return condition;
      }
      // Nếu destination.id không bằng dayId, không cần kiểm tra các điều kiện tiếp theo
      return false;
    });
    return isInResults;
  };

  useEffect(() => {
    if (query.length > 2) {
      debouncedFetchResults(query);
    }
  }, [query, debouncedFetchResults]);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleResultSelect = (result: any) => {
    onSelectResult(result, dayId);
    setQuery("");
    onChange("");
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Thêm mới địa điểm"
        className="w-full search-input bg-gray-100 mt-3 dark:text-primary rounded-full p-2"
      />
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {query && searchResults.length > 0 && (
        <ul className="top-full mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 max-h-40 overflow-auto relative">
          {searchResults.map((result, index) => {
            const isAdded = isDestinationInResults(result);

            return (
              <li
                key={index}
                className={`p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 overflow-hidden whitespace-nowrap text-ellipsis relative ${
                  isAdded ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => !isAdded && handleResultSelect(result)}
              >
                {isAdded && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center text-white text-sm font-semibold opacity-80">
                    Đã có địa điểm này trong lịch trình
                  </div>
                )}
                {result.display_name || "No name"}, {result.city || "Unknown"},{" "}
                {result.state || "Unknown"}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
