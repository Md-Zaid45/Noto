import { useNavigate, useParams } from "react-router-dom";
import Editor from "./editor";
import { useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { sidebarContext } from "../../../pages/home";

let editors = [];

export default function Editors() {
  const { id } = useParams();
  const { Active, setActive } = useContext(sidebarContext);
  const notes = useSelector((state) => state.Notes);
  console.log("Editors renderd........", editors, id);

  const navigate = useNavigate();
  let edt=editors?.find((obj) => obj.id === id)?.edito
  if (!edt) {
    edt=<Editor key={id}  />
    const name = notes.find((note) => note.id === id).name;
    editors.push({ name, id, edito:edt })
    
  }
 
  console.log("Editors renderd........", editors, id, edt);

  return (
    <>
      <div className="mt-10 flex bg-gray-200 text-sm  p-0.5 ">
        {editors.map((obj) => (
          <div
            key={obj.id}
            className="p-1 flex outline-1 px-2 cursor-pointer bg-gray-300 "
          >
            <div
              onClick={() => {
                setActive(obj.id);
                navigate(`../note/${obj.id}`);
              }}
            >
              {obj.name}
            </div>
            <button
              onClick={() => {
                editors = editors.filter((object) => object.id != id);
                if (editors.length) navigate(`../note/${editors[0].id}`);
                else navigate("../");
                console.log(".....", editors, editors[0].id);
              }}
              className="btn ml-2 text-red-800"
            >
              x
            </button>
          </div>
        ))}
      </div>
      <div>{edt}</div>
    </>
  );
}
