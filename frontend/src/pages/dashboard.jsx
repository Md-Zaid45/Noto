import { useState, useEffect } from "react";
import {apiFetch} from "../commons/apifetch";
import {
  Zap,
} from "lucide-react";
import { Doughnut, HeaderCounts } from "../features/dashboard/counts";
import { PastActivity } from "../features/dashboard/PastAcitvity";
import DueCards from "../features/dashboard/dueCards";
import HeatMap from "../features/dashboard/heatMap";
import FocusAreas from "../features/dashboard/focusArea";
import { FutureScheduledCards } from "../features/dashboard/futureShcedules";

export default function Dashboard() {
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

  useEffect(() => {
    const fetchDashboardData = async () => {
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
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-[#f9fafb] dark:bg-stone-950 p-6 text-[#111827] dark:text-stone-100">
      <div className="max-w-7xl mx-auto space-y-6 pb-8">
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
      </div>
    </div>
  );
}