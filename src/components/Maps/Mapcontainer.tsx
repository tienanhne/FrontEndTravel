import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import osmProvider from "../../osm-provider";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";
import RouteMap from "./RouteMap";
import NewPlaceForm from "./NewPlaceForm";
import LocationPopup from "./LocationPopup";
import { setAPIResultData } from "./destinationsSlice";
import PlaceSearchComponent from "./PlaceSearchComponent";

const markerColors = [
  "red",
  "blue",
  "green",
  "purple",
  "orange",
  "yellow",
  "pink",
  "cyan",
];

const createNumberedIcon = (number: number | string, color: string) => {
  return new L.DivIcon({
    html: `<div style="background-color: ${color}; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; font-size: 18px; align-items: center; justify-content: center;">${number}</div>`,
    iconSize: [30, 30],
    className: "numbered-icon",
  });
};

const MapClickHandler: React.FC<{
  onMapClick: (lat: number, lng: number) => void;
}> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapComponent: React.FC = () => {
  const [clickedPosition, setClickedPosition] = useState<
    [number, number] | null
  >(null);
  const dispatch = useDispatch();

  // Lấy trip từ Redux state
  const trip = useSelector((state: RootState) => state.destinations);
  const tripId = trip?.id;
  const results = useSelector((state: RootState) => state.destinations.results);
  const [clickedPlaceName, setClickedPlaceName] = useState<string | null>(null);
  const [selectedPopup, setSelectedPopup] = useState<number | null>(null); // Allow `number` or `null` as the type
  useEffect(() => {
    const fetchItinerary = async () => {
      if (tripId) {
        try {
          const accessToken = localStorage.getItem("accessToken");

          const response = await fetch(
            `${import.meta.env.VITE_BASE_API}/trip/itineraries/${tripId}/trip`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();

          dispatch(setAPIResultData(data.result));
        } catch (error) {
          console.error("Error fetching itinerary:", error);
        }
      }
    };

    fetchItinerary();
  }, [tripId, dispatch]);
  const handleMapClick = async (lat: number, lng: number) => {
    console.log("Clicked position:", lat, lng);
    setClickedPosition([lat, lng]);
    const placeName = await fetchPlaceName(lat, lng);
    setClickedPlaceName(placeName);
  };

  const handleDeletePlace = () => {
    setClickedPosition(null);
  };

  const fetchPlaceName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || "Unknown Place";
    } catch (error) {
      console.error("Error fetching place name:", error);
      return "Unknown Place";
    }
  };

  const defaultPosition: L.LatLngExpression = [21.0285, 105.8542];
  const position: L.LatLngExpression = trip.location
    ? [parseFloat(trip.location.lat), parseFloat(trip.location.lon)]
    : defaultPosition;

  return (
    <MapContainer center={position} zoom={13} className="w-full h-full">
      <TileLayer
        url={osmProvider.maptiler.url}
        attribution={osmProvider.maptiler.attribution}
      />

      <MapClickHandler onMapClick={handleMapClick} />

      {clickedPosition && (
        <Marker
          position={clickedPosition}
          icon={createNumberedIcon("+", "black")}
        >
          <Popup>
            <NewPlaceForm
              lat={clickedPosition[0]}
              lng={clickedPosition[1]}
              placeName={clickedPlaceName}
              onDelete={handleDeletePlace}
            />
          </Popup>
        </Marker>
      )}

      {results &&
        results.map(
          (day, dayIndex) =>
            day.destinations &&
            day.destinations.map((destination, index) => {
              const lat = parseFloat(destination.location.lat);
              const lon = parseFloat(destination.location.lon);
              if (isNaN(lat) || isNaN(lon)) return null;

              return (
                <Marker
                  key={destination.id}
                  position={[lat, lon]}
                  icon={createNumberedIcon(
                    index + 1,
                    markerColors[dayIndex % markerColors.length]
                  )}
                >
                  <Popup className="w-[340px]">
                    {selectedPopup === destination.id ? (
                      <PlaceSearchComponent lat={lat} lng={lon} id={destination.id} />
                    ) : (
                      <LocationPopup
                        lat={lat}
                        lng={lon}
                        selectedDate={day.day.toString()}
                      />
                    )}
                    <button
                      onClick={() =>
                        setSelectedPopup(
                          selectedPopup === destination.id
                            ? null
                            : destination.id
                        )
                      }
                      className="text-teal-600 mt-2 underline"
                    >
                      {selectedPopup === destination.id
                        ? "Xem thông tin địa điểm"
                        : "Tìm kiếm các địa điểm lân cận"}
                    </button>
                  </Popup>
                </Marker>
              );
            })
        )}
      <RouteMap days={results} />
    </MapContainer>
  );
};

export default MapComponent;
