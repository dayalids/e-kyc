import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Textinput from '@/components/ui/Textinput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import Checkbox from '@/components/ui/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { handleRegister } from './_archived_store';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import '../../../app/scss/utility/_blockchainNodes.scss';
import { useMutation, useQuery } from 'graphql-hooks';
import { GET_ENTITY_INTEREST_BY_TOKEN } from '@/configs/graphql/queries';
import { SIGNUP_ENTITY_MUTATION } from '@/configs/graphql/mutations';

const schema = yup
  .object({
    name: yup.string().required('Entity name is Required'),
    address: yup.string().required('Address is Required'),
    pointOfContact: yup.object().shape({
      firstName: yup.string().required('First Name is Required'),
      lastName: yup.string().required('Last Name is Required'),
      mobile: yup.string().required('Mobile number is Required'),
    }),
    email: yup.string().email('Invalid email').required('Email is Required'),
    Password: yup
      .string()
      .min(6, 'Password must be at least 8 characters')
      .max(20, "Password shouldn't be more than 20 characters")
      .required('Please enter password'),
    ConfirmPassword: yup
      .string()
      .oneOf([yup.ref('Password'), null], 'Passwords must match'),
  })
  .required();

const Signupform = ({ token }) => {
  const [registerUser] = useMutation(SIGNUP_ENTITY_MUTATION);

  const { data, error } = useQuery(GET_ENTITY_INTEREST_BY_TOKEN, {
    variables: { token: token },
  });

  const [checked, setChecked] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const tokenData = data?.getEntityInterestByToken;

  useEffect(() => {
    reset(tokenData);
  }, [tokenData]);

  const onSubmit = async (reqData) => {
    try {
      console.log('reqData:', reqData, 'token:', token);
      const { data: apiData, error } = await registerUser({
        variables: {
          input: {
            address: reqData.address,
            email: reqData.email,
            entityName: reqData.name,
            firstName: reqData.pointOfContact.firstName,
            lastName: reqData.pointOfContact.lastName,
            mobile: reqData.pointOfContact.mobile,
            password: reqData.Password,
            token: token,
          },
        },
      });

      if (error) {
        throw new Error(error);
      }
      console.log('Entity registered succesfully', apiData);
      toast.success('Signup Sucessfull', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      reset();
    } catch (error) {
      toast.error('validation token does not exits', {
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
    <>
      <Card className="bg-white overflow-none shadow-none  ">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 ">
          <div className="frame w-[100%]">
            <Textinput
              className="text-black-500"
              name="name"
              label="Entity Name"
              type="text"
              placeholder="Name"
              register={register}
              error={errors?.name}
              autoComplete="off"
            />

            <Textinput
              className="text-black-500"
              name="address"
              label="Address"
              type="text"
              placeholder="address"
              register={register}
              error={errors?.address}
              autoComplete="off"
            />
            <Textinput
              className="text-black-500"
              name="pointOfContact.firstName"
              label="First Name"
              type="text"
              placeholder="Firstname"
              register={register}
              error={errors?.firstName}
              autoComplete="off"
            />
            <Textinput
              className="text-black-500"
              name="pointOfContact.lastName"
              label="Last Name"
              type="text"
              placeholder="last name"
              register={register}
              error={errors?.lastName}
              autoComplete="off"
            />
            <Textinput
              className="text-black-500"
              name="email"
              label="email"
              type="email"
              placeholder="Email"
              register={register}
              error={errors?.email}
              autoComplete="off"
            />

            <Textinput
              className="text-black-500"
              name="pointOfContact.mobile"
              label="Mobile"
              type=""
              placeholder="mobile"
              register={register}
              error={errors?.mobile}
              autoComplete="off"
            />
            <Textinput
              name="Password"
              label="Password"
              type="password"
              placeholder="Password"
              register={register}
              error={errors.Password}
              autoComplete="off"
              hasicon={true}
            />
            <Textinput
              name="ConfirmPassword"
              label="Confirm password"
              type="password"
              placeholder="Password"
              register={register}
              error={errors.ConfirmPassword}
              autoComplete="off"
              hasicon={true}
            />
          </div>
          <Checkbox
            label="You accept our Terms and Conditions and Privacy Policy"
            value={checked}
            onChange={() => setChecked(!checked)}
          />
          <button className="btn btn-dark block w-full text-white text-center">
            Signup
          </button>
        </form>
      </Card>
      <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 mt-12 uppercase text-sm">
        Have an account?{' '}
        <Link
          href="/auth/login"
          className="text-slate-900 dark:text-white font-medium hover:underline"
        >
          Login
        </Link>
      </div>
    </>
  );
};

export default Signupform;
