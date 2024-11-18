// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import destinationsSlice from "../../components/Maps/destinationsSlice";
import userReducer, { UserState } from "../../components/Login/userSlice";
import blogsReducer, { BlogsState } from "../../components/Blogs/BlogsSlice";
import { DestinationsState } from "../type";
import travelTypeReducer, { TravelTypesState } from "../../components/TypePage/TypeSlice";

export type State = {
  destinations: DestinationsState;
  blogs: BlogsState; 
  user: UserState;
  travelType: TravelTypesState
};

// Configuration for persisting destinations slice
const destinationsPersistConfig = {
  key: "destinations",
  storage,
};

// Create a persisted reducer for destinations
const persistedDestinationsReducer = persistReducer(
  destinationsPersistConfig,
  destinationsSlice
);

// Configure the Redux store
export const store = configureStore({
  reducer: {
    destinations: persistedDestinationsReducer,
    blogs: blogsReducer,
    user: userReducer,
    travelType: travelTypeReducer
  },
});

// Export types and persistor
export type RootState = ReturnType<typeof store.getState>;
export const persistor = persistStore(store);
