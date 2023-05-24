import React from 'react';
import '../css/Pages/Login.css';
import Logo from '../images/Logo.png';
import GoogleLoginImg from '../images/GoogleLoginImg.png'


function Login () {
  sessionStorage.setItem("Start_switchCode", 0);

  return (
    <div className="container">
      <header className="Login-header">
        <div>
          <img src={Logo} alt="Logo" className='Login-logo'/>
        </div>
        <div className="Login-kakaoLoginBtn">
          <a href={process.env.REACT_APP_LoginURL}>
            <img
          src="//k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
          width="222"
          alt="카카오 로그인 버튼"
            />
          </a>
          <span></span>
          <a href={process.env.REACT_APP_Google_Login}>
            <img
          src={GoogleLoginImg}
          width="222"
          alt="구글 로그인 버튼"
            />
          </a>
        </div>
      </header>
    </div>
  )
}


export default Login;