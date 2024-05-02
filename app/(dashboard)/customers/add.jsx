import React, { useCallback } from 'react';

import Modal from '@/components/ui/Modal';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import Select from 'react-select';

import { useMutation } from '@apollo/client';
import { INVITE_ADMIN_USER } from '@/graphql/mutations';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const schema = yup.object({
	firstname: yup.string().required('Firstname is Required'),
	lastname: yup.string().required('Lastname is Required'),
	email: yup
		.string()
		.email('Invalid email address')
		.required('Email is Required'),
	roleId: yup.string().required('Role is required')
});

const AddUsers = ({ isModalOpen, setIsModalOpen }) => {
	const [inviteUser] = useMutation(INVITE_ADMIN_USER);

	const {
		register,
		control,
		reset,
		clearErrors,
		formState: { errors },
		handleSubmit
	} = useForm({
		resolver: yupResolver(schema),
		mode: 'all'
	});

	const closeForm = () => {
		setIsModalOpen(false);
	};

	const onSubmit = async reqData => {
		try {
			const { data: mutationData, error } = await inviteUser({
				variables: {
					input: {
						firstName: reqData.firstname,
						lastName: reqData.lastname,
						email: reqData.email,
						roleId: reqData.roleId
					}
				}
			});
			if (error) {
				throw new Error(error);
			}
			toast.success('Invitation sent sucessfully');
			closeForm();
			reset();
		} catch (error) {
			console.log('Something went wrong in sending invite ', error);
			toast.error('Something went wrong!');
		}
	};
	const onError = err => {
		console.log('error from role add form->', err);
	};

	return (
		<div>
			{isModalOpen ? (
				<Modal
					activeModal={isModalOpen}
					onClose={closeForm}
					title='Add Customer'
					className='mt-[100px] pb-4 max-w-xl'>
					<form
						autoComplete='off'
						onSubmit={handleSubmit(onSubmit, onError)}>
						<Textinput
							name='firstname'
							label='First Name'
							type='text'
							placeholder='Enter first name'
							register={register}
							error={errors?.firstname}
							autoComplete='off'
							onClick={() => clearErrors()}
						/>
						<Textinput
							name='lastname'
							label='Last Name'
							type='text'
							placeholder='Enter last name'
							register={register}
							error={errors?.firstname}
							autoComplete='off'
							onClick={() => clearErrors()}
						/>

						<Textinput
							name='email'
							label='Email'
							type='text'
							placeholder='Enter User Email'
							register={register}
							error={errors?.email}
							autoComplete='off'
							onClick={() => clearErrors()}
						/>
						<Textinput
							name='mobile'
							label='Mobile'
							type='text'
							placeholder='Enter Mobile Number'
							register={register}
							error={errors?.email}
							autoComplete='off'
							onClick={() => clearErrors()}
						/>
						<Textinput
							name='gender'
							label='Gender'
							type='text'
							placeholder='Enter Gender'
							register={register}
							error={errors?.email}
							autoComplete='off'
							onClick={() => clearErrors()}
						/>
						<Textinput
							name='org'
							label='Organization'
							type='text'
							placeholder='Enter Mobile Number'
							register={register}
							error={errors?.email}
							autoComplete='off'
							onClick={() => clearErrors()}
						/>
						<Textinput
							name='dob'
							label='Date Of Birth'
							type='text'
							placeholder='Enter DOB'
							register={register}
							error={errors?.email}
							autoComplete='off'
							onClick={() => clearErrors()}
						/>

						<Button
							type='submit'
							className='block mt-8 mb-4 w-full text-center text-white btn btn-dark'>
							Create Customer
						</Button>
					</form>
				</Modal>
			) : null}
		</div>
	);
};

export default AddUsers;
