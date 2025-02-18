import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Pokemon {
  name: string;
  url: string;
}

interface SelectedItemsState {
  selectedItems: Pokemon[];
}

const initialState: SelectedItemsState = {
  selectedItems: [],
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Pokemon>) => {
      if (
        !state.selectedItems.some((item) => item.name === action.payload.name)
      ) {
        state.selectedItems.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<Pokemon>) => {
      state.selectedItems = state.selectedItems.filter(
        (item) => item.name !== action.payload.name
      );
    },
    resetItems: (state) => {
      state.selectedItems = [];
    },
  },
});

export const { addItem, removeItem, resetItems } = selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;
