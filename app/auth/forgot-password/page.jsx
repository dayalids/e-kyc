"use client";

import React from "react";
import Link from "next/link";
import ForgotPass from "@/components/partials/auth/forgot-pass";
import useDarkMode from "@/hooks/useDarkMode";
import CopyrightFooter from "@/components/features/copyright"
const ForgotPassPage = () => {
  const [isDark] = useDarkMode();
  return (
    <div className="loginwrapper">
      <div className="lg-inner-column">
        <div className="left-column relative z-[1]">
        <div className="max-w-[250px]  rtl:pr-20">
              <Link href="/">
                <img
                  src={
                    isDark
                      ? "/assets/images/logo/BBN_Logo/Main/PNG/Main_Landscape.png"
                      : "/assets/images/logo/BBN_Logo/Main/PNG/Main_Landscape.png"
                  }
                  alt=""
                  className="mb-10"
                />
              </Link>
      
            </div>
          <div className="absolute left-0 top-0 bottom-[-130px] h-full w-full z-[-1]">
            <img
              src="/assets/images/auth/map_light.png"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="max-w-[240px] absolute bottom-8 pl-8">
                <Link href="/">
                  <img
                    src={
                      isDark
                        ? "/assets/images/auth/ids-logo.png"
                        : "/assets/images/auth/ids-logo.png"
                    }
                    alt=""
                  />
                </Link>
              </div>
              <div className="max-w-[180px] absolute bottom-10 right-0 pr-8">
                <Link href="/">
                  <img
                    src={
                      isDark
                        ? "/assets/images/auth/aicte-logo.png"
                        : "/assets/images/auth/aicte-logo.png"
                    }
                    alt=""
                  />
                </Link>
              </div>
        </div>
        <div className="right-column relative">
          <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
            <div className="auth-box2 flex flex-col justify-center h-full">
              <div className="mobile-logo text-center mb-6 lg:hidden block">
                <Link href="/">
                  <img
                    src={
                      isDark
                        ? "/assets/images/logo/BBN_Logo/Main/PNG/Main_Landscape.png"
                        : "/assets/images/logo/BBN_Logo/Main/PNG/Main_Landscape.png"
                    }
                    alt=""
                    className="mx-auto max-w-[250px]"
                  />
                </Link>
              </div>
              <div className="text-center 2xl:mb-10 mb-5">
                <h4 className="font-medium mb-4">Forgot Your Password?</h4>
              </div>
              <div className="font-normal text-base text-slate-500 dark:text-slate-400 text-center px-2 bg-slate-100 dark:bg-slate-600 rounded py-3 mb-4 mt-10">
                Enter your Email and instructions will be sent to you!
              </div>

              <ForgotPass />
              <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 2xl:mt-12 mt-8 uppercase text-sm">
                Forget It,
                <Link
                  href="/"
                  className="text-slate-900 dark:text-white font-medium hover:underline"
                >
                  Send me Back
                </Link>
                to The Sign In
              </div>
            </div>
            <div className="auth-footer text-center">
              <CopyrightFooter/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassPage;
