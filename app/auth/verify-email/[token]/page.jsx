'use client';
import Link from 'next/link';
import useDarkMode from '@/hooks/useDarkMode';
import { useState } from 'react';
import { useQuery } from 'graphql-hooks';
import { VERIFY_ENTITY_USER } from '@/configs/graphql/queries';
import Loading from '@/components/Loading';
import CopyrightFooter from '@/components/features/copyright';
import { toast } from 'react-toastify';
const VerifyLogin = ({ params }) => {
  const token = params?.token;

  const [isDark] = useDarkMode();
  const [isVerified, setIsverified] = useState(false);

  const { data, error, loading } = useQuery(VERIFY_ENTITY_USER, {
    variables: { token: token },
    skip: !token,
    onSuccess: (res) => {
      setIsverified(true);
      toast.success('Email Verified!');
    },
  });

  if (error) {
    console.log(error, 'verifyerror');
    // toast.error(error.graphQLErrors[0].message);
    toast.error('Token does not exists..');
  }

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
                {loading ? (
                  <Loading />
                ) : isVerified ? (
                  <div className="text-center  2xl:mb-4 mb-4">
                    <span className="font-medium text-4xl text-green-600">
                      Congratulations!🎉
                    </span>
                    <p className="text-slate-500 text-base">
                      Email is Verified successfully.
                    </p>
                    <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 mt-12 uppercase text-sm">
                      <Link
                        href="/auth/login"
                        className="text-slate-900 dark:text-white font-medium hover:underline"
                      >
                        Login
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center  2xl:mb-4 mb-4">
                    <span className="font-medium text-4xl text-red-500">
                      Failed Verification!
                    </span>
                    <p className="text-slate-500 text-base">
                      Token is Invalid please try again.
                    </p>
                    {/* <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 mt-12 uppercase text-sm">
                      <Link
                        href="/auth/login"
                        className="text-slate-900 dark:text-white font-medium hover:underline"
                      >
                        Login
                      </Link>
                    </div> */}
                  </div>
                )}
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

export default VerifyLogin;
