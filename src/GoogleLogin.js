import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleLogin = () => {
  // 카카오 개발자 앱 키 선언
  const KAKAO_AUTH_URI = `http://www.fuseable.monster:3000/googleredirect?code=`;
  // 인가코드 받아오기
  const code = new URL(window.location.href).searchParams.get("code");

  console.log("Code : ", code);

  // 로그인 성공시 MyPage로 이동시키기위해 useNavigate 사용
  const navigate = useNavigate();
  useEffect(() => {
    //////////////////////////////////////////////////////////////
    //       백엔드로부터 인가코드 넘기고 jwt 토큰 받기
    ////////////////////////////////////////////////////////////
    (async () => {
      try {
        console.log("TEST1");
        const res = await axios
          // 백엔드 주소 뒤에 인가코드 붙여서 GET 설정
          // 백엔드는 이 주소를 통해 뒤에 붙여져있는 인가코드를 전달 받게 된다.
          .get(
            `http://back.fuseable.monster:8080/api/login/oauth2/token?code=${code}`
          )
          // 백엔드 쪽에서 보내준 응답 확인
          .then((response) => {
            // console.log("응답 확인", response);
            // 이때,
            // 백엔드로부터 받아온 헤더값에 저장되어있는 authorization 을 접근해 token 이라는 변수에 저장
            const token = response.headers.authorization;
            // 이 토큰은 프론트엔드, 즉 현재 내 서버에 저장시킨다.
            sessionStorage.setItem("token", token);
            // console.log("Stored token",token);
          });
      } catch (e) {
        // 에러 발생 시, 에러 응답 출력
        console.error(e);
      }

      // 위에서 setItem 을 사용하여 내부에 저장시킨 토크을 다시 불러온다.
      // 이때, 내부 저장소에서 가져온 토큰을 다시 token 이라는 변수에 담는다.
      const token = sessionStorage.getItem("token");
      // console.log("Storage token",token);
      ////////////////////////////////////////////////////////////
      //               백엔드로 토큰 다시 넘기기
      ////////////////////////////////////////////////////////////
      try {
        console.log("TEST2");
        const res = await axios
          // 이때, post가 아닌 get으로 접근한다.
          // 접근 주소는 백엔드에서 설정한 주소로 한다.
          .get(
            "http://back.fuseable.monster:8080/api/me",
            {
              // 헤더값에는 받아온 토큰을 Authorization과 request 에 담아서 보낸다/
              headers: {
                Authorization: token,
                request: token,
              },
            }
          )
          // 위에서 백엔드가 토큰을 잘받고 처리해서 유저정보를 다시 넘겨준다면, 그 응답을 처리한다.
          // data 라는 변수에 유저 정보를 저장하고, setItem을 사용해 로컬에 다시 저장한다.
          .then((data) => {
            sessionStorage.setItem("Email", JSON.stringify(data.data.accountEmail));
            sessionStorage.setItem("Id", JSON.stringify(data.data.accountId));
            sessionStorage.setItem("Nickname", JSON.stringify(data.data.accountNickname));
            sessionStorage.setItem("ProfileImg", JSON.stringify(data.data.profileImg));
            sessionStorage.setItem("userCode", JSON.stringify(data.data.userCode));
            sessionStorage.setItem("userRole", JSON.stringify(data.data.userRole));

            console.log("DATA", data);

            
            // 만약, 유저정보를 잘 불러왔다면 navigate를 사용해 프론트엔드에서 설정한 마이페이지 경로를 설정해서 이동시킨다.
            if (data) {
              navigate("/start");
            }
          });
      } catch (e) {
        // 에러 발생 시, 에러 응답 출력
        console.error(e);
      }
    })();
  }, []);

  return (
    <>
      <div className="KaKaoBtn">
        <a href={KAKAO_AUTH_URI}>카카오로 시작하기</a>
      </div>
    </>
  );
};


export default GoogleLogin;