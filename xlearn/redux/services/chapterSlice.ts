import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChapterState {
  currentChapterId: string;
}

const initialState: ChapterState = {
  currentChapterId: "",
};

const chapterSlice = createSlice({
  name: "chapter",
  initialState,
  reducers: {
    setCurrentChapter: (state, action: PayloadAction<string>) => {
      state.currentChapterId = action.payload;
    },
  },
});

export const { setCurrentChapter } = chapterSlice.actions;

export default chapterSlice.reducer;
