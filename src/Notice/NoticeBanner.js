import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import React from "react";
import 'swiper/css'
import { noticeListState } from "../recoil";
import {Swiper, SwiperSlide} from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';


import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../css/swiper.css'


function NoticeBanner() {
  const [bookmarkNoticeList, setBookmarkNoticeList] = useState([]);
  
  const selectedProjectId = sessionStorage.getItem("selectedProjectId");


  useEffect(() => {(async() => {
    {try {
      const res = await axios
      .get(
        `http://back.fuseable.monster/api/articles/list/bookmark/${selectedProjectId}`
      )
      .then((response) => 
      {
        console.log("EFFECT : ", response);
        setBookmarkNoticeList(clearData(bookmarkNoticeList));
        (response.data).map((data) => {
          return setBookmarkNoticeList((oldNoticeList) => [
            ...oldNoticeList,
            {
              id: data.id,
              title: data.title,
              content: data.content,
              bookmark: data.bookmark,
            },
          ])
        })
        // console.log("Response: ", response.data.note);
        console.log("Data : ", bookmarkNoticeList);
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

  return (
    <Swiper 
      modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
      spaceBetween={50}
      slidesPerView={1}
      // navigation
      loop={true}
      pagination={{clickable: true}}
      autoplay={{delay: 2000}}
      onSwiper={(swiper) => console.log(swiper)}
      // onSlideChange={() => console.log('slide change')}
    >
      {bookmarkNoticeList.map((slide) => (<SwiperSlide key={slide.id}>{slide.title}</SwiperSlide>))}
    </Swiper>
  )
}

export default NoticeBanner;