import FeaturesSection from "@/components/landingPage/FeaturesSection";
import Image from "next/image";
import Link from "next/link";
import FAQAccordion from "@/components/landingPage/FAQAccordian"
export default function App() {
  return (
    <div className="px-2.5 sm:px-3.5 md:px-5 lg:px-7 py-3 bg-transparent">
      <div className='flex flex-col sm:flex-row gap-3 px-1.5 w-full max-h-[90vh] items-center'>
        <div className="w-full md:w-[50%] flex justify-center items-center px-1 sm:px-2.5 md:px-4 lg:px-8">
          <div className="flex flex-col gap-1.5">
          {/* Hero Text */}
          <div className="flex flex-col items-start gap-2">
            <h1 className="lg:text-[50px] leading-tight md:text-[40px] text-wrap text-2xl text-white font-bold">Don&apos;t just track tasks - <br />Feel respnsive for them.</h1>
            <p className="text-gray-300 text-[18px] text-wrap">TaskMaa keeps you focused, driven,  and emotionally <br/>committed to your goals.</p>
          </div>
          {/* CTA Button */}
          <Link
            href='/login'
            className="text-[#69f5c5] mt-3 flex justify-center hover:scale-105 items-center text-[20px] text-wrap backdrop-blur-[10px] backdrop-filter bg-[rgba(255,253,253,0.2)] h-12 rounded-[10px] cursor-pointer w-[181px] border border-[rgba(255,250,250,0.24)] border-solid shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] hover:bg-[rgba(255,253,253,0.3)] transition-all duration-300"
          >
          Get Started
          </Link>
          </div>
        </div>
        <div className="flex items-center w-full md:w-[50%] justify-center">
          <Image src='/main_landing_page.png' alt="TaskMaa and you" width={550} height={550}/>
        </div>
      </div>
      <FeaturesSection/>
      <FAQAccordion/>
    </div>
  );
}