import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useRecoilState, useRecoilValue } from "recoil";
import { noticeListState } from "../recoil";
import EditNotice from "./EditNotice";
import "../css/Pages/NoticeSet.css";


function NoticeList () {
  const [modalOpen, setModalOpen] = useState(false);
  const noticeListSet = useRecoilValue(noticeListState);
  const [noticeList, setNoticeList] = useRecoilState(noticeListState);
  const userCode = sessionStorage.getItem("userCode");
  const [selectedDate, seleteDate] = useState(new Date());

  const selectedProjectId = sessionStorage.getItem("selectedProjectId");

  const getId = () => {
    let id = noticeList.length > 0 ? noticeList[noticeList.length - 1].id + 1 : 1;
    return id;
  }

  useEffect(() => {(async() => {
    {try {
      const res = await axios
      .get(
        `http://back.fuseable.monster/api/articles/list/${selectedProjectId}`
      )
      .then((response) => 
      {
        setNoticeList(clearData(noticeList));
        console.log("Notice List : ", response.data);
        (response.data).map((data) => {
          return setNoticeList((oldNoticeList) => [
            ...oldNoticeList,
            {
              id: data.id,
              title: data.title,
              content: data.content,
              startAt: data.startAt,
              user: data.user.accountNickname,
              bookmark: data.bookmark,
            },
          ])
        })
        // console.log("Response: ", response.data.note);
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

  const addItem = async() => {
    var title = document.getElementById('InputNoticeTitle').value;
    var content = document.getElementById('InputNoticeContent').value;
    var deadline = document.getElementById('InputNoticeStartAt').value;

    const startAt = (deadline.slice(6,10) + "-" + deadline.slice(0,2) + "-" + deadline.slice(3,5))

    console.log("INPUT : ", title, content);
    setNoticeList((oldNoticeList) => [
      ...oldNoticeList,
      {
        id: getId(),
        title: title,
        content: content,
        startAt: startAt,
        bookmark: true,
      },
    ]);
    closeModal();

    console.log("NOTICE : ", noticeListSet);

    try {
      const res = await axios
      .post(
        `http://back.fuseable.monster/api/articles/${userCode}/${selectedProjectId}`,
        {
          title: title,
          content: content,
          startAt: startAt,
        }
      )
    }
    catch(e) {
      console.log("ERROR : ", e);
    }

    window.location.reload();
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
              <ul>
                <li>
                  <input
                    id="InputNoticeTitle"
                    className="Input_title"
                    type="text"
                    placeholder='Title'
                  />
                </li>
                <li>
                  <ReactDatePicker 
                    selected={selectedDate}
                    readOnly
                    id="InputNoticeStartAt"
                    type="text"
                    className="Input_deadline"
                  />
                </li>
                <li>
                  <textarea
                    id="InputNoticeContent"
                    className="Input_content"
                    type="text"
                    placeholder='Content'
                  />
                </li>
                <li>
                  <input type='button'
                    className="Edit"
                    defaultValue='등록'
                    onClick={addItem}
                  />
                </li>
              </ul>
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

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };


  const dataHandler = () => {
    const bookmarkedNoticeList = noticeListSet.filter((data) => data.bookmark == true);
    const notBookmarkedNoticeList = noticeListSet.filter((data) => data.bookmark == false);

    return [
      bookmarkedNoticeList
      .map((item) => <EditNotice key={item.id} item={item}></EditNotice>),
      notBookmarkedNoticeList
      .map((item) => <EditNotice key={item.id} item={item}></EditNotice>)
    ]
  }

  return (
    <React.Fragment>
      <Modal open={modalOpen} close={closeModal} header="Modal heading"></Modal>
      <button className="NoticeAddBtn" onClick={openModal}>등록</button>
      <div className="noticeContainer">
        <div className="NoticeBookmark">북마크</div>
        <div className="NoticeIndex">게시 ID</div>
        <div className="NoticeTitle">제목</div>
        <div className="user">작성자</div>
        <div className="startAt">작성일</div> 
      </div>

      {dataHandler()}
    </React.Fragment>
  )
}

export default NoticeList;