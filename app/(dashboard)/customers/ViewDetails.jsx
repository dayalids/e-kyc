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

const ViewDetailsModal = ({
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
					title='Customer Details'
					className='mt-[100px] pb-4 max-w-xl'
					// themeClass="bg-[#4CA1EF] dark:border-b dark:border-slate-700"
				>
					{data.kycConcent ? (
						<table className='mx-auto my-8 text-center'>
							<tbody>
								<tr>
									<th
										style={{
											textAlign: 'left',
											paddingRight: '10px'
										}}>
										Name:
									</th>
									<td
										style={{
											textAlign: 'left',
											paddingRight: '10px'
										}}>
										{data.firstName} {data.lastName}
									</td>
								</tr>
								<tr>
									<th
										style={{
											textAlign: 'left',
											paddingRight: '10px'
										}}>
										Email:
									</th>
									<td
										style={{
											textAlign: 'left',
											paddingRight: '10px'
										}}>
										{data.email}
									</td>
								</tr>
								<tr>
									<th
										style={{
											textAlign: 'left',
											paddingRight: '10px'
										}}>
										Mobile:
									</th>
									<td
										style={{
											textAlign: 'left',
											paddingRight: '10px'
										}}>
										{data.mobile}
									</td>
								</tr>
								<tr>
									<th
										style={{
											textAlign: 'left',
											paddingRight: '10px'
										}}>
										DOB:
									</th>
									<td
										style={{
											textAlign: 'left',
											paddingRight: '10px'
										}}>
										{data.dob}
									</td>
								</tr>
								<tr>
									<th
										style={{
											textAlign: 'left',
											paddingRight: '10px'
										}}>
										Gender:
									</th>
									<td
										style={{
											textAlign: 'left',
											paddingRight: '10px'
										}}>
										{data.gender}
									</td>
								</tr>
								<tr>
									<th
										style={{
											textAlign: 'left',
											paddingRight: '10px'
										}}>
										Customer ID:
									</th>
									<td
										style={{
											textAlign: 'left',
											paddingRight: '10px'
										}}>
										{data.customerID}
									</td>
								</tr>
							</tbody>
						</table>
					) : (
						<div className='text-center'>
							Please request for the concent, to see the full details
						</div>
					)}
				</Modal>
			) : null}
		</div>
	);
};

export default ViewDetailsModal;
