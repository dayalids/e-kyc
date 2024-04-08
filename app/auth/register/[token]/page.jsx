'use client';
import Link from 'next/link';
import useDarkMode from '@/hooks/useDarkMode';
import Signupform from '../../../../components/partials/auth/signup-form';
import CopyrightFooter from "@/components/features/copyright"
// image import

const Login = ({ params }) => {
  const [isDark] = useDarkMode();

  return (
    <>
      <div className="loginwrapper">
        <div className="lg-inner-column ">
          <div className="left-column relative z-[1]">
            <div className="max-w-[250px]  rtl:pr-20">
              <Link href="/">
                <img
                  src={
                    isDark
                      ? '/assets/images/logo/BBN_Logo/Main/PNG/Main_Landscape.png'
                      : '/assets/images/logo/BBN_Logo/Main/PNG/Main_Landscape.png'
                  }
                  alt=""
                  className="mb-10"
                />
              </Link>
            </div>
            <div className="absolute left-0 top-0 2xl:bottom-[-160px] bottom-[-130px] h-full w-full z-[-1]">
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
                      ? '/assets/images/auth/ids-logo.png'
                      : '/assets/images/auth/ids-logo.png'
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
                      ? '/assets/images/auth/aicte-logo.png'
                      : '/assets/images/auth/aicte-logo.png'
                  }
                  alt=""
                />
              </Link>
            </div>
          </div>
          <div className="right-column relative">
            <div className="inner-content h-full  flex flex-col bg-white dark:bg-slate-800">
              <div className="auth-box h-[90%]  flex flex-col justify-center m-0 p-[1.75rem] max-w-[100%]">
                <div className="mobile-logo text-center  mb-6 lg:hidden block">
                  <Link href="/">
                    <img
                      src={
                        isDark
                          ? '/assets/images/logo/BBN_Logo/Main/PNG/Main_Landscape.png'
                          : '/assets/images/logo/BBN_Logo/Main/PNG/Main_Landscape.png'
                      }
                      alt=""
                      className="mx-auto max-w-[250px]"
                    />
                  </Link>
                </div>
                <div className="text-center  2xl:mb-4 my-4">
                  <h4 className="font-medium">
                    Get Started with Bharat Blockchain Network
                  </h4>
                </div>
                <Signupform token={params?.token} />
              </div>

              <div className="auth-footer text-center">
                <CopyrightFooter />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
