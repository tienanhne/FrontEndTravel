/* eslint-disable @typescript-eslint/no-explicit-any */
// For API Results
export interface Address {
  housenumber: string;
  road: string;
  quarter: string;
  suburb: string;
  city: string;
  state: string;
  postcode: string;
  country_code: string;
  country: string;
}

export interface Thumbnail {
  id: number;
  url: string;
  caption: string;
}

export interface Collection {
  id: number;
  url: string;
  caption: string;
}

export interface Location {
  place_id: number;
  category: string;
  display_name: string;
  lon: string;
  lat: string;
  name: string;
  type: string;
  address: Address;
  thumbnail: Thumbnail;
  boundingbox: string[];
  timeVisit: number;
}
export interface AddDestinationPayload {
  day: string;
  newDestination: Destination;
}
// Destination contains the location information
export interface Destination {
  id: number;
  position: number;
  location: Location;
}

// Result returned from the API with destination information
export interface Result {
  id: number;
  note: string;
  day: string;
  destinations: Destination[];
}

// Redux state for destinations, incorporating both old and new data
export interface DestinationsState {
  id: number;
  title: string;
  code: string;
  startDate: Date;
  endDate: Date;
  image: string;
  permission: string;
  location: Location | null;
  results: Result[]; // New field for the results from the API
  totalTime: number;
  selectedDay: string | null;
  isViewingMap: boolean;
  destText: string;
}

// CityType for handling city details (if needed)
export interface CityType {
  id: string;
  name: string;
  name_en: string;
  full_name: string;
  full_name_en: string;
  latitude: string;
  longitude: string;
}

// Additional interfaces like LoginInput, LoginResponse for handling auth
export interface LoginResponse {
  code: number;
  message: string;
  result: {
    accessToken: string;
    refreshToken: string;
    type: string;
  };
}

export interface LoginInput {
  email: string;
  password: string;
}

// DistanceData can be used to handle travel details (if needed)
export interface DistanceData {
  distance: number;
  travelTime: any;
}
