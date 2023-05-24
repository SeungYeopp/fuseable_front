import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Pages/Login.css';


function Logout () {

  const navigate = useNavigate();

  useEffect(() => {(() => {
    {try {
      {navigate("/")}   
    }
    catch (e) {
      console.error(e);
    }}
    })();
  },[])

  return (
    <div>
      kakaoLogout
    </div>
  )
}

export default Logout;