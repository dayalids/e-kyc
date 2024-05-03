import React, { use } from 'react';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Textarea from '@/components/ui/Textarea';
import { Controller, useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import Select from 'react-select';
import { useMutation } from '@apollo/client';
import { CREATE_CONCENT } from '@/graphql/mutations';
import { UPDATE_CONCENT } from '@/graphql/mutations';
import { selectUser } from '@/store/userReducer';
import { useSelector } from 'react-redux';
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

	const { user } = useSelector(selectUser);
	const [createConcent] = useMutation(CREATE_CONCENT);
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

	const handleConcent = async reqData => {
		console.log("Inside Edit Submit Button from Roles", data);
		
		const { inputValues: apiData, error } = await createConcent({
		  variables: {
				input: {
		    user: data._id,
		    status: 2
		  }
		}
		});
		if (error) {
		  console.log(error);
		  throw new Error(error.graphQLErrors[0].message);

		}


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
					
						<p className='my-8 text-center'>
							Do you want to send this user concent request?
						</p>

						<div className='flex justify-center items-center space-x-2 w-full'>
							<Button
								className='bg-red-400 mb-3 py-2 text-white btn'
								onClick={() => {closeForm()}}>
								Cancel
							</Button>
							<Button
								className='mb-3 py-2 text-white btn btn-dark'
								onClick={handleConcent}
								type='submit'>
								Confirm
							</Button>
						</div>
					
				</Modal>
			) : null}
		</div>
	);
};

export default SendConcentModal;
