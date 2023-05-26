import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Pages/Main.scss';
import Logo from '../images/Logo.png';
import Kanban from '../Kanban/Kanban';
import NoticeBanner from '../Notice/NoticeBanner';
import "../css/Pages/SideBar.css"
import { useEffect } from 'react';
import axios from 'axios';
import { userInProjectState } from '../recoil';
import { useRecoilState } from 'recoil';
import MyCalendar from './CalendarTest';
import NoticeList from '../Notice/NoticeList';
import MyDocument from './MyDocument'
import AddListPage from '../Kanban/AddListPage'
import ScheduleAll from './ScheduleAll';
import Copy from '../images/copy.png';
import OnAlarm from '../images/onAlarm.png';
import OffAlarm from '../images/offAlarm.png';


function Main () {
  const [modalOpen, setModalOpen] = useState(false);
  const [crewsOpen, setcrewsOpen] = useState(false);
  const [userInproject, setUserInProject] = useRecoilState(userInProjectState);
  const [getInviteCode, setGetInviteCode] = useState(false);
  const [InviteCode, setInviteCode] = useState();
  const [alarmNote, setAlarmNote] = useState([]);
  const [openAlarm, setOpenAlarm] = useState(false);
  
  const selectedProjectTitle = sessionStorage.getItem("selectedProjectTitle");
  const selectedProjectId = sessionStorage.getItem("selectedProjectId");
  const userCode = sessionStorage.getItem("userCode");

  var Main_switchCode = sessionStorage.getItem("Main_switchCode") ? sessionStorage.getItem("Main_switchCode") : 0;

  useEffect(() => {(async() => {
    {try {
      const res = await axios
      .get(
        `http://back.fuseable.monster/api/project/${selectedProjectId}/crews`
      )
      .then((response) => 
      {
        setUserInProject(clearData(userInproject));
        (response.data.crews).map((data) => {
          return setUserInProject((oldUserInproject) => [
            ...oldUserInproject,
            {
              userId: data.userId,
              userName: data.userName,
              userPicture: data.userPicture,
            },
          ])
        })
      })
    }
    catch (e) {
      console.error(e);
    }}
    })();
  },[])

  useEffect(() => {(async() => {
    {try {
      const res = await axios
      .get(
        `http://back.fuseable.monster/api/project/note/alarmNote/${selectedProjectId}`
      )
      .then((response) => 
      {
        console.log("AlarmNote: ", response.data);
        (response.data)
        .filter((data) => data.step !== "DONE")
        .map((data) => {
          return setAlarmNote((oldAlarmNote) => [
            ...oldAlarmNote,
            data
          ])
        })
      })
    }
    catch (e) {
      console.error(e);
    }}
    })();
  },[])

  const Alarm = (props) => {
    const { open, close } = props;
  
    return (
      <div className={open ? 'openedModal' : 'modal'}>
        {open ? (
          <section>
            <div>
              {props.header}
            </div>
            <main>
              {alarmDataHandler()}
            </main>
            <footer>
              <button className="close" onClick={close}>
                close
              </button>              
            </footer>
          </section>
        ) : null}
      </div>
    )
  }

  const alarmDataHandler = () => {
    console.log("Note: ", alarmNote);
    return alarmNote.map((data) => {
      return <div key={data.noteId}>{data.title}</div>
    })
  }

  // console.log("Crews : ", userInproject);

  const clearData = (arr) => {
    return [...arr.slice(0,0)]
  }

  const Modal = (props) => {
    const { open, close } = props;
  
    return (
      <div className={open ? 'openedModal' : 'modal'}>
        {open ? (
          <section>
            <div>
              <button className="close" onClick={close}>
                close
              </button>
            </div>
            <main>
              <ul>
                <li>
                  <button className='btn btn-primary' onClick={switchToScheduleAll}>Schedule</button>
                </li>
                <li>
                  <button className='btn btn-primary showCrawmate' onClick={openCrews}>참여 인원</button>
                </li>
                <li>
                 <button className="btn btn-primary Start-addBtn" onClick={openGetInviteCode}>초대 코드 발급</button>
                </li>
              </ul>
            </main>
            <footer>
              
            </footer>
              <a href={process.env.REACT_APP_LogoutURL} id="logout-btn">Kakao Logout</a>
              <button onClick={onLogout} id="Google-logout-btn">Google Logout</button>
          </section>
        ) : null}
      </div>
    )
  }

  const onLogout = () => {
    // google.accounts.id.disableAutoSelect();
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const GetInviteCode = (props) => {
    const { open, close, header } = props;
  
    return (
      <div className={open ? 'openedModal' : 'modal'}>
        {open ? (
          <section>
            <div>
              {header}
            </div>
            <main>
              {props.children}
              <input
                id='GetInviteCode'
                className="Get_InviteCode"
                value={InviteCode}
                readOnly
              />
              <img src={Copy} 
                alt="Copy" 
                className='copy' 
                onClick={copyData}
                style={
                  {
                    "width" : "20px",
                    "height" : "20px"
                  }
                }
              />
            </main>
            <footer>
              <button className="close" onClick={close}>
                close
              </button>
            </footer>
          </section>
        ) : null}
      </div>
    )
  }

  const openGetInviteCode = async() => {
    try {
      const res = await axios
      .get(
        `http://back.fuseable.monster/api/project/invite/${userCode}/${selectedProjectId}`
      )
      .then((response) => {
          console.log("InviteCode: ", response);
          setInviteCode(response.data.inviteCode);
        }
      )
    }
    catch(e) {
      console.log(e);
    }

    closeModal();
    setGetInviteCode(true);
  };

  const closeGetInviteCode = () => {
    setGetInviteCode(false);
  };

  const Crews = (props) => {
    const { open, close } = props;

    const userDataHandler = () => {
      return userInproject
      .map((user) => <div className='UserInProject' key={user.userId}>{user.userName} <img className='UserInProjectProfileImg' src={user.userPicture} alt="User Image" ></img> </div>)
    }
  
    return (
      <div className={open ? 'openedCrew' : 'crew'}>
        {open ? (
          <section>
            <div>
              <button className="close" onClick={close}>
                close
              </button>
            </div>
            <main>
              {userDataHandler()}
            </main>
            <footer>
              
            </footer>
          </section>
        ) : null}
      </div>
    )
  }

  const copyData = () => {
    const inviteCodeToCopy = document.getElementById("GetInviteCode").value;
    console.log(inviteCodeToCopy);

    try {
      navigator.clipboard.writeText(inviteCodeToCopy);
      alert("복사되었습니다")
    }
    catch (e) {
      alert("복사 에러");
      console.log(e);
    }
  }

  const openCrews = () => {
    closeModal();
    setcrewsOpen(true);
  };

  const closeCrews = () => {
    setcrewsOpen(false);
  };
  
  const getOpenAlarm = () => {
    setOpenAlarm(true);
  }
  
  const getCloseAlarm = () => {
    setOpenAlarm(false);
  }

  const datahandler = () => {
    if(Main_switchCode == 0) {
      // console.log("Kanban Loading");
      return (
        <Kanban />
      )
    }
    else if(Main_switchCode == 1) {
      // console.log("Main_Switchcode1 Loading");
      return (
        <NoticeList />
      )
    }
    else if(Main_switchCode == 2) {
      // console.log("Main_Switchcode2 Loading");
      return (
        <MyCalendar className="calendar"></MyCalendar>
      )
    }
    else if(Main_switchCode == 3) {
      // console.log("Main_Switchcode3 Loading");
      return (
        <MyDocument />
      )
    }
    else if(Main_switchCode == 4) {
      console.log("Main_Switchcode3 Loading");
      return (
        <ScheduleAll />
      )
    }
    else {
      console.log("Loading Error from Main Select!\n\n");
    }
  }

  const switchToKanban = () => {
    // console.log("Main_SwitchCode : ", Main_switchCode);
    sessionStorage.setItem("Main_switchCode", 0);
    window.location.reload();
  }

  const switchToNotice = () => {
    // console.log("Main_SwitchCode : ", Main_switchCode);
    sessionStorage.setItem("Main_switchCode", 1);
    window.location.reload();
  }

  const switchToCalendar = () => {
    // console.log("Main_SwitchCode : ", Main_switchCode);
    sessionStorage.setItem("Main_switchCode", 2);
    window.location.reload();
  }

  const switchToMyDocument = () => {
    // console.log("Main_SwitchCode : ", Main_switchCode);
    sessionStorage.setItem("Main_switchCode", 3);
    window.location.reload();
  }

  const switchToScheduleAll = () => {
    // console.log("Main_SwitchCode : ", Main_switchCode);
    sessionStorage.setItem("Main_switchCode", 4);
    window.location.reload();
  }

  return (
    <React.Fragment>
      <div className='container'>
        <div className='Temp'>
          <div className='Main-header'>
            <div className='logo'>
              <img src={Logo} alt="Logo" className='logo' onClick={switchToKanban}/>
            </div>
            <img 
              src={alarmNote.length ? OnAlarm : OffAlarm} 
              style={{"width" : "20px", "height" : "20px"}}
              className='alarmNote'
              onClick={getOpenAlarm}
              ></img>
            <Alarm open={openAlarm} close={getCloseAlarm} header="마감 임박!"></Alarm>
            <Crews open={crewsOpen} close={closeCrews} header="참여 인원"></Crews>
            <div className='sidebarBtn'>
              <button className='btn btn-primary sidebar' onClick={openModal}>
                Side
              </button>
              <Modal open={modalOpen} close={closeModal} header="Modal heading"></Modal>          
              <GetInviteCode open={getInviteCode} close={closeGetInviteCode} header="초대코드"></GetInviteCode>  
            </div>
          </div>
          <div className='Main-mainbody'>
            <div className='Main-interface'>
              <div className='Main-notice' onClick={switchToNotice}>
                공지사항
              </div>
              <div className='Main-calendar' onClick={switchToCalendar}>
                일정
              </div>
              <div className='Main-mydocument' onClick={switchToMyDocument}>
                내가 작성한 문서
              </div>
              <div className='Main-myproject'>
                <Link className='textLink' to="/start">진행중인 프로젝트</Link>
              </div>
              <div className='Main-notice-banner'>
                <NoticeBanner className='NoticeBanner' />
              </div>
            </div>
            <div className={Main_switchCode == 3 ? 'Main-Mydocument' : 'Main-main'}>
              <div className='Main-projectname' onClick={switchToKanban}>
                {selectedProjectTitle}
              </div>
              <div className="Main-progress">
                {datahandler()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}


export default Main;