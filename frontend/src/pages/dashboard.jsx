import { useState, useEffect } from "react";
import {apiFetch} from "../commons/apifetch";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Zap,
  CheckCircle,
  Clock,
  Percent,
  Flame,
  AlertCircle,
  ChevronRight,
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
  const [dailyReviewed, setDailyReviewed] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [learningCards, setLearningCards] = useState(0);
  const [newCards, setNewCards] = useState(0);
  const [futureCards, setFutureCards] = useState([{}]);
 console.log(totalCards,masteredCards,activeCards,dailyReviewed,newCards);
 
  useEffect(() => {
  const fetchDashboardData = async () => {
    const res = await apiFetch(`/flashcards/stats`,
      {method: "GET" }
    );
    const data = await res.json();
    console.log("Dashboard data:", data);
    setTotalCards(data.payload.totalCards);
    setActiveCards(data.payload.activeCards);
    setDueCards(data.payload.dueCards);
    setReviewedCards(data.payload.reviewedCards);
    setMasteredCards(data.payload.masteredCards);
    setDailyReviewed(data.payload.dailyReviewed);
    setAccuracy(data.payload.accuracy);
    setLearningCards(data.payload.learningCards);
    setNewCards(data.payload.newCards);
    setFutureCards(data.payload.futureCards);
  };
  fetchDashboardData();
}
, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 text-[#1A1A1A] font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* --- HEADER --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Good evening, Alex
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              You've reached{" "}
              <span className="text-[#6366F1] font-semibold">
                88.5% accuracy
              </span>{" "}
              this week. Keep the momentum!
            </p>
          </div>
          <button className="flex items-center gap-2 bg-[#076e45] hover:bg-[#148552] text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all text-sm">
            <Zap className="w-4 h-4 fill-current" />
            Start Daily Review
          </button>
        </div>
        <HeaderCounts totalCards={totalCards} activeCards={activeCards} dueCards={dueCards} reviewedCards={reviewedCards} />
        <div className="flex gap-6">
          <Doughnut activeCards={activeCards} masteredCards={masteredCards} learningCards={learningCards} newCards={newCards} />
          <PastActivity />
        </div>
        <FutureScheduledCards futureCards={futureCards} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DueCards dueCards={dueCards} />
          <HeatMap />
          <FocusAreas />
        </div>
      </div>
    </div>
  );
}