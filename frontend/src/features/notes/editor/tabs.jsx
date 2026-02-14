import { RxCross2 } from "react-icons/rx";
import { useNavigate, useParams } from "react-router-dom";

const clickHandler = (tab, navigate) => {
  navigate(`../note/${tab.id}`);
};

export default function Tabs({ OpenTabs ,deleteHandler}) {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <div className="mt-10 flex bg-gray-200 py-0.5">
        {OpenTabs.map((tab) => (
          <div
            key={tab.id}
            className={`${tab.id === id ? "bg-gray-300" : ""} px-1 text-sm outline-1 flex items-center gap-2 py-0.5 cursor-pointer `}
          >
            <div
              className="mb-1"
              onClick={() => clickHandler(tab, navigate)}
            >
              {tab.name}
            </div>
            <RxCross2
              className="text-md"
              onClick={()=>{deleteHandler(tab)}}
            />
          </div>
        ))}
      </div>
    </>
  );
}
