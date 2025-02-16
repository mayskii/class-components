import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedItemsState {
  selected: string[];
}

const initialState: SelectedItemsState = {
  selected: [],
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    toggleItem: (state, action: PayloadAction<string>) => {
      const item = action.payload;
      if (state.selected.includes(item)) {
        state.selected = state.selected.filter((i) => i !== item);
      } else {
        state.selected.push(item);
      }
    },
    clearItems: (state) => {
      state.selected = [];
    },
  },
});

export const { toggleItem, clearItems } = selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;
