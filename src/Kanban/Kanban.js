import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useRecoilState, useRecoilValue } from "recoil";
import { kanbanListState } from "../recoil";
import EditList from "./EditList";
import KanbanList from "./KanbanList";
import '../css/Kanban/Kanban.css';
import { useEffect } from "react";
import axios from "axios";


function Kanban() {
  const kanbanList = useRecoilValue(kanbanListState)
  const [kanbanListSet, setKanbanListSet] = useRecoilState(kanbanListState);
  const userCode = sessionStorage.getItem("userCode");
  const selectedProjectId = sessionStorage.getItem("selectedProjectId");

  useEffect(() => {(async() => {
    {try {
      const res = await axios
      .get(
        `http://back.fuseable.monster:8080/api/project/${userCode}/${selectedProjectId}`
      )
      .then((response) => 
      {
        console.log("KANBAN: ", response);
        setKanbanListSet(clearData(kanbanListSet));
        (response.data.note).map((data) => {
          return setKanbanListSet((oldKanbanList) => [
            ...oldKanbanList,
            {
              id: data.noteId,
              arrayId: data.arrayId,
              title: data.title,
              content: data.content,
              deadline:  data.endAt,
              progress: data.step,
            },
          ])
        })
        // console.log("Response: ", response.data.note);
        // console.log("Data : ", kanbanList);
      })
    }
    catch (e) {
      console.error(e);
    }}
    })();
  },[])

  const clearData = (arr) => {
    return [...arr.slice(0,0)]
  }

  const progressName = [
    {id: 1, progress: 'TODO'},
    {id: 2, progress: 'PROGRESS'},
    {id: 3, progress: 'VERIFY'},
    {id: 4, progress: 'DONE'},
  ];

  const projectId = Number(sessionStorage.getItem("selectedProjectId"))
  // console.log("ProjectId : ", projectId);
  
  const dataHandler = (progress) => {
    return kanbanList
    .filter((data) => data.progress === progress)
    .map((item) => <EditList key={item.id} item={item}/>);
  }

  return (
    <>
      <section className="kanbanListContainer">
        <DndProvider className="Kanban" backend={HTML5Backend}>
          {progressName.map((data) => (
            <KanbanList key={data.id} title={`${data.progress}`}>
              {dataHandler(data.progress)}
            </KanbanList>
          ))}
        </DndProvider>
      </section>
    </>
  )
}

export default Kanban;