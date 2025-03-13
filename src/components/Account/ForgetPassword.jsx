import { Link } from "react-router-dom";

export const ForgetPassword = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-white px-8">
            <h1 className="font-bold text-center text-[48px] lg:text-[72px]" style={{ fontFamily: "B" }}>So Sad...</h1>
            <p className="text-[20px] lg:text-[24px] text-center text-secondary-color">問君密碼化烏有，恰似一江春水向東流。<br className="hidden sm:inline" />再註冊一次吧 ~</p>
            <Link
                className="mt-10 primary-button sm:mt-12 bg-primary-color text-lg sm:text-xl px-[1.2em] sm:px-[1.5em] py-[0.5em] sm:py-[0.6em] rounded-full transition-all duration-300"
                to="/register"
            >
                註冊去 QQ
            </Link>
        </div>
    );
}