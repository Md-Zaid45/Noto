import { createSlice, nanoid } from "@reduxjs/toolkit";
import { folders } from "../../store/data";

const foldersSlice = createSlice({
  name: "folders",
  initialState: folders,
  reducers: {
    renameFolder: (state, action) => {
      const { id, name } = action.payload;
       console.log('folderslice',name)
        const folder = state.find((node) => node.id === id);
        if(folder)folder.name = name;
      
    },
    addFolder: (state, action) => {
      const { name, parentFolderId } = action.payload;
      const newFolder={
    id: `f-${nanoid(4)}`,
    userId: 1,
    name,
    parentFolderId,
    revisionMark: false,
    type: "folder",
  }
      console.log(newFolder)
      if (newFolder) state.push(newFolder);
       console.log(action.payload)
    },
    deleteFolder: (state, action) => {
       console.log(action.payload)
      const deletionIds=action.payload
      if(deletionIds){
      return state.filter((node) => !deletionIds.includes(node.id));}
    
    },
    addRevisionMarkFolder: (state, action) => {
      const  ids  = action.payload;
      if (ids) {
        ids.forEach((id) => {
          const folder = state.find((node) => node.id === id);
          if(folder)folder.revisionMark = true;
        });
      }
    },
    removeRevisionMarkFolder: (state, action) => {
     const  ids  = action.payload;
      if (ids) {
        ids.forEach((id) => {
          const folder = state.find((node) => node.id === id);
          if(folder){folder.revisionMark = false;}
        });
      }
    },
  },
});
export const {renameFolder,addFolder,deleteFolder,addRevisionMarkFolder,removeRevisionMarkFolder}=foldersSlice.actions
export default foldersSlice;
