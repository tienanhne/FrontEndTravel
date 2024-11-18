import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TravelTypesState {
  selectedTypes: string[];
}

const initialState: TravelTypesState = {
  selectedTypes: [],
};

const travelTypesSlice = createSlice({
  name: 'travelTypes',
  initialState,
  reducers: {
    selectType(state, action: PayloadAction<string>) {
      if (!state.selectedTypes.includes(action.payload)) {
        state.selectedTypes.push(action.payload);
      }
    },
    deselectType(state, action: PayloadAction<string>) {
      state.selectedTypes = state.selectedTypes.filter(
        (type) => type !== action.payload
      );
    },
    setSelectedTypes(state, action: PayloadAction<string[]>) {
      state.selectedTypes = action.payload;
    },
  },
});

export const { selectType, deselectType, setSelectedTypes } = travelTypesSlice.actions;
export default travelTypesSlice.reducer;
