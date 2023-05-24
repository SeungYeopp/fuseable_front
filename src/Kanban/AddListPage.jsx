import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Pages/Main.scss';
import Logo from '../images/Logo.png';
import { kanbanListState } from "../recoil";
import NoticeBanner from '../Notice/NoticeBanner';
import "../css/Pages/SideBar.css"
import { useEffect } from 'react';
import axios from 'axios';
import { userInProjectState } from '../recoil';
import { useRecoilState } from 'recoil';
import ReactDatePicker from "react-datepicker";
import Copy from '../images/copy.png';
import OnAlarm from '../images/onAlarm.png';
import OffAlarm from '../images/offAlarm.png';


var countNew = 1;

function AddListPage () {
  const [KanbanList, setKanbanList] = useRecoilState(kanbanListState);
  const [modalOpen, setModalOpen] = useState(false);
  const [crewsOpen, setcrewsOpen] = useState(false);
  const [userInproject, setUserInProject] = useRecoilState(userInProjectState);
  const [selectedDate, seleteDate] = useState(new Date());
  const [imgBase64, setImgBase64] = useState([]);
  const [imgFile, setImgFile] = useState(null);
  const [getInviteCode, setGetInviteCode] = useState(false);
  const [InviteCode, setInviteCode] = useState();
  const [alarmNote, setAlarmNote] = useState([]);
  const [openAlarm, setOpenAlarm] = useState(false);
  
  const userCode = sessionStorage.getItem("userCode");
  const title = sessionStorage.getItem("tempProgress");
  console.log("Progress : ", title);
  const selectedProjectTitle = sessionStorage.getItem("selectedProjectTitle");
  const selectedProjectId = sessionStorage.getItem("selectedProjectId");

  var tempTitle = countNew == 1 ? "" :  sessionStorage.getItem("tempNewTitle")
  var tempContent = countNew == 1 ? "" :  sessionStorage.getItem("tempNewContent")

  var switchCode = sessionStorage.getItem("switchCode") ? sessionStorage.getItem("switchCode") : 0;
  const navigate = useNavigate();

  countNew = 1;

  const getId = () => {
    console.log("GetId: ", KanbanList.slice(-1)[0]);
    let id = KanbanList.length > 0 ? KanbanList.slice(-1)[0].id : 1;
    return id;
  }
  
  const setDate = (date) => {
    tempTitle = document.getElementById('inputNewTitle').value;
    tempContent = document.getElementById('inputNewContent').value;

    sessionStorage.setItem("tempNewTitle", tempTitle)
    sessionStorage.setItem("tempNewContent", tempContent)

    countNew++;
    seleteDate(date);
  }

  useEffect(() => {(async() => {
    {try {
      const res = await axios
      .get(
        `http://3.36.58.146:8080/api/project/${selectedProjectId}/crews`
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

  console.log("Crews : ", userInproject);

  const Add = () => {
    var textTitle = document.getElementById('inputNewTitle').value;
    var textContent = document.getElementById('inputNewContent').value;
    var textDeadline = document.getElementById('inputDeadline').value;

    addItem(textTitle, textContent, textDeadline);
  }

  const fileUpload = (e) => {

    const file = e.target.files;

    for(var i = 0; i < (file).length; i++) {
      console.log("test:", file[i]);
    }

    setImgFile(file)
  }

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

  const addItem = async(textTitle, textContent, textDeadline) => {
    const formData = new FormData();

    const deadline = (textDeadline.slice(6,10) + "-" + textDeadline.slice(0,2) + "-" + textDeadline.slice(3,5))

    const data = {
      arrayId: getId(),
      step: title,
      title: textTitle,
      content: textContent,
      endAt: deadline,
    }

    console.log("axios data :", data); 

    formData.append("contents", new Blob([JSON.stringify(data)], {type: "application/json"}))

    if(imgFile)
    {
      Object.values(imgFile).forEach((imgFile) => formData.append("file", imgFile))
    }

    setKanbanList((oldKanbanList) => [
      ...oldKanbanList,
      {
        id: getId(),
        progress: title,
        title: textTitle,
        content: textContent,
        deadline: textDeadline,
      },
    ]);

    try {
      const res = await axios
      .post(
        `http://3.36.58.146:8080/api/project/main/${userCode}/${selectedProjectId}`,
        formData,
      )
      .then((response) => {
        console.log(response)
        navigate('/main')
      })
    }
    catch(e) {
      console.log(e);
    }
  };

  const clearData = (arr) => {
    return [...arr.slice(0,0)]
  }

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
                  <button className='btn btn-primary' onClick={goToScheduleAll}>Schedule</button>
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

  const openGetInviteCode = async() => {
    try {
      const res = await axios
      .get(
        `http://3.36.58.146:8080/api/project/invite/${userCode}/${selectedProjectId}`
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

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
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

  const datahandler = () => {
    return (
      <div className='note'>
        <div className='note-content'>
        <ul>
                <li>
                  <input
                    id="inputNewTitle"
                    className="Input_title"
                    type="text"
                    placeholder='Title'
                    defaultValue={tempTitle || ''}
                  />
                </li>
                <li>
                  <ReactDatePicker 
                    selected={selectedDate}
                    onChange={date => setDate(date)}
                    id="inputDeadline"
                    type="text"
                    className="Input_deadline"
                  />
                </li>
                <li>
                  <input type="file" name='file' id="FileUpload" onChange={fileUpload} multiple>
                  </input>
                </li>
                <li>
                  <textarea
                    id="inputNewContent"
                    className="Input_content"
                    type="text"
                    placeholder='Content'
                    defaultValue={tempContent || ''}
                  />
                </li>
                <li>
                  <input type='button'
                    className="Add"
                    defaultValue='생성'
                    onClick={Add}
                  />
                </li>
              </ul>
        </div>
        <div className='note-comment'>
          
        </div>  
      </div>
    )
  }

  const goToKanban = () => {
    sessionStorage.setItem("Main_switchCode", 0);
    navigate('/main')
  }

  const goToNotice = () => {
    sessionStorage.setItem("Main_switchCode", 1);
    navigate('/main')
  }

  const goToCalendar = () => {
    sessionStorage.setItem("Main_switchCode", 2);
    navigate('/main')
  }

  const goToMyDocument = () => {
    sessionStorage.setItem("Main_switchCode", 3);
    navigate('/main')
  }

  const goToScheduleAll = () => {
    sessionStorage.setItem("Main_switchCode", 4);
    navigate('/main')
  }
  
  const getOpenAlarm = () => {
    setOpenAlarm(true);
  }
  
  const getCloseAlarm = () => {
    setOpenAlarm(false);
  }

  useEffect(() => {(async() => {
    {try {
      const res = await axios
      .get(
        `http://3.36.58.146:8080/api/project/note/alarmNote/${selectedProjectId}`
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

  return (
    <React.Fragment>
      <div className='container'>
        <div className='Temp'>
          <div className='Main-header'>
            <div className='logo'>
              <img src={Logo} alt="Logo" className='logo' onClick={goToKanban}/>
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
              <div className='Main-notice' onClick={goToNotice}>
                공지사항
              </div>
              <div className='Main-calendar' onClick={goToCalendar}>
                일정
              </div>
              <div className='Main-mydocument' onClick={goToMyDocument}>
                내가 작성한 문서
              </div>
              <div className='Main-myproject'>
                <Link className='textLink' to="/start">진행중인 프로젝트</Link>
              </div>
              <div className='Main-notice-banner'>
                <NoticeBanner className='NoticeBanner' />
              </div>
            </div>
            <div className={switchCode == 3 ? 'Main-Mydocument' : 'Main-main'}>
              <div className='Main-projectname' onClick={goToKanban}>
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


export default AddListPage;