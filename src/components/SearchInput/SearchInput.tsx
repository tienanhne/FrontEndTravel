/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useDestinationSearch } from "../../hooks/useDestinationSearch";

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
  const { searchResults, error, debouncedFetchResults } = useDestinationSearch();

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
          onChange(e.target.value); // Update the parent state as well
        }}
        placeholder="Thêm mới địa điểm"
        className="w-full search-input bg-gray-100 mt-3 dark:text-primary rounded-full p-2"
      />
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {query && searchResults.length > 0 && (
        <ul className="top-full mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 max-h-40 overflow-auto">
          {searchResults.map((result, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 overflow-hidden whitespace-nowrap text-ellipsis"
              onClick={() => handleResultSelect(result)} // Select result on click
            >
              {result.display_name || "No name"}, {result.city || "Unknown"}, {result.state || "Unknown"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
