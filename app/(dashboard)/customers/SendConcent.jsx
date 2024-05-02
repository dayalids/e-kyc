import React from 'react';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Textarea from '@/components/ui/Textarea';
import { Controller, useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import Select from 'react-select';
const schema = yup
	.object({
		name: yup.string().required('Name is Required'),
		description: yup.string().required('description is Required'),
		type: yup.string().required(),
		status: yup.number().required()
	})
	.required();

const SendConcentModal = ({
	isUserModalOpen,
	setIsUserModalOpen,
	data
}) => {
	const [selectedOpt, setOption] = useState();
	// console.log("data++++", data);

	const {
		register,
		control,
		reset,
		formState: { errors },
		handleSubmit
	} = useForm({
		resolver: yupResolver(schema),
		mode: 'all'
	});

	const closeForm = () => {
		setIsUserModalOpen(false);
		reset();
	};

	const onSubmit = async reqData => {
		// console.log("Inside Edit Submit Button from Roles", reqData);
		// const [createAvenueTypes] = useMutation(CREATE_AVENUE_TYPES);
		// const { inputValues: apiData, error } = await createAvenueTypes({
		//   variables: {
		//     name: inputValues.name,
		//     description: inputValues.description,
		//     status: inputValues.status
		//   }
		// });
		// if (error) {
		//   console.log(error);
		//   throw new Error(error.graphQLErrors[0].message);

		// }
		// console.log('Modal Add:', apiData);
		// console.log(inputValues);
		closeForm();
		reset();
	};

	return (
		<div>
			{isUserModalOpen ? (
				<Modal
					activeModal={isUserModalOpen}
					onClose={closeForm}
					title='Concent Request'
					className='mt-[100px] pb-4 max-w-xl'
					// themeClass="bg-[#4CA1EF] dark:border-b dark:border-slate-700"
				>
					<form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
						<p className='my-8 text-center'>
							Do you want to send this user concent request?
						</p>

						<div className='flex justify-center items-center space-x-2 w-full'>
							<Button
								className='bg-red-400 mb-3 py-2 text-white btn'
								onClick={() => {}}>
								Cancel
							</Button>
							<Button
								className='mb-3 py-2 text-white btn btn-dark'
								type='submit'>
								Confirm
							</Button>
						</div>
					</form>
				</Modal>
			) : null}
		</div>
	);
};

export default SendConcentModal;
