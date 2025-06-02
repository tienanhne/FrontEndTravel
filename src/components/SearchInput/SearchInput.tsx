/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDestinationSearch } from "../../hooks/useDestinationSearch";
import { useRecommendDestinations } from "./useRecommendDestinations";
import { RootState } from "../../redux/store/store";
import ListPlaceOfInput from "./ListPlaceOfInput";

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
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { searchResults, setSearchResults, debouncedFetchResults, error } =
    useDestinationSearch();
  const { recommendations, fetchRecommendations, setRecommendations } =
    useRecommendDestinations();
  const results = useSelector((state: RootState) => state.destinations.results);

  const isDestinationInResults = (result: any) =>
    results.some(
      (d: any) =>
        d.id === dayId &&
        d.destinations.some(
          (dest: any) => dest.location.place_id === result.place_id
        )
    );

  const displayResults =
    searchResults.length > 0 ? searchResults : recommendations;

  useEffect(() => {
    if (query.length > 2) {
      debouncedFetchResults(query);
    }
  }, [query, debouncedFetchResults]);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleFocus = () => {
    setFocused(true);
    if (!query) {
      const day = results.find((d: any) => d.id === dayId);
      if (day?.destinations?.length) {
        const last = day.destinations[day.destinations.length - 1];
        fetchRecommendations(last.location.lat, last.location.lon);
      }
    }
  };

  const handleBlur = () => {
    setTimeout(() => setFocused(false), 150);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    if (val.length <= 2) {
      setSearchResults([]);
      setRecommendations([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" || e.key === "ArrowRight") {
      const match = displayResults.find((item: any) =>
        item.display_name?.toLowerCase().startsWith(query.toLowerCase())
      );
      if (match) {
        e.preventDefault();
        setQuery(match.display_name);
        onChange(match.display_name);
      }
    }
  };

  const suggestion =
    query.length > 0
      ? displayResults.find((item: any) =>
          item.display_name?.toLowerCase().startsWith(query.toLowerCase())
        )?.display_name
      : "";

  const autoCompleteTail =
    suggestion && suggestion.length > query.length
      ? suggestion.slice(query.length)
      : "";

  const handleResultSelect = (result: any) => {
    onSelectResult(result, dayId);
    setQuery("");
    onChange("");
    setSearchResults([]);
    setRecommendations([]);
  };

  return (
    <div className="relative w-full mt-3">
      <div className="relative">
        {/* Suggest tail overlay */}
        <div className="absolute inset-0 px-4 py-2 text-sm text-gray-400 pointer-events-none whitespace-nowrap overflow-hidden z-10 font-mono">
          <span className="invisible">{query}</span>
          <span className="opacity-50">{autoCompleteTail}</span>
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Thêm mới địa điểm..."
          className="w-full font-mono bg-transparent text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-20"
          autoComplete="off"
        />
      </div>

      {/* Error */}
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}

      {/* Results dropdown */}
      {focused && displayResults.length > 0 && (
        <div className="absolute z-30 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md mt-2 overflow-auto max-h-64">
          <ListPlaceOfInput
            resultDestination={displayResults}
            isDestinationInResults={isDestinationInResults}
            handleResultSelect={handleResultSelect}
          />
        </div>
      )}
    </div>
  );
};

export default SearchInput;
