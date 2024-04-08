import React, { useContext, useEffect, useState } from 'react';
import Textinput from '@/components/ui/Textinput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import Checkbox from '@/components/ui/Checkbox';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { AUTH_USER } from '@/graphql/mutations';
import { handleLogin } from '@/store/authReducer';
import getDefaultRole from '@/lib/getDefaultRole';

const schema = yup
	.object({
		email: yup
			.string()
			.email('Invalid email')
			.required('Email is Required'),
		password: yup.string().required('Password is Required')
	})
	.required();
const LoginForm = () => {
	// const client = useContext(ClientContext);
	const [authUser] = useMutation(AUTH_USER);
	const dispatch = useDispatch();

	const {
		register,
		formState: { errors },
		handleSubmit
	} = useForm({
		resolver: yupResolver(schema),
		//
		mode: 'all'
	});

	const router = useRouter();

	const onSubmit = async data => {
		try {
			// call api and get data
			const { data: apiData } = await authUser({
				variables: {
					email: data.email,
					password: data.password
				}
			});

			const defaultRole = getDefaultRole(apiData.loginUser.userRoles);
			// dispatch the handle login the data for profile
			localStorage.setItem('authToken', apiData.loginUser.token);
			localStorage.setItem('userRole', defaultRole);
			localStorage.setItem('userId', apiData.loginUser.userId);
			dispatch(
				handleLogin({
					_id: apiData.loginUser.userId,
					firstName: apiData.loginUser.firstName,
					lastName: apiData.loginUser.lastName,
					userRoles: apiData.loginUser.userRoles,
					defaultRole: defaultRole,
					token: apiData.loginUser.token
				})
			);
			toast.success('Login Successful');

			router.push(`/`);
		} catch (error) {
			console.log({ error });
			toast.error(error.message, {
				position: 'top-right',
				autoClose: 1500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'light'
			});
		}
	};

	const [checked, setChecked] = useState(false);

	return (
		<form
			autoComplete='off'
			onSubmit={handleSubmit(onSubmit)}
			className='space-y-4 w-[100%] p-5 '>
			<Textinput
				className='text-black-500'
				name='email'
				label='email'
				type='email'
				placeholder='Email'
				register={register}
				error={errors?.email}
				autoComplete='off'
			/>
			<Textinput
				name='password'
				label='password'
				type='password'
				placeholder='Password'
				register={register}
				error={errors.password}
				autoComplete='off'
				hasicon={true}
			/>
			<div className='flex justify-between'>
				<Checkbox
					value={checked}
					onChange={() => setChecked(!checked)}
					label='Keep me signed in'
				/>
				<Link
					href='/auth/forgot-password'
					className='text-sm text-black-500 dark:text-slate-400 leading-6 font-medium'>
					Forgot Password?
				</Link>
			</div>

			<button className='btn btn-dark block w-full text-center'>
				Sign in
			</button>
		</form>
	);
};

export default LoginForm;
