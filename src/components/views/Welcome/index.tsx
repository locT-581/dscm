import { TypeAnimation } from "react-type-animation";

export default function Welcome({ onConnect }: { onConnect: (window: Window & typeof globalThis) => void }) {
  return (
    <div className="w-screen h-screen relative flex flex-col justify-end">
      <video
        src="/videos/welcome.mp4"
        autoPlay
        loop
        muted
        className="absolute inset-0 w-screen h-screen object-cover -z-[1]"
      ></video>

      <div className="flex flex-col items-center gap-5 h-1/2 w-full">
        <TypeAnimation
          sequence={["Hệ thống Quản lý chuỗi cung ứng bền vững phi tập trung", 3500, "Hệ thống ", 1600]}
          style={{ fontSize: "2.25em", textShadow: "4px 4px 12px rgba(0, 0, 0, 0.6)" }}
          repeat={Infinity}
          className="text-white text-4xl font-bold w-[45%] text-wrap mt-[5%] text-center drop-shadow-lg"
        />

        <button
          className="animate-slide-up bg-transparent border-[2px] border-white font-medium text-white px-4 py-2 rounded-full w-[20%] hover:bg-white hover:text-black transition-all"
          onClick={() => {
            onConnect(window);
          }}
        >
          Kết nối ví
        </button>
      </div>

      <div className="text-white text-sm absolute bottom-5 right-[2%] italic">
        Liên hệ với chúng tôi:
        <strong className="font-bold"> 0909090909</strong>
      </div>
    </div>
  );
}
