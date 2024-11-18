/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";

export const useDestinationSearch = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async (query: string) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(
        `http://localhost:8888/api/v1/location/locations?q=${query}&limit=3`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.code === 1000) {
        const results = response.data.result.map((item: any) => ({
          place_id: item.place_id,
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon,
          state: item.address?.state || "No state",
          city: item.address?.city || "No city",
        }));
        setSearchResults(results);
        setError(null);
      } else {
        setError(response.data.message || "No results found");
      }
    } catch (err) {
      setError("Failed to fetch search results. Please try again.");
      console.error("Search Error:", err);
    }
  };

  const debouncedFetchResults = useCallback(
    debounce((query: string) => fetchResults(query), 500),
    []
  );

  return { searchResults, error, debouncedFetchResults };
};
