import React, { useState, useRef, useCallback } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useRecoilState } from "recoil";
import { kanbanListState } from "../recoil";
import '../css/Kanban/EditList.scss';
import ReactDatePicker from "react-datepicker";
import { useEffect } from 'react';

import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


var count = 1;

function EditList({item}) {
  const [kanbanList, setKanbanList] = useRecoilState(kanbanListState);
  const ref = useRef();

  const selectedProjectId = sessionStorage.getItem("selectedProjectId");

  const navigate = useNavigate();

  const changeProcess = async(Selecteditem, changeProgress) => {
    const changeIndex = kanbanList.findIndex((data) => data.id == Selecteditem.id);

    console.log("Selected : ", Selecteditem, "\nchangeProcess : ", changeProgress, "\nChangeIndex : ", changeIndex);
    console.log("Send : ", {
      newStep: changeProgress,
      arrayId: Selecteditem.arrayId,
      newArrayId: Selecteditem.arrayId,
    }
  );

    setKanbanList((prev) => {
      return prev.map((e) => {
        return {
          ...e,
          progress: kanbanList.findIndex((data) => data.id === e.id) === changeIndex ? changeProgress : e.progress,
        };
      });
    });

    try {
      const res = await axios
      .post(
        `http://back.fuseable.monster:8080/api/project/main/move/${selectedProjectId}`,
        {
          newStep: changeProgress,
          arrayId: Selecteditem.arrayId,
          newArrayId: Selecteditem.arrayId,
        }
      )
      .then((response) => {
        console.log("D&D response : ", response);
      })
    }
    catch (e) {
      console.log(e);
    }
  };

  const moveHandler = async(dragIndex, hoverIndex) => {
    const dragItem = kanbanList[dragIndex];

    // console.log("MOVE");

    if (dragItem) {
      const tempArray = [...kanbanList];

      // console.log("tempArray : ", tempArray);
      tempArray.splice(dragIndex, 1);
      tempArray.splice(hoverIndex, 0, dragItem);
      
      setKanbanList(tempArray);

      // try {
      //   const res = await axios
      //   .post(
      //     `http://back.fuseable.monster:8080/api/project/main/move/${selectedProjectId}`,
      //     {
      //       newStep: dragItem.progress,
      //       arrayId: dragIndex,
      //       newArrayId: hoverIndex,
      //     }
      //   )
      //   .then((response) => {
      //     // console.log("D&D response : ", response);
      //   })
      // }
      // catch (e) {
      //   console.log(e);
      // }

    };
  }

  // const [, dropUp] = useDrop(
  //   () => ({
  //     accept: 'kanban',
  //     canDrop: () => false,
  //     hover({item, index}) {
  //       const tempSet = kanbanList.filter((data) => data.progress === item.progress)
  //       const hoverIndex = tempSet.findIndex((data) => data === item)
  //       const target = kanbanList.findIndex((data) => data === tempSet[hoverIndex - 1])
  //       console.log("DropUP : ",tempSet, hoverIndex);
  //       if (hoverIndex) {
  //         moveHandler(index, target);
  //       }
  //     }
  //   }),
  //   [moveHandler]
  // )

  // const [, dropDown] = useDrop(
  //   () => ({
  //     accept: 'kanban',
  //     canDrop: () => false,
  //     hover({item, index}) {
  //       const tempSet = kanbanList.filter((data) => data.progress === item.progress)
  //       const hoverIndex = tempSet.findIndex((data) => data === item)
  //       const target = kanbanList.findIndex((data) => data === tempSet[hoverIndex + 1])
  //       console.log("TEST : ", {item, index});
  //       if (tempSet.index !== hoverIndex) {
  //         moveHandler(index, target);
  //       }
  //     }
  //   }),
  //   [moveHandler]
  // )



  // const [, drop] = useDrop({
  //   accept: 'kanban',
  //   hover(item, monitor) {
  //       if (!ref.current) {
  //           return;
  //       }

  //       const hoverIndex = index;
  //       // console.log("ITEM : ", item);
  //       const itemIndex = kanbanList.filter((data) => data.progress === item.progress).findIndex((data) => data.id === item.id)
  //       const tempF = itemIndex > 0 ? kanbanList.filter((data) => data.progress === item.progress)[itemIndex - 1] : 0;
  //       const tempB = itemIndex < (kanbanList.filter((data) => data.progress === item.progress).length - 1) ? kanbanList.filter((data) => data.progress === item.progress)[itemIndex + 1] : 0;
  //       const dragForwordIndex = kanbanList.findIndex((listItem) => listItem === tempF)
  //       const dragBackwordIndex = kanbanList.findIndex((listItem) => listItem === tempB)

  //       // Don't replace items with themselves
       
  //       // Determine rectangle on screen
  //       const hoverBoundingRect = ref.current?.getBoundingClientRect();

  //       // Get vertical middle
  //       const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
  //       // Determine mouse position
  //       const clientOffset = monitor.getClientOffset();
  //       // console.log("itemIndex : ", itemIndex);
  //       // console.log("hoverBoundingRect : ", hoverBoundingRect);
  //       // if(kanbanList[hoverIndex].progress !== item.progress) {
  //       //   switch (kanbanList[hoverIndex].progress) {
  //       //     case 'TODO':
  //       //       changeProcess(item, 'TODO');
  //       //       break;
  //       //     case 'PROGRESS':
  //       //       changeProcess(item, 'PROGRESS');
  //       //       break;
  //       //     case 'DONE':
  //       //       changeProcess(item, 'DONE');
  //       //       break;
  //       //     case 'VERIFY':
  //       //       changeProcess(item, 'VERIFY');
  //       //       break;
  //       //   }
  //       // }
  //       // console.log("clientOffset-Y : ", clientOffset.y);
  //       // Get pixels to the top
  //       const hoverClientFY = hoverBoundingRect.bottom - hoverMiddleY - 10;
  //       const hoverClientBY = hoverBoundingRect.top + hoverMiddleY + 10;

  //       // console.log("hoverIndex  :", hoverIndex);
  //       // console.log("hoverClientFY : ", hoverClientFY);
  //       // console.log("hoverClientBY : ", hoverClientBY);
  //       // Only perform the move when the mouse has crossed half of the items height
  //       // When dragging downwards, only move when the cursor is below 50%
  //       // When dragging upwards, only move when the cursor is above 50%
  //       // Dragging downwards
  //       if (hoverClientFY < clientOffset.y && tempF !== 0 && hoverIndex !== itemIndex) {
  //         moveHandler(itemIndex, hoverIndex);
  //       }
  //       // Dragging upwards
  //       if (hoverClientBY > clientOffset.y && tempB !== 0 && hoverIndex !== itemIndex) {
  //         moveHandler(itemIndex, hoverIndex);
  //       }
  //       // Time to actually perform the action
  //       // console.log("Drag : ", dragIndex);
  //       // console.log("Hover : ", hoverIndex);
  //       // Note: we're mutating the monitor item here!
  //       // Generally it's better to avoid mutations,
  //       // but it's good here for the sake of performance
  //       // to avoid expensive index searches.
  //   },
  // });

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'kanban',
    item: item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),

    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      // console.log('item ', item);
      if (dropResult) {
        if(dropResult.name)
          switch (dropResult.name) {
            case 'TODO':
              changeProcess(item, 'TODO');
              break;
            case 'PROGRESS':
              changeProcess(item, 'PROGRESS');
              break;
            case 'DONE':
              changeProcess(item, 'DONE');
              break;
            case 'VERIFY':
              changeProcess(item, 'VERIFY');
              break;
        }
      }     
    },
    }),
  )

  dragRef(ref);
  // dragRef(dropUp(ref));
  // dragRef(dropDown(ref));

  const editNote = () => {
    sessionStorage.setItem("selectedNote", JSON.stringify(item))
    sessionStorage.setItem("selectedNoteId", item.id);
    sessionStorage.setItem("selectedArrayId", item.arrayId);
    
    navigate('/main/editlistpage');
  }

  return (
    <React.Fragment>
      <div className="KanbanList" ref={ref} onClick={editNote} style={{opacity: isDragging? '0.3' : '1'}} >
        <div className="kanbanListTitle">
          {item.title}
        </div>    
        <div className="kanbanListDeadline">
          {item.deadline}          
        </div>
        <br></br>
      </div>
    </React.Fragment>
  );
}

export default EditList;