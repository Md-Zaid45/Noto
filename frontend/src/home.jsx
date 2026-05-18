import { createContext, useState, useEffect } from "react";

import Header from "./features/navigation/header/header";
import LeftSidebar from "./features/navigation/sidebar/leftSidebar";
import ContextMenu from "./features/navigation/sidebar/contextMenu";
import { UiController } from "./store/uiController";
import { useDispatch, useSelector } from "react-redux";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useOutlet,
} from "react-router-dom";
import { hydrateApp } from "./store/appActions";
import RightSidebar from "./features/flashcards/rightSidebar";
import { setLoggedIn } from "./store/authSlice";
import EmptyState from "./pages/emptyPage";
import { apiFetch } from "./commons/apifetch";
import LoadingLoader from "./commons/loader";
export const sidebarContext = createContext({});
export const viewContext = createContext({});

function App() {
  const outlet = useOutlet();
  const navigate = useNavigate();
  const data = useLoaderData();
  const Notes = useSelector((state) => state.Notes);
  const Folders = useSelector((state) => state.Folders);
  const NotesContent = useSelector((state) => state.NotesContent);
  const Flashcards = useSelector((state) => state.Flashcards);
  console.log(
    "this is redux store data",
    Notes,
    Folders,
    NotesContent,
    Flashcards,
    "loader data",
    data,
  );
  console.log("App comp rendered ");
  const [ContextMenuPos, setContextMenuPos] = useState({});
  const [Rename, setRename] = useState(null);
  const [ShowContextMenu, setShowContextMenu] = useState(null);
  const [ExpandLeftbar, setExpandLeftbar] = useState(false);
  const [ExpandRightbar, setExpandRightbar] = useState(false);
  const [view, setView] = useState("note");
  const [Active, setActive] = useState("r");
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.Auth);
  const [loading, setLoading] = useState(false);
  console.log("rightbar in home", ExpandRightbar);

  useEffect(() => {
    if (!data) return;
    dispatch(hydrateApp(data.payload));
  }, [data, dispatch]);

  useEffect(() => {
    if (auth.isAuthChecked) {
      return;
    }
    setLoading(true);
    const fetchData = async () => {
      const res = await apiFetch(`/me`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success === true) {
        setLoading(false);
        dispatch(setLoggedIn(data.payload));
      } else navigate("../login");
    };
    fetchData();
  }, [auth.isAuthChecked]);

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
            view={view}
            setView={setView}
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
              {loading && (
                <div className="absolute inset-0 bg-white/80 rounded flex items-center justify-center z-10">
                  <LoadingLoader size="lg" color="blue" />
                </div>
              )}
              <div className="flex-1 flex overflow-hidden">
                <LeftSidebar ExpandLeftbar={ExpandLeftbar} />

                <div className="flex-1 min-w-0 overflow-y-auto">
                  <viewContext.Provider value={{ view }}>
                    {outlet ? (
                      <Outlet />
                    ) : (
                      <EmptyState setExpandLeftbar={setExpandLeftbar} />
                    )}
                  </viewContext.Provider>
                </div>

                <RightSidebar ExpandRightbar={ExpandRightbar} />
                <ContextMenu />
              </div>
            </sidebarContext.Provider>
          </div>
        </div>
      }
    </>
  );
}

export default App;
