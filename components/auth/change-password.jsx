'use client';
import React, { useCallback } from 'react';
import Textinput from '@/components/ui/Textinput';
import Button from '@/components/ui/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMutation } from 'graphql-hooks';
import { CHANGE_PASSWORD } from '@/configs/graphql/mutations';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { handleLogout } from '@/store/authReducer';

const schema = yup
  .object({
    currentpassword: yup.string().required('Current Password is Required'),
    newpassword: yup.string().required('Password is Required'),
    confirmpassword: yup
      .string()
      .required('Password is Required')
      .oneOf([yup.ref('newpassword')], 'Passwords do not match'),
  })
  .required();

const ChangePasswordForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [changePassword] = useMutation(CHANGE_PASSWORD);
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const onSubmit = async (reqData) => {
    try {
      const { data: apiData, error } = await changePassword({
        variables: {
          input: {
            _id: user?._id,
            currentPassword: reqData.currentpassword,
            newPassword: reqData.newpassword,
          },
        },
      });

      if (error) {
        toast.error(error.graphQLErrors[0].message, {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      } else {
        toast.success('Password changed successfully ', {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        localStorage.removeItem('authToken');
        dispatch(handleLogout());
        router.push('/auth/login');
      }
    } catch (error) {
      toast.error('Something went wrong try later', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };
  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <div className=" h- grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-x-8 xl:gap-x-28 gap-y-4 py-10 px-2 md:px-20 rounded-lg bg-white dark:bg-slate-800 ">
        <div>
          <InputField
            fieldName={'currentpassword'}
            label={'Current Password'}
            register={register}
            error={errors?.currentPassword}
            placeholder={'Enter Current password'}
          />
        </div>
        <div>
          <InputField
            fieldName={'newpassword'}
            label={'New Password'}
            register={register}
            error={errors?.newpassword}
            placeholder={'Enter new password'}
            description={'Password must at least of 8 digits'}
          />
        </div>
        <div>
          <InputField
            fieldName={'confirmpassword'}
            label={'Confirm New Password'}
            register={register}
            error={errors?.confirmpassword}
            placeholder={'Confirm new password'}
            description={'Password must at least of 8 digits'}
          />
        </div>
        {/* <div></div> */}
        <div className="w-full flex justify-between sm:mt-10">
          <Button
            type="submit"
            text="Confirm"
            className="bg-black-500 text-white w-fit md:w-30 xl:w-40  h-10 items-center py-6 px-10 "
          />
          <Button
            type="submit"
            text="Cancel"
            className="hover:bg-danger-500  hover:text-white border-[1px] text-black-400 border-black-400 w-fit md:w-30  xl:w-40 h-10 items-center py-6 px-10 "
            onClick={() => router.back()}
          />
        </div>
      </div>
    </form>
  );
};

export default ChangePasswordForm;

const InputField = ({
  fieldName,
  label,
  value,
  register,
  error,
  description,
  placeholder,
}) => (
  <div>
    <Textinput
      name={fieldName}
      label={label}
      defaultValue={value}
      placeholder={placeholder}
      description={description}
      type="password"
      register={register}
      hasicon={true}
      error={error}
      autoComplete="off"
      className="bg-slate-100 py-4 px-6 border-none rounded-lg font-serif text-lg "
      classDescription="text-lg"
    />
  </div>
);
