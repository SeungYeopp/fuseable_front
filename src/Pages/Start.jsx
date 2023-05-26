import React from 'react';
import '../css/Start.scss';
import { projectListState } from '../recoil';
import { useRecoilState } from 'recoil';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import Logo from '../images/Logo.png';
import EditProjectList from './EditProjectList';
import '../css/Kanban/AddList.css'
import { useNavigate } from 'react-router-dom';


function Start () {
  
  const [projectList, setProjectList] = useRecoilState(projectListState);
  const [modalOpen, setModalOpen] = useState(false);
  const [openInviteCode, setOpenInviteCode] = useState(false);

  const Nickname = sessionStorage.getItem("Nickname");
  const ProfileImg = sessionStorage.getItem("ProfileImg");
  const userCode = sessionStorage.getItem("userCode");

  const navigate = useNavigate();

  sessionStorage.setItem("Main_switchCode", 0);

  const getId = () => {
    let id = projectList.length > 0 ? projectList[projectList.length - 1].id + 1 : 1;
    return id;
  }

  const addItem = async() => {
    var title = document.getElementById('InputProjectName').value;

    if (title)
    setProjectList((oldProjectList) => [
      ...oldProjectList,
      {
        id: getId(),
        title: title,
      },
    ]);

    closeModal();

    // console.log("title", title);

    try {
      const res = await axios({
        method: 'post',
        url: `http://back.fuseable.monster/api/project/create/${userCode}`,
        data: 
          {
            title,
            title,
          },
      })
      .then((response) => {
        console.log("response", response)
        console.log("response data title", response.data.title);
        window.location.reload();
      })
    }
    catch(e) {
      console.log(e);
    }

    // console.log("REDIRECT START PAGE");
  };

  const Modal = (props) => {
    const { open, close, header } = props;
  
    return (
      <div className={open ? 'openedModal' : 'modal'}>
        {open ? (
          <section>
            <div>
              {header}
              <button className="close" onClick={close}>
                &times;
              </button>
            </div>
            <main>
              {props.children}
                  <input
                    id='InputProjectName'
                    className="Input_ProjectName"
                    placeholder='Project Name'
                  />
                  <input type='button'
                    className="Add"
                    defaultValue='등록'
                    onClick={addItem}
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

  const InviteCode = (props) => {
    const { open, close, header } = props;
  
    return (
      <div className={open ? 'openedModal' : 'modal'}>
        {open ? (
          <section>
            <div>
              {header}
              <button className="close" onClick={closeInviteCode}>
                &times;
              </button>
            </div>
            <main>
              {props.children}
                  <input
                    id='InputInviteCode'
                    className="Input_InviteCode"
                    placeholder='초대코드'
                  />
                  <input type='button'
                    className="invite"
                    defaultValue='초대코드 입력'
                    onClick={sendInviteCode}
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

  const sendInviteCode = async() => {
    var InviteCode = document.getElementById('InputInviteCode').value;

    closeInviteCode();

    try {
      const res = await axios
      .post(
        `http://back.fuseable.monster/api/project/invite/${userCode}`,
        {
          inviteCode: InviteCode,
        }
      )
      .then((response) => {
        console.log("response", response)
        window.location.reload();
      })
    }
    catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {(async() => {
    {
      try {
        const userCode = Number(sessionStorage.getItem("userCode"));
        console.log("userCode : ", userCode);
        const res = await axios
        .get(
          `http://back.fuseable.monster/api/project/${userCode}`
        )
        .then((response) => 
        {
          console.log("Response : ", response.data.projects);
          setProjectList(clearData(projectList));
          if (response.data.projects) 
            {(response.data.projects).map((data) => {
              return setProjectList((oldprojectList) => [
                ...oldprojectList,
                {
                  id: data.projectId,
                  title: (data.title[0] == '{') ? data.title.slice(10,data.title.length - 2) : data.title,
                  bookmarkState: data.bookmark,
                },
              ])
          })
        }
      })
    }
    catch (e) {
      console.error("Error from useEffect", e);
    }
  }
    })();
  },[])

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const getInviteCode = () => {
    setOpenInviteCode(true);
  };

  const closeInviteCode = () => {
    setOpenInviteCode(false);
  };

  const dataHandler = () => {
    
    {
      const bookmarkedProjects = projectList.filter((data) => data.bookmarkState === true);
      const unbookmarkedProjects = projectList.filter((data) => data.bookmarkState === false);
  
      return [
        ...bookmarkedProjects.map((item) => (
          <EditProjectList className='textLink' key={item.id} item={item}></EditProjectList>
        )),
        ...unbookmarkedProjects.map((item) => (
          <EditProjectList className='textLink' key={item.id} item={item}></EditProjectList>
        )),
      ];
    }
  };

  const clearData = (arr) => {
    return [...arr.slice(0,0)]
  }

  const editSchedule = () => {
    navigate('/start/schedule')
  }

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
          <div className='StartBtn'>
            <button className="btn btn-primary Start-addBtn" onClick={openModal}>프로젝트 생성</button>
            <span>  </span>
            <button className="btn btn-primary Start-schedule" onClick={editSchedule}>시간표 생성</button>
            <span> </span>
            <button className="btn btn-primary Start-inviteCode" onClick={getInviteCode}>초대 코드</button>
          </div>
        </div>
        <Modal open={modalOpen} close={closeModal} header="프로젝트 생성"></Modal>  
        <InviteCode open={openInviteCode} close={closeInviteCode} header="초대코드 입력"></InviteCode>  
        <div className='Start-projectList'>
          {dataHandler()}
        </div>
      </div>
    </React.Fragment>
  )
}

export default Start;