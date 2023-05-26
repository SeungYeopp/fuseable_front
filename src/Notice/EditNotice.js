import axios from "axios";
import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { noticeListState } from "../recoil";
import "../css/Pages/NoticeSet.css";
import BookmarkTrue from '../images/bookmarkT.png';
import BookmarkFalse from '../images/bookmarkF.png';


function EditNotice ({item}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [noticeList, setNoticeList] = useRecoilState(noticeListState);
  const index = noticeList.findIndex((listItem) => listItem === item);
  const [selectedDate, seleteDate] = useState(new Date());

  const navigate = useNavigate();

  const editItem = async() => {
    var textTitle = document.getElementById('InputNoticeTitle').value;
    var textContent = document.getElementById('InputNoticeContent').value;

    const newList = replaceItemAtIndex(noticeList, index, {
      ...item,
      title: textTitle,
      content: textContent,
    });

    setNoticeList(newList);

    try {
      const res = await axios
      .put(
        `http://back.fuseable.monster:8080/api/articles/${item.id}`,
        {
          title: textTitle,
          content: textContent,
        }
      )
      .then((response) => {
        console.log(response);
      })
    }
    catch(e) {
      console.log(e);
    }

    closeModal();

    window.location.reload();
  };

  const deleteItem = async() =>{
    const newList = removeItemAtIndex(noticeList, index);

    setNoticeList(newList);

    try {
      const res = await axios
      .delete(
        `http://back.fuseable.monster:8080/api/articles/${item.id}`,
      )
      .then((response) => {
        console.log(response);
      })
    }
    catch(e) {
      console.log(e);
    }

    closeModal();
    
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
                    defaultValue={item.title || ''}
                    placeholder='Title'
                  />
                </li>
                <li>
                  <ReactDatePicker 
                    selected={selectedDate}
                    readOnly
                    id="editDeadline"
                    type="text"
                    className="Input_deadline"
                  />
                </li>
                <li>
                  <textarea
                    id="InputNoticeContent"
                    className="Input_content"
                    type="text"
                    defaultValue={item.content || ''}
                    placeholder='Content'
                  />
                </li>
                <li>
                  <input type='button'
                    className="Edit"
                    defaultValue='수정'
                    onClick={editItem}
                  />
                </li>
                <li>
                  <input type='button'
                    className="Edit"
                    defaultValue='삭제'
                    onClick={deleteItem}
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

  // const dataHandler = (progress) => {
  //   var sequence = 1;
  //   return mydocument
  //   .map((item) => 
  //   <React.Fragment key={item.id}>
  //     <Modal open={modalOpen} close={closeModal} header="My Document" item={item}></Modal> 
  //     <span className='myDocumentList'>{sequence++}. </span>
  //     <span className='myDocumentList' onClick={openModal} >
  //       {item.title}
  //     </span>
  //   </React.Fragment>);
  // }

  return (
    <React.Fragment>
      <Modal open={modalOpen} close={closeModal} header="Notice"></Modal>
        <div className="noticeContainer" onClick={openModal}>
          <div className="Notice_bookmark_img">
            <img 
              src={item.bookmark ? BookmarkTrue : BookmarkFalse} 
              style={{width: "15px", height: "15px"}}></img>
          </div>
          <div className="NoticeIndex">{index + 1}</div>
          <div className="NoticeTitle">{item.title}</div>
          <div className="user">{item.user}</div>  
          <div className="startAt">{item.startAt}</div>  
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

export default EditNotice;