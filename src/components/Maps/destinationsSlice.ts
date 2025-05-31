import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DestinationsState, Location, Result } from "../../redux/type";
import { set } from "lodash";

const initialState: DestinationsState = {
  id: 0,
  title: "",
  code: "",
  startDate: new Date(),
  endDate: new Date(),
  image: "",
  permission: "",
  location: null,
  results: [],
  totalTime: 0,
  selectedDay: null,
  isViewingMap: true,
  destText: "",
};

const destinationsSlice = createSlice({
  name: "destinations",
  initialState,
  reducers: {
    setDestinationDetails: (
      state,
      action: PayloadAction<{
        id: number;
        title: string;
        code: string;
        startDate: string;
        endDate: string;
        image: string;
        permission: string;
        location: Location;
      }>
    ) => {
      const {
        id,
        title,
        code,
        startDate,
        endDate,
        image,
        permission,
        location,
      } = action.payload;

      state.id = id;
      state.title = title;
      state.code = code;
      state.startDate = new Date(startDate);
      state.endDate = new Date(endDate);
      state.image = image;
      state.permission = permission;
      state.location = location;
    },

    setAPIResultData: (state, action: PayloadAction<Result[]>) => {
      state.results = action.payload;
    },

    updateResult: (state, action) => {
      const results = [...state.results];
      state.results = results.map((result) => {
        return result.id === action.payload.result.id
          ? action.payload.result
          : result;
      });
      return state;
    },

    removeDestinationFromDay: (
      state,
      action: PayloadAction<{ dayId: number; destinationId: number }>
    ) => {
      const { dayId, destinationId } = action.payload;
      const dayIndex = state.results.findIndex((result) => result.id === dayId);

      if (dayIndex !== -1) {
        state.results[dayIndex].destinations = state.results[
          dayIndex
        ].destinations.filter(
          (destination) => destination.id !== destinationId
        );
      }
    },
    addDay: (state, action: PayloadAction<Result>) => {
      state.results.push(action.payload);
    },
    removeDay: (state, action: PayloadAction<number>) => {
      state.results = state.results.filter((day) => day.id !== action.payload);
    },
    setTotalTime: (state, action: PayloadAction<number>) => {
      state.totalTime += action.payload;
    },

    resetTotalTime: (state) => {
      state.totalTime = 0;
    },

    setSelectedDay: (state, action: PayloadAction<string | null>) => {
      state.selectedDay = action.payload;
    },
    setViewingMap: (state, action: PayloadAction<boolean>) => {
      state.isViewingMap = action.payload;
    },
    setDestText: (state, action: PayloadAction<string>) => {
      state.destText = action.payload;
    }
  },
});

export const {
  setDestinationDetails,
  setAPIResultData,
  removeDestinationFromDay,
  updateResult,
  setSelectedDay,
  resetTotalTime,
  addDay,
  removeDay,
  setTotalTime,
  setViewingMap,
  setDestText,
} = destinationsSlice.actions;

export default destinationsSlice.reducer;
