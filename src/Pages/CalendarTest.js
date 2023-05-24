import React, { Component } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "../css/Pages/MyCalendar.css"

import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import { useRecoilValue, useRecoilState } from "recoil";
import { kanbanListState } from "../recoil";
import axios from "axios";
import { useEffect } from "react";



const MyCalendar = () => {
  const kanbanList = useRecoilValue(kanbanListState)
  const [kanbanListSet, setKanbanListSet] = useRecoilState(kanbanListState);
  const userCode = sessionStorage.getItem("userCode");
  const selectedProjectId = sessionStorage.getItem("selectedProjectId");

  useEffect(() => {(async() => {
    {try {
      const res = await axios
      .get(
        `http://3.36.58.146:8080/api/project/${userCode}/${selectedProjectId}`
      )
      .then((response) => 
      {
        setKanbanListSet(clearData(kanbanListSet));
        (response.data.note).map((data) => {
          return setKanbanListSet((oldKanbanList) => [
            ...oldKanbanList,
            {
              id: data.arrayId,
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

  const  data = kanbanList.map((data) => ({title: `${data.title}`, date: `${data.deadline}`}))

  console.log("Kanban : ", kanbanList);
  console.log("Data : ", data);

  return (
    <div className="calendar-wrapper">
      <FullCalendar 
        plugins={[ dayGridPlugin ]} 
        aspectRatio={1.8}
        events={data}
          />
    </div>
    )
}

export default MyCalendar;
