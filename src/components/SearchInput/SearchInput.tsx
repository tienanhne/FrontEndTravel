/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useDestinationSearch } from "../../hooks/useDestinationSearch";
import { RootState } from "../../redux/store/store";
import { useSelector } from "react-redux";
import { useRecommendDestinations } from "./useRecommendDestinations";
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

  const { searchResults, setSearchResults, error, debouncedFetchResults } =
    useDestinationSearch();
  const { recommendations, setRecommendations, fetchRecommendations } = useRecommendDestinations();
  const results = useSelector((state: RootState) => state.destinations.results);

  const isDestinationInResults = (result: any) => {
    return results.some(
      (destination: any) =>
        destination.id === dayId &&
        destination.destinations.some(
          (d: any) => d.location.place_id === result.place_id
        )
    );
  };

  // Trigger tìm kiếm
  useEffect(() => {
    if (query.length > 2) {
      debouncedFetchResults(query);
    }
  }, [query,debouncedFetchResults]);

  // Reset input
  useEffect(() => {
    setQuery(value);
  
  }, [value]);

  // Gọi API recommend khi focus nếu chưa có query
  const handleFocus = () => {
    setFocused(true);
    if (query === "") {
      // Lấy ngày đang focus theo dayId
      const currentDay = results.find((day: any) => day.id === dayId);
      if (currentDay && currentDay.destinations.length > 0) {
        const last =
          currentDay.destinations[currentDay.destinations.length - 1];
        if (last) {
          const lat = last.location.lat;
          const lon = last.location.lon;
          fetchRecommendations(lat, lon);
        }
      }
      console.log("recommend", recommendations);
    }
  };

  const handleResultSelect = (result: any) => {
    onSelectResult(result, dayId);
    console.log("selected result:", result);
    setQuery("");
    onChange("");
    setSearchResults([]);
    setRecommendations([]); 
  };



  return (
    <div>
      <input
        type="text"
        value={query}
        onFocus={handleFocus}
        onBlur={() => setFocused(false)}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setRecommendations([]); 
        }}
        placeholder="Thêm mới địa điểm"
        className="w-full search-input bg-gray-100 mt-3 dark:text-primary rounded-full p-2"
      />
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {(recommendations.length > 0 || searchResults.length > 0) && (
        <ListPlaceOfInput
          resultDestination={searchResults.length > 0 ? searchResults : recommendations}
          isDestinationInResults={isDestinationInResults}
          handleResultSelect={handleResultSelect}
        />
      )}
    </div>
  );
};

export default SearchInput;
