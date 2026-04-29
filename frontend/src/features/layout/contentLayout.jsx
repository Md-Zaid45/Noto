import { useContext } from "react";
import ReviewFlashcard from "../flashcards/reviewFlashcard";
import Editr from "../notes/editor/editor";
import { viewContext } from "../../pages/home";

export default function ContentLayout() {
  const { view } = useContext(viewContext);
  return <>{view === "note" ? <Editr /> : <ReviewFlashcard />}</>;
}
