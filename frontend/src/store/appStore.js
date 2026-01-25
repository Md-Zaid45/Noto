import { configureStore } from "@reduxjs/toolkit"
import notesSlice from '../features/notes/notesSlice'
import foldersSlice from '../features/folders/foldersSlice'


const appStore=configureStore({
  reducer:{
    Notes:notesSlice.reducer,
    Folders:foldersSlice.reducer
  }
})

export default appStore;