import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { projectListState } from "../recoil";
import BookmarkTrue from '../images/bookmarkT.png';
import BookmarkFalse from '../images/bookmarkF.png';


function EditProjectList({item}) {
  const [projectList, setProjectList] = useRecoilState(projectListState);
  const [modalOpen, setModalOpen] = useState(false);
  const index = projectList.findIndex((listItem) => listItem === item);

  const userCode = sessionStorage.getItem("userCode");


  const navigate = useNavigate();

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
                    id='editProjectTitie'
                    className="Input_ProjectName"
                    placeholder='Project Name'
                    defaultValue={item.title}
                  />
                  <input type='button'
                    className="editProjectTitie"
                    defaultValue='수정'
                    onClick={editItem}
                  />
                  <input type='button'
                    className="Delete"
                    defaultValue='삭제'
                    onClick={deleteItem}
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
  
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  
  const editItem = async() => {
    var title = document.getElementById('editProjectTitie').value;

    const newList = replaceItemAtIndex(projectList, index, {
      ...item,
      title: title,
    });

    setProjectList(newList);
    closeModal();
    console.log("TITLE : ", title);

    try {
      const res = await axios
      .post(
        `http://3.36.58.146:8080/api/project/update/${userCode}/${item.id}`,
        {title},
      )
      .then((response) => console.log(response))
    }
    catch(e) {
      console.log(e);
    }

    navigate('/start');
  }


  const deleteItem = async() => {
    const newList = removeItemAtIndex(projectList, index);

    setProjectList(newList);

    try {
      const res = await axios
      .get(
        `http://3.36.58.146:8080/api/project/delete/${userCode}/${item.id}`,
      )
      .then((response) => {
        console.log(response);
      })
    }
    catch(e) {
      console.log(e);
    }
    
    closeModal();
  };

  const projectSelect = () => {
    sessionStorage.setItem("selectedProjectId",item.id);
    sessionStorage.setItem("selectedProjectTitle",item.title);

    navigate('/main');
  }

  const changeState = async () => {
    try {
      const res = await axios
      .get(
        `http://3.36.58.146:8080/api/project/bookmark/${userCode}/${item.id}`,
      )
      .then((response) => console.log(response))
    }
    catch(e) {
      console.log(e);
    }
    
    window.location.reload();
  }

  return (
    <>
      <React.Fragment>
        <div className="projectList">
          <img 
            className="bookmark_img" 
            src={item.bookmarkState ? BookmarkTrue : BookmarkFalse} 
            onClick={changeState}
            style={{width: "15px", height: "15px"}}></img>
          <div className="ptojectTitle" onClick={projectSelect}>{item.title}</div>
          <Modal open={modalOpen} close={closeModal} header="Modal heading"></Modal>
          <button className="Edit_btn" onClick={openModal}>수정</button>
        </div>
      </React.Fragment>
    </>
  )


}

function replaceItemAtIndex(arr, index, newValue) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex(arr, index) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export default EditProjectList;