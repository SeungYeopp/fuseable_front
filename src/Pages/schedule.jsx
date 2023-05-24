import React, { useState } from "react";
import '../css/Pages/schedule.scss'
import { useEffect } from 'react';
import axios from 'axios';
import Logo from '../images/Logo.png';
import { useNavigate } from "react-router-dom";

let scheduleId = 0;

function Schedule() {
  const [scheduleTime, setScheduleTime] = useState(Array(70));
  const userId = sessionStorage.getItem("userCode");
  const Nickname = sessionStorage.getItem("Nickname");
  const ProfileImg = sessionStorage.getItem("ProfileImg");

  const navigate = useNavigate();

  useEffect(() => {(async() => {
    {try {
      const res = await axios
      .get(
        `http://3.36.58.146:8080/api/schedule/read/${userId}`
      )
      .then((response) => 
      {
        console.log("response: ", response.data);
        scheduleId = response.data.scheduleId;
        const newlist = Array(70).fill(0);
        for(let i = 0; i < 70; i++) {
          newlist[i]= Number(response.data.checkBox[i])
        }
        setScheduleTime(newlist);
      })
    }
    catch (e) {
      console.error(e);
    }}
    })();
  },[])

  console.log("schedule: ", scheduleTime);

  const change = (e) => {
    console.log("Schedule Set Id: ", e);
    const tempScheduleTime = [...scheduleTime]
    tempScheduleTime[e] = tempScheduleTime[e] ? 0 : 1;
    console.log("Change:", scheduleTime.join(''));

    setScheduleTime(tempScheduleTime)
  }

  const sendSchedule = async() => {
    try {
      const res = await axios
      .post(
        `http://3.36.58.146:8080/api/schedule/update/${scheduleId}`,
        {
          checkBox: scheduleTime.join(''),
        }
      )
      .then((response) => {
        console.log("Update Response: ", response.checkBox);
        navigate('/start')
      })
    }
    catch (e) {
      console.log(e);
    }
  }

  const Days = [
    {id: 0, day: "Day"},
    {id: 1, day: "Mon"},
    {id: 2, day: "Thu"},
    {id: 3, day: "Wen"},
    {id: 4, day: "Tur"},
    {id: 5, day: "Fri"},
    {id: 6, day: "Sat"},
    {id: 7, day: "Sun"},
  ]

  const Times = [
    [
      {id: 0, time: '1'},
      {id: 1, time: '1'},
      {id: 2, time: '1'},
      {id: 3, time: '1'},
      {id: 4, time: '1'},
      {id: 5, time: '1'},
      {id: 6, time: '1'},
    ],
    [
      {id: 7, time: '2'},
      {id: 8, time: '2'},
      {id: 9, time: '2'},
      {id: 10, time: '2'},
      {id: 11, time: '2'},
      {id: 12, time: '2'},
      {id: 13, time: '2'},
    ],
    [
      {id: 14, time: '3'},
      {id: 15, time: '3'},
      {id: 16, time: '3'},
      {id: 17, time: '3'},
      {id: 18, time: '3'},
      {id: 19, time: '3'},
      {id: 20, time: '3'},
    ],
    [
      {id: 21, time: '4'},
      {id: 22, time: '4'},
      {id: 23, time: '4'},
      {id: 24, time: '4'},
      {id: 25, time: '4'},
      {id: 26, time: '4'},
      {id: 27, time: '4'},
    ],
    [
      {id: 28, time: '5'},
      {id: 29, time: '5'},
      {id: 30, time: '5'},
      {id: 31, time: '5'},
      {id: 32, time: '5'},
      {id: 33, time: '5'},
      {id: 34, time: '5'},
    ],
    [
      {id: 35, time: '6'},
      {id: 36, time: '6'},
      {id: 37, time: '6'},
      {id: 38, time: '6'},
      {id: 39, time: '6'},
      {id: 40, time: '6'},
      {id: 41, time: '6'},
    ],
    [
      {id: 42, time: '7'},
      {id: 43, time: '7'},
      {id: 44, time: '7'},
      {id: 45, time: '7'},
      {id: 46, time: '7'},
      {id: 47, time: '7'},
      {id: 48, time: '7'},
    ],
    [
      {id: 49, time: '8'},
      {id: 50, time: '8'},
      {id: 51, time: '8'},
      {id: 52, time: '8'},
      {id: 53, time: '8'},
      {id: 54, time: '8'},
      {id: 55, time: '8'},
    ],
    [
      {id: 56, time: '9'},
      {id: 57, time: '9'},
      {id: 58, time: '9'},
      {id: 59, time: '9'},
      {id: 60, time: '9'},
      {id: 61, time: '9'},
      {id: 62, time: '9'},
    ],
    [
      {id: 63, time: '10'},
      {id: 64, time: '10'},
      {id: 65, time: '10'},
      {id: 66, time: '10'},
      {id: 67, time: '10'},
      {id: 68, time: '10'},
      {id: 69, time: '10'},
    ]
  ]


  return (
    <React.Fragment>
      <div className='container'>
        <div className='Start-header'>
          <div className='logo'>
            <img src={Logo} alt="logo" />
          </div>
          <img className='ProfileImg' src={ProfileImg.slice(1,ProfileImg.length - 1)} alt="ProfileImg" referrerPolicy="no-referrer"></img>
        </div>
        <div className='Start-mainbody'>
          <div className='userNickname'>   
            <strong>{Nickname.slice(1,Nickname.length - 1)}</strong>
            <span> 유저님 환영합니다</span>
          </div>
          <div className="buttonContainer">
            <button onClick={sendSchedule} className="setSchedule">Setting</button>
          </div>
          <table className="table table-bordered">
            <tbody>
              <tr className="onDays" >
                {Days.map((data) => (
                  <th scope="row" key={data.id}>{data.day}</th>
                ))}
              </tr>
              <tr className="onDays" >
                <th scope="col" style={{"width": "23%"}}>09:00 ~ 10:30</th>
                {Times[0].map((data) => (
                  <td style={{"width": "11%"}} key={data.id} className={scheduleTime[data.id] ? "bg-primary" : "bg-default"} onClick={() => change(data.id)}>{data.time}</td>
                ))}
              </tr>
              <tr className="onDays">
                <th scope="col">10:30 ~ 12:00</th>
                {Times[1].map((data) => (
                  <td key={data.id} className={scheduleTime[data.id] ? "bg-primary" : "bg-default"} onClick={() => change(data.id)}>{data.time}</td>
                ))}
              </tr>
              <tr className="onDays">
                <th scope="col">12:00 ~ 13:30</th>
                {Times[2].map((data) => (
                  <td key={data.id} className={scheduleTime[data.id] ? "bg-primary" : "bg-default"} onClick={() => change(data.id)}>{data.time}</td>
                ))}
              </tr>
              <tr className="onDays">
                <th scope="col">13:30 ~ 15:00</th>
                {Times[3].map((data) => (
                  <td key={data.id} className={scheduleTime[data.id] ? "bg-primary" : "bg-default"} onClick={() => change(data.id)}>{data.time}</td>
                ))}
              </tr>
              <tr className="onDays">
                <th scope="col">15:00 ~ 16:30</th>
                {Times[4].map((data) => (
                  <td key={data.id} className={scheduleTime[data.id] ? "bg-primary" : "bg-default"} onClick={() => change(data.id)}>{data.time}</td>
                ))}
              </tr>
              <tr className="onDays">
                <th scope="col">16:30 ~ 18:00</th>
                {Times[5].map((data) => (
                  <td key={data.id} className={scheduleTime[data.id] ? "bg-primary" : "bg-default"} onClick={() => change(data.id)}>{data.time}</td>
                ))}
              </tr>
              <tr className="onDays">
                <th scope="col">18:00 ~ 19:30</th>
                {Times[6].map((data) => (
                  <td key={data.id} className={scheduleTime[data.id] ? "bg-primary" : "bg-default"} onClick={() => change(data.id)}>{data.time}</td>
                ))}
              </tr>
              <tr className="onDays">
                <th scope="col">19:30 ~ 21:00</th>
                {Times[7].map((data) => (
                  <td key={data.id} className={scheduleTime[data.id] ? "bg-primary" : "bg-default"} onClick={() => change(data.id)}>{data.time}</td>
                ))}
              </tr>
              <tr className="onDays">
                <th scope="col">21:00 ~ 22:30</th>
                {Times[8].map((data) => (
                  <td key={data.id} className={scheduleTime[data.id] ? "bg-primary" : "bg-default"} onClick={() => change(data.id)}>{data.time}</td>
                ))}
              </tr>
              <tr className="onDays">
                <th scope="col">22:30 ~ 00:00</th>
                {Times[9].map((data) => (
                  <td key={data.id} className={scheduleTime[data.id] ? "bg-primary" : "bg-default"} onClick={() => change(data.id)}>{data.time}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  )

}

export default Schedule;