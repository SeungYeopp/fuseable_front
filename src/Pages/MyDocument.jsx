import React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { myDocumentState, userInProjectState } from '../recoil';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useState } from 'react';
import MyDocumentList from './MyDocumentList';


function MyDocument () {
  const mydocument = useRecoilValue(myDocumentState)
  const [mydocumentSet, setmydocumentSet] = useRecoilState(myDocumentState);

  const userCode = sessionStorage.getItem("userCode");
  const selectedProjectId = sessionStorage.getItem("selectedProjectId");

  useEffect(() => {(async() => {
    {try {
      const res = await axios
      .get(
        `http://back.fuseable.monster/api/project/main/mynote/${userCode}/${selectedProjectId}`
      )
      .then((response) => 
      {
        setmydocumentSet(clearData(mydocumentSet));
        (response.data.note).map((data) => {
          return setmydocumentSet((oldMydocument) => [
            ...oldMydocument,
            {
              id: data.arrayId,
              title: data.title,
              content: data.content,
              deadline: (data.endAt.slice(5, 7) + "/" + data.endAt.slice(8, 10) + "/" + data.endAt.slice(0, 4)),
              progress: data.step,
            },
          ])
        })
        console.log("Response: ", response.data.note);
        console.log("Data : ", mydocument);
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

  const dataHandler = () => {
    var sequence = 1;
    return mydocument
    .map((item) => <MyDocumentList key={sequence} order={sequence++} item={item} ></MyDocumentList> )
  }

  return (
    <React.Fragment>
      <div className="myDocument">
        <div>Document List</div>
        <span>순서</span><span className='myDocumentTitle'>제목</span>
        {dataHandler()}    
      </div>
    </React.Fragment>
  )
}


export default MyDocument;