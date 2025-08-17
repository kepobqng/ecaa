import SplitText from "./components/SplitText/SplitText";
import TextType from "./components/TextType/TextType";
import Link from "next/link";
import BlurText from "./components/BlurText/BlurText";
import LightRays from "./components/LightRays/LightRays";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 sm:p-6 md:p-8 lg:p-10 relative overflow-hidden">
      {/* LightRays positioned to illuminate the text */}
      <div className="absolute inset-0 pointer-events-none">
        <LightRays
          raysOrigin="top-center"
          raysColor="#fffff"
          raysSpeed={1.2}
          lightSpread={0.8}
          rayLength={5}
          followMouse={true}
          mouseInfluence={0.2}
          noiseAmount={0.02}
          distortion={0.02}
          className="custom-rays"
          fadeDistance={1.2}
        />
      </div>

      {/* Content with z-index to appear above light rays */}
      <div className="relative z-10 flex flex-col justify-center items-center">
        <SplitText
          text="Hallo, Ecaa <3"
          className="text-5xl sm:text-xl md:text-2xl lg:text-3xl font-semibold text-center px-4 sm:px-6 md:px-8 mb-6 text-white drop-shadow-lg"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />

        {/* Card Container */}
        <div className="w-full max-w-4xl mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02]">
            <div className="text-center">
              <BlurText
                text="Semangat ya kuliahnya! Awalnya mungkin   terasa berat,tapi percayalah kamu pasti bisa Nikmati setiap prosesnya, jangan lupa berdoa dalam setiap langkah, dan selalu bersyukur. Kalau ada kesulitan, jangan sungkan untuk cerita atau nanya ke aku yaa."
                delay={30}
                animateBy="letters"
                direction="top"
                className="text-base sm:text-lg text-gray-100 leading-relaxed font-medium tracking-wide"
              />
            </div>
          </div>
        </div>

        {/* Menu Bar */}
        <div className="mt-8 w-full max-w-md">
          <div>
            <div className="flex justify-center">
              <Link
                href="/next-page"
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-center backdrop-blur-sm bg-opacity-80 hover:shadow-cyan-400/50"
                title="Gallery"
              >
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
                </svg>
                <p className="text-sm ml-2 font-semibold">Gallery</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
