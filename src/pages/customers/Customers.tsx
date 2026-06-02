import { CUSTOMERS } from "@/constants/global"
import { useSignals } from "@preact/signals-react/runtime"
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import PageLayout from "@/components/PageLayout"
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/navigation"
import "swiper/css/pagination"

function Customers() {
  useSignals()

  return (
    <PageLayout
      title="customersTitle"
      subtitle="customersSubtitle"
      badge="customersBadge"
    >
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 0,
          stretch: 80,
          depth: 200,
          modifier: 1,
          slideShadows: false,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        loop={true}
        modules={[EffectCoverflow, Autoplay, Pagination]}
        className={`pt-10 pb-16 [&_.swiper-button-next]:h-[50px] [&_.swiper-button-next]:w-[50px] [&_.swiper-button-next]:rounded-full [&_.swiper-button-next]:border [&_.swiper-button-next]:border-main/30 [&_.swiper-button-next]:bg-main/20 [&_.swiper-button-next]:text-main [&_.swiper-button-next]:backdrop-blur-lg [&_.swiper-button-next]:transition-all [&_.swiper-button-next]:duration-300 [&_.swiper-button-next]:hover:scale-110 [&_.swiper-button-next]:hover:border-main [&_.swiper-button-next]:hover:bg-main/40 [&_.swiper-button-next]:hover:text-main [&_.swiper-button-next::after]:text-xl [&_.swiper-button-next::after]:font-bold [&_.swiper-button-prev]:h-[50px] [&_.swiper-button-prev]:w-[50px] [&_.swiper-button-prev]:rounded-full [&_.swiper-button-prev]:border [&_.swiper-button-prev]:border-main/30 [&_.swiper-button-prev]:bg-main/20 [&_.swiper-button-prev]:text-main [&_.swiper-button-prev]:backdrop-blur-lg [&_.swiper-button-prev]:transition-all [&_.swiper-button-prev]:duration-300 [&_.swiper-button-prev]:hover:scale-110 [&_.swiper-button-prev]:hover:border-main [&_.swiper-button-prev]:hover:bg-main/40 [&_.swiper-button-prev]:hover:text-main [&_.swiper-button-prev::after]:text-xl [&_.swiper-button-prev::after]:font-bold [&_.swiper-pagination-bullet]:bg-main [&_.swiper-pagination-bullet]:opacity-50 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet]:duration-300 [&_.swiper-pagination-bullet-active]:w-6! [&_.swiper-pagination-bullet-active]:rounded-sm! [&_.swiper-pagination-bullet-active]:bg-linear-to-br! [&_.swiper-pagination-bullet-active]:from-main! [&_.swiper-pagination-bullet-active]:to-main/70! [&_.swiper-pagination-bullet-active]:opacity-100! [&_.swiper-slide-active_.group>div]:animate-[float_3s_ease-in-out_infinite]`}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 30 },
          1024: { slidesPerView: 3, spaceBetween: 40 },
        }}
      >
        {CUSTOMERS.map((customer, index) => (
          <SwiperSlide key={customer} className="group">
            <div className="relative mx-auto flex h-[200px] w-[200px] items-center justify-center">
              <div
                className="animate-spin-slow absolute inset-0 rounded-lg bg-linear-to-r from-main via-purple-500 to-main"
                style={{ padding: "3px" }}
              >
                <div className="absolute inset-0 rounded-lg bg-white" />
              </div>
              <div className="absolute inset-1 rounded-lg border-2 border-main/30" />
              <img
                src={customer}
                alt={`customer ${index + 1}`}
                className="relative z-10 h-full w-full object-contain p-6 transition-all duration-300 group-hover:scale-110"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </PageLayout>
  )
}

export default Customers
