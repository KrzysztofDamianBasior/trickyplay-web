import React, { useState } from "react";
import styled from "styled-components";
import { gamesList } from "../../../shared/data/gamesList";

import "swiper/css/bundle";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation, EffectFade } from "swiper";

type Props = {};

const SitePromotion = (props: Props) => {
  const [games, setGames] = useState(gamesList);

  return (
    <PromotionContainer>
      <div className="promotion-container__child">
        <StyledSwiper
          onSlideChange={(slide) => console.log(slide.activeIndex)}
          slidesPerView={1}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          effect={"fade"}
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          speed={1000}
        >
          {games.map((item) => (
            <SwiperSlide key={item.id}>
              <SliderItem>
                <img src={item.image} alt="game logo" />
              </SliderItem>
            </SwiperSlide>
          ))}
        </StyledSwiper>
      </div>

      <div className="promotion-container__child">
        <GlowingLogo>
          <span>START </span> A <span> GAME</span>
        </GlowingLogo>
      </div>
    </PromotionContainer>
  );
};

const GlowingLogo = styled.h2`
  font-size: 6em;
  font-weight: 500;
  color: #222;
  letter-spacing: 5px;
  cursor: pointer;
  span {
    transition: 05s;
  }
  &:hover span:nth-child(1) {
    margin-right: 10px;
  }
  &:hover span:nth-child(2) {
    margin-left: 40px;
  }
  &:hover span {
    color: #fff;
    text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 40px #fff, 0 0 80px #fff,
      0 0 120px #fff;
  }
`;

const PromotionContainer = styled.div`
  height: 100vh;
  width: 95vw;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: row;

  .promotion-container__child {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    width: 500px;
    height: 500px;
  }
`;

const StyledSwiper = styled(Swiper)`
  height: 500px;
  .swiper-button-next,
  .swiper-button-prev {
    color: white !important;
  }
  .swiper-pagination-bullet-active {
    background-color: white !important;
  }
`;

const SliderItem = styled(SwiperSlide)`
  background-color: ${(props) => props.theme.backgroundColor} !important;

  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  img {
    object-fit: cover;
  }
`;

export default SitePromotion;
