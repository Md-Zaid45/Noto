import { createContext, useState, useEffect } from "react";

import LeftSidebar from "./features/navigation/sidebar/leftSidebar";
import ContextMenu from "./features/navigation/sidebar/contextMenu";
import { UiController } from "./store/uiController";
import { useDispatch, useSelector } from "react-redux";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useOutlet,
} from "react-router-dom";
import { hydrateApp } from "./store/appActions";
import RightSidebar from "./features/flashcards/rightSidebar";
import { setLoggedIn } from "./store/authSlice";
import EmptyState from "./pages/emptyPage";
import { apiFetch } from "./commons/apifetch";
import LoadingLoader from "./commons/loader";
import ActivityBar from "./features/navigation/activityBar/activitybar";
export const sidebarContext = createContext({});
export const viewContext = createContext({});

function App() {
  const outlet = useOutlet();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const data = useLoaderData();
  const [ContextMenuPos, setContextMenuPos] = useState({});
  const [Rename, setRename] = useState(null);
  const [ShowContextMenu, setShowContextMenu] = useState(null);
  const [view, setView] = useState("notes");
  const [Active, setActive] = useState("r");
  const [treeOpen, setTreeOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.Auth);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log('data',data);
    
    if (!data?.success) return;
    dispatch(hydrateApp(data.payload));
  }, [data, dispatch]);
  useEffect(() => {
    if (auth.isLoggedIn) return;
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
  }, [auth.isLoggedIn]);

  useEffect(() => {
    const handler = (e) => UiController.handler(e);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const segment = pathname.split("/")[2] || "";
    if (segment !== "notes" && segment !== "cards") {
      setRightPanelOpen(false);
    }
  }, [pathname]);

  return (
    <>
      {
        <div className="flex flex-row h-screen overflow-hidden bg-[#F7F6F3] dark:bg-stone-950">
          <ActivityBar treeOpen={treeOpen} setTreeOpen={setTreeOpen} />
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
                <div className="absolute inset-0 bg-white/80 dark:bg-stone-900/80 flex items-center justify-center z-10">
                  <LoadingLoader size="lg" color="blue" />
                </div>
              )}
              <LeftSidebar view={view} treeOpen={treeOpen} />

              <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                <viewContext.Provider value={{ view, rightPanelOpen, setRightPanelOpen }}>
                  {outlet ? (
                    <Outlet />
                  ) : (
                    <EmptyState />
                  )}
                </viewContext.Provider>
              </div>

              {(view === "notes" || view === "cards") && (
                <RightSidebar rightPanelOpen={rightPanelOpen} setRightPanelOpen={setRightPanelOpen} view={view} />
              )}
              <ContextMenu />
            </sidebarContext.Provider>
          </div>
        </div>
      }
    </>
  );
}

export default App;
