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
import '../css/Kanban/EditListPage.scss';
import Copy from '../images/copy.png';
import OnAlarm from '../images/onAlarm.png';
import OffAlarm from '../images/offAlarm.png';


var countNew = 1;

function EditListPage () {
  const [kanbanList, setKanbanList] = useRecoilState(kanbanListState);
  const [modalOpen, setModalOpen] = useState(false);
  const [crewsOpen, setcrewsOpen] = useState(false);
  const [openAlarm, setOpenAlarm] = useState(false);
  const [userInproject, setUserInProject] = useRecoilState(userInProjectState);
  const [selectedDate, seleteDate] = useState(new Date());
  const [imgFile, setImgFile] = useState(null);
  const [loadingFile, setLoadingFile] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const [getInviteCode, setGetInviteCode] = useState(false);
  const [InviteCode, setInviteCode] = useState();
  const [alarmNote, setAlarmNote] = useState([]);

  const userId = sessionStorage.getItem("userCode");
  const selectedProjectId = sessionStorage.getItem("selectedProjectId");
  const selectedNoteId = sessionStorage.getItem("selectedNoteId");
  const selectedArrayId = sessionStorage.getItem("selectedArrayId");  
  const selectedNoteString = sessionStorage.getItem("selectedNote");
  const selectedNote = JSON.parse(selectedNoteString);
  var tempTitle = countNew == 1 ? selectedNote.title : sessionStorage.getItem("tempTitle");
  var tempContent = countNew == 1 ? selectedNote.content : sessionStorage.getItem("tempContent");
  const selectedProjectTitle = sessionStorage.getItem("selectedProjectTitle");
  var switchCode = sessionStorage.getItem("switchCode") ? sessionStorage.getItem("switchCode") : 0;
  
  const index = kanbanList.findIndex((listItem) => listItem.id === selectedNote.id);
  console.log("selectedNote: ", selectedNoteId);

  const navigate = useNavigate();

  const Edit = () => {
    var textTitle = document.getElementById('editTitle').value;
    var textContent = document.getElementById('editContent').value;
    var textDeadline = document.getElementById('editDeadline').value;

    editItem(textTitle, textContent, textDeadline);
  }

  useEffect(() => {(async() => {
    {try {
      const res = await axios
      .get(
        `http://back.fuseable.monster:8080/api/project/main/read/${userId}/${selectedProjectId}/${selectedNoteId}`
      )
      .then((response) => 
      {
        console.log("FILE DATA response: ", response);

        (response.data.files).map((data) => {
          return setLoadingFile((oldLoadingFile) => [
            ...oldLoadingFile,
            {
              fileId: data.fileId,
              fileName: data.fileName,
              fileRandomName: data.fileRandomName,
              fileUrl: data.fileUrl,
            }
          ])
        })

        setCommentList(response.data.comments)

      })
    }
    catch (e) {
      console.error(e);
    }}
    })();
  },[])

  const setDate = (date) => {
    tempTitle = document.getElementById('editTitle').value;
    tempContent = document.getElementById('editContent').value;

    countNew ++;
    seleteDate(date);
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

  const deleteItem = async() =>{
    const newList = removeItemAtIndex(kanbanList, index);

    try {
      const res = await axios
      .get (
        `http://back.fuseable.monster:8080/api/project/main/delete/${selectedProjectId}/${selectedArrayId}`
      )
      .then ((response) => 
        console.log("Delete Response : ", response)
      )
    }
    catch(e) {
      console.log(e);
    }
    navigate("/main")

    setKanbanList(newList);

  };

  const editItem = async(title, content, deadline) => {
    const formData = new FormData();
    
    const newList = replaceItemAtIndex(kanbanList, index, {
      ...selectedNote,
      title: title,
      content: content,
      deadline: deadline,
    });

    setKanbanList(newList);
    const endAt = (deadline.slice(6,10) + "-" + deadline.slice(0,2) + "-" + deadline.slice(3,5));

    const data = {
      title: title,
      content: content,
      endAt: endAt, 
    }

    formData.append("contents", new Blob([JSON.stringify(data)], {type: "application/json"}))

    if(imgFile)
    {
      Object.values(imgFile).forEach((imgFile) => formData.append("file", imgFile))
    }

    try {
      const res = await axios
      .post (
        `http://back.fuseable.monster:8080/api/project/main/update/${userId}/${selectedProjectId}/${selectedNoteId}`,
        formData,
      )
      .then ((response) => 
        console.log("Edit Response : ", response)
      )
    }
    catch(e) {
      console.log(e);
    }
    
    navigate('/main')
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

  const openCrews = () => {
    closeModal();
    setcrewsOpen(true);
  };

  const closeCrews = () => {
    setcrewsOpen(false);
  };

  const fileLoading = () => {
    // console.log("fileList: " ,loadingFile);
    console.log("Kanban Loading: ", kanbanList);
    return loadingFile.map((data) => {
      return (
        <div key={data.fileId + 100}>
          <span 
          key={data.fileId + 400}
          onClick={() => downloadFile(data)}
          >
            {data.fileName}
          </span>
          <button key={data.fileId + 700} onClick={() => deleteFile(data.fileId)}>X</button>
        </div>
      )
    })
  }

  const deleteFile = async(fileId) => {

    try {
      const res = await axios
      .get (
        `http://back.fuseable.monster:8080/api/project/main/mynote/${userId}/${selectedNoteId}/${fileId}`
      )
      .then ((response) => 
        console.log("Edit Response : ", response)
      )
    }
    catch(e) {
      console.log(e);
    }

    window.location.reload();
  }

  const datahandler = () => {
    return (
      <div className='note_edit'>
        <div className='note-content'>
          <ul className='editNoteContent'>
            <li>
              <span>제목</span>
              <input
                id="editTitle"
                className="Input_title"
                type="text"
                defaultValue={tempTitle || ''}
                placeholder='Title'
              />
            </li>
            <li>
              <span>마감기한</span>
              <ReactDatePicker 
                selected={selectedDate}
                onChange={date => setDate(date)}
                id="editDeadline"
                type="text"
                className="Input_deadline"
              />
            </li>
            <li>
              {fileLoading()}
            </li>
            <li>
              <span>첨부파일</span>
              <input type="file" name='file' id="FileUpload" onChange={fileUpload} multiple>
              </input>
            </li>
            <li>
              <span>내용</span>
              <textarea
                id="editContent"
                className="Input_content"
                type="text"
                defaultValue={tempContent || ''}
                placeholder='Content'
              />
            </li>
            <li>
              <input type='button'
                className="Edit"
                defaultValue='수정'
                onClick={Edit}
              />
            </li>
            <button className="Delete_btn" onClick={deleteItem}>삭제</button>
          </ul>
        </div>
        <div className='note-comment'>
          {commentHandler()}
          {console.log("Comment: ", commentList)}
          <input
                id="addComment"
                className="Input_content"
                type="text"
                defaultValue={''}
                placeholder='Content'
                onKeyDown={(e) =>{
                if (e.key === 'Enter') {
                  {addComment()}
                }}}
              />
          <button className="AddComment_btn" onClick={addComment}>입력</button>
        </div>  
      </div>
    )
  }

  const addComment = async() => {
    var comment = document.getElementById('addComment').value;

    if (!comment) {
      console.log("Comment is Null");
    }

    else {
      const data = 
      {
        content: comment,
        writerId: userId,
      }

      console.log("Comment Send Data: ", data);

      try {
        const res = await axios
        .post(
          `http://back.fuseable.monster:8080/api/comments/${selectedNoteId}`,
          data
        )
        .then((response) => {
          console.log("Comment Response: ", response);
          window.location.reload();
        })
      }
      catch (e) {
        console.log(e);
      }
    }
  }

  const commentHandler = () => {
    return commentList.map((data) => {
      return <div key={data.commentId + 1000} className='commentContainer'>
          <span key={data.commentId + 1300} className='commentContent'>{data.comment}</span>
          <button key={data.commentId + 1600} className='commentDelBtn' onClick={() => deleteComment(data.commentId)}>X</button>
        </div>
    })
  }

  const deleteComment = async(commentId) => {
    try {
      const res = await axios
      .delete(
        `http://back.fuseable.monster:8080/api/comments/${userId}/${commentId}`
      )
      .then((response) => {
        console.log("Delete Comment: ", response);
        window.location.reload();
      })
    }
    catch(e) {

    }
  }
    
  const downloadFile = async(downloadFileData) => {
    const fileName = downloadFileData.fileName;
    const fileRandomName = downloadFileData.fileRandomName;
    const fileUrl = downloadFileData.fileUrl;

    const data =         
    {
      fileName: fileName,
      fileRandomName: fileRandomName,
      fileUrl: fileUrl,
    }

    console.log("File data Send: ", data);

      // const  url = "C:/Users/Ku/Desktop/" + fileRandomName;

      // console.log("URL: ", url);
      
      // const res = await axios
      //   .get(url)
      //       .then((res) => {
      //           return res.blob();
      //       })
      //       .then((blob) => {
      //           const url = window.URL.createObjectURL(blob);
      //           const a = document.createElement('a');
      //           a.href = url;
      //           a.download = fileName;
      //           document.body.appendChild(a);
      //           a.click();
      //           setTimeout((_) => {
      //               window.URL.revokeObjectURL(url);
      //           }, 60000);
      //           a.remove();
      //       })
      //       .catch((err) => {
      //           console.error('err: ', err);
      //       });

    try {
      const res = await axios
      .post(
        `http://back.fuseable.monster:8080/api/project/main/note/download`,
        data,
        {responseType: 'blob'}
      )
      .then((response) => {
        console.log("File Response: ", new Blob([response.data]));
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
      })
    }
    catch (e) {
      console.log(e);
    }
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

  const fileUpload = (e) => {
    const file = e.target.files;

    setImgFile(file)
  }

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

  const onLogout = () => {
    // google.accounts.id.disableAutoSelect();
  };

  const openGetInviteCode = async() => {
    try {
      const res = await axios
      .get(
        `http://back.fuseable.monster:8080/api/project/invite/${userId}/${selectedProjectId}`
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

  useEffect(() => {(async() => {
    {try {
      const res = await axios
      .get(
        `http://back.fuseable.monster:8080/api/project/note/alarmNote/${selectedProjectId}`
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

  const getOpenAlarm = () => {
    setOpenAlarm(true);
  }
  
  const getCloseAlarm = () => {
    setOpenAlarm(false);
  }

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

function replaceItemAtIndex(arr, index, newValue) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex(arr, index) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}


export default EditListPage;