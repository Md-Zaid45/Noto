import { createContext, useState, useEffect } from "react";

import Header from "../features/navigation/header/header";
import LeftSidebar from "../features/navigation/sidebar/leftSidebar";
import ContextMenu from "../features/navigation/sidebar/contextMenu";
import { UiController } from "../store/uiController";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLoaderData } from "react-router-dom";
import { hydrateApp } from "../store/appActions";
export const sidebarContext = createContext({});

function App() {
  const data = useLoaderData();
  const Notes = useSelector((state) => state.Notes);
  const Folders = useSelector((state) => state.Folders);
  const NotesContent = useSelector((state) => state.NotesContent);

  console.log("this is redux store data", Notes, Folders, NotesContent,"loader data",data);
  console.log("App comp rendered ");
  const [ContextMenuPos, setContextMenuPos] = useState({});
  const [Rename, setRename] = useState(null);
  const [ShowContextMenu, setShowContextMenu] = useState(null);
  const [ExpandLeftbar, setExpandLeftbar] = useState(null);
  const [ExpandRightbar, setExpandRightbar] = useState(false);
  const [Active, setActive] = useState("r");
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.Auth);

  useEffect(() => {
    if (!data) return;
    dispatch(hydrateApp(data.payload));
  }, [data, dispatch]);
  
  useEffect(() => {
    const handler = (e) => UiController.handler(e);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {
        <div className="h-screen flex flex-col overflow-hidden">
          <Header
            ExpandLeftbar={ExpandLeftbar}
            ExpandRightbar={ExpandRightbar}
            setExpandLeftbar={setExpandLeftbar}
            setExpandRightbar={setExpandRightbar}
          />

          <div className="flex-1 flex overflow-hidden">
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
              <LeftSidebar ExpandLeftbar={ExpandLeftbar} />
              <ContextMenu />

              <div className="flex-1 min-h-0 overflow-y-auto">
                <Outlet />
              </div>
            </sidebarContext.Provider>
          </div>
        </div>
      }
    </>
  );
}

export default App;
