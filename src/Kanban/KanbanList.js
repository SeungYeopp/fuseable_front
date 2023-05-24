import { useDrop } from "react-dnd";
import AddList from "./AddList";
import '../css/Kanban/KanbanList.scss';


export default function KanbanList({title, children}) {
  const [{canDrop, isOver}, drop] = useDrop({
    accept: 'kanban',
    drop:() => ({name:title}),
    collect: (monitor) => ({
      isOver:monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  
  return (
    <>
      <div className="kanbanListWrap" ref={drop}>
        <div className="kanbanTitle">{title}</div>
        {children}
        <AddList title={title} />
      </div>
    </>
  );
}