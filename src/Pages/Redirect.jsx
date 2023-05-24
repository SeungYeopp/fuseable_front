import React from "react";
import KakaoLogin from "../KakaoLogin";

function Redirect () {
  
  KakaoLogin();

  return (
    <div>
      Waiting Login
    </div>
  );
}

export default Redirect;