import { useState, useEffect, createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiFetch } from "../commons/apifetch";
import { Doughnut, HeaderCounts } from "../features/dashboard/counts";
import { PastActivity } from "../features/dashboard/PastActivity";
import DueCards from "../features/dashboard/dueCards";
import HeatMap from "../features/dashboard/heatMap";
import FocusAreas from "../features/dashboard/focusArea";
import { FutureScheduledCards } from "../features/dashboard/FutureSchedules";
import LoadingLoader from "../commons/loader";

export const DashboardContext = createContext();

export function DashboardHome() {
  const {
    totalCards, activeCards, dueCards, reviewedCards,
    masteredCards, accuracy, learningCards, newCards,
    futureCards, streak, weeklyActivity, dailyActivity, decks,
  } = useContext(DashboardContext);

  return (
    <>
      <HeaderCounts totalCards={totalCards} activeCards={activeCards} dueCards={dueCards} reviewedCards={reviewedCards} streak={streak} accuracy={accuracy} />
      <div className="flex gap-6">
        <Doughnut activeCards={activeCards} masteredCards={masteredCards} learningCards={learningCards} newCards={newCards} />
        <PastActivity weeklyActivity={weeklyActivity} />
      </div>
      <FutureScheduledCards futureCards={futureCards} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DueCards decks={decks} />
        <HeatMap dailyActivity={dailyActivity} />
        <FocusAreas decks={decks} />
      </div>
    </>
  );
}

export default function Dashboard() {
  const auth = useSelector((state) => state.Auth);
  const [totalCards, setTotalCards] = useState(0);
  const [activeCards, setActiveCards] = useState(0);
  const [dueCards, setDueCards] = useState(0);
  const [reviewedCards, setReviewedCards] = useState(0);
  const [masteredCards, setMasteredCards] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [learningCards, setLearningCards] = useState(0);
  const [newCards, setNewCards] = useState(0);
  const [futureCards, setFutureCards] = useState([]);
  const [streak, setStreak] = useState(0);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [dailyActivity, setDailyActivity] = useState([]);
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.isLoggedIn) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, decksRes] = await Promise.all([
          apiFetch(`/flashcards/stats`, { method: "GET" }),
          apiFetch(`/flashcards/decks`, { method: "GET" }),
        ]);
        const stats = await statsRes.json();
        if (stats.success) {
          setTotalCards(stats.payload.totalCards);
          setActiveCards(stats.payload.activeCards);
          setDueCards(stats.payload.dueCards);
          setReviewedCards(stats.payload.reviewedCards);
          setMasteredCards(stats.payload.masteredCards);
          setAccuracy(stats.payload.accuracy);
          setLearningCards(stats.payload.learningCards);
          setNewCards(stats.payload.newCards);
          setFutureCards(stats.payload.futureCards || []);
          setStreak(stats.payload.streak || 0);
          setWeeklyActivity(stats.payload.weeklyActivity || []);
          setDailyActivity(stats.payload.dailyActivity || []);
        }
        const decksData = await decksRes.json();
        if (decksData.success) setDecks(decksData.payload);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [auth.isLoggedIn]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#f9fafb] dark:bg-stone-950">
        <LoadingLoader size="lg" color="blue" />
      </div>
    );
  }

  const contextValue = {
    totalCards, activeCards, dueCards, reviewedCards,
    masteredCards, accuracy, learningCards, newCards,
    futureCards, streak, weeklyActivity, dailyActivity, decks,
  };

  return (
    <div className="h-full overflow-y-auto bg-[#f9fafb] dark:bg-stone-950 p-6 text-[#111827] dark:text-stone-100">
      <div className="max-w-7xl mx-auto space-y-6 pb-8">
        <DashboardContext.Provider value={contextValue}>
          <Outlet />
        </DashboardContext.Provider>
      </div>
    </div>
  );
}
