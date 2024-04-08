"use client";
import React from 'react';
import ChangePasswordForm from '@/components/partials/auth/change-password';
import { useSelector } from 'react-redux';
import { useQuery } from 'graphql-hooks';
import { GET_OBJECT_QUERY } from '@/configs/graphql/queries';

const ChangePassword = () => {
  const { user } = useSelector((state) => state.auth);
  const { data } = useQuery(GET_OBJECT_QUERY, {
    variables: {
      key: user?.profilePic,
    },
    skip: !user?.profilePic,
  });
  const ProfileUrl = data?.getObject?.url;

  return (
    <div>
      <div className="space-y-5 profile-page pb-20">
        <div className="profile-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
          <div className="bg-black-500 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div>
          <div className="profile-box flex-none md:text-start text-center">
            <div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
              <div className="flex-none">
                <div className="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 object-cover rounded-full ring-4 ring-slate-100 relative  bg-black-900">
                  <img
                    src={ProfileUrl}
                    alt="Pofile pic"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="flex-1 mb-10">
                <div className="text-2xl font-medium text-slate-900 dark:text-slate-200">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm font-light text-slate-600 dark:text-slate-400">
                  {user.defaultRole}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePassword;