import {
  createContext,
  useState,
  useEffect,
} from "react";

import Header from "../features/navigation/header/header";
import LeftSidebar from "../features/navigation/sidebar/leftSidebar";
import RightSidebar from "../features/flashcards/rightSidebar";
import ContextMenu from "../features/navigation/sidebar/contextMenu";
import { UiController } from "../store/uiController";
import { useSelector } from "react-redux";
export const sidebarContext=createContext({})

function App() {
  const {Notes,Folders} = useSelector((state) => state);
  console.log("this is redux store data", Notes,Folders);
  console.log("App comp rendered ");
  const [ContextMenuPos, setContextMenuPos] = useState({});
  const [Rename, setRename] = useState(null);
  const [ShowContextMenu, setShowContextMenu] = useState(null);
  const [ExpandLeftbar, setExpandLeftbar] = useState(null);
  const [ExpandRightbar, setExpandRightbar] = useState(false);
  const [Active, setActive] = useState("r");
 

  useEffect(() => {
    const handler = (e) => UiController.handler(e);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <Header
        ExpandLeftbar={ExpandLeftbar}
        ExpandRightbar={ExpandRightbar}
        setExpandLeftbar={setExpandLeftbar}
        setExpandRightbar={setExpandRightbar}
      />
      <sidebarContext.Provider
      value={{
        ShowContextMenu,
        setShowContextMenu,
        Active,
        setActive,
        ContextMenuPos,
        setContextMenuPos,
        Rename,
        setRename,
      }}
    >
      <LeftSidebar ExpandLeftbar={ExpandLeftbar}/>
      <ContextMenu/>
      {/* <RightSidebar  ExpandRightbar={ExpandRightbar}/> */}
    </sidebarContext.Provider></>
  );
}

export default App;
