// import React from 'react';
// import Modal from '@/components/ui/Modal';
// import { useMutation } from 'graphql-hooks';
// import { yupResolver } from '@hookform/resolvers/yup';
// // import { CREATE_ENTITY_TYPE } from '@/configs/graphql/mutations';
// import * as yup from 'yup';
// import Textarea from '@/components/ui/Textarea';
// import { Controller, useForm } from 'react-hook-form';
// import Textinput from '@/components/ui/Textinput';
// import Select from 'react-select';
// import Button from '@/components/ui/Button';

// const schema = yup
// 	.object({
// 		name: yup.string().required('Name is Required'),
// 		description: yup.string().required('description is Required'),
// 		entityId: yup.string().required('Entity ID is Required'),
// 		status: yup.number().required(),
// 	})
// 	.required();
// const Add = ({ isModalOpen, setIsModalOpen }) => {
// 	// const [createEntityType] = useMutation(CREATE_ENTITY_TYPE);

// 	const {
// 		register,
// 		control,
// 		reset,
// 		formState: { errors },
// 		handleSubmit,
// 	} = useForm({
// 		resolver: yupResolver(schema),
// 		mode: 'all',
// 	});

// 	const options = [
// 		{
// 			value: 1,
// 			label: 'Active',
// 		},
// 		{
// 			value: 0,
// 			label: 'InActive',
// 		},
// 	];

// 	const closeForm = () => {
// 		setIsModalOpen(false);
// 	};

// 	const onSubmit = async data => {
// 		console.log('Inside Add from Submit Button from enitity', data);
// 		// const { inputValues: apiData, error } = await createEntityType({
// 		// 	variables: {
// 		// 		input: {
// 		// 			name: data.name,
// 		// 			description: data.description,
// 		// 			status: data.status,
// 		// 			entityId: data.entityId,
// 		// 		},
// 		// 	},
// 		// });
// 		// if (error) {
// 		// 	console.log('error', error);
// 		// 	console.log(error);
// 		// 	// throw new Error(error.graphQLErrors[0].message);
// 		// }
// 		closeForm();
// 		reset();
// 	};
// 	const onerror = err => {
// 		console.log(err);
// 	};

// 	return (
// 		<div>
// 			{isModalOpen ? (
// 				<Modal
// 					activeModal={isModalOpen}
// 					onClose={closeForm}
// 					title='Add Entity'
// 					className='max-w-xl pb-4 '>
// 					<form
// 						autoComplete='off'
// 						onSubmit={handleSubmit(onSubmit, onerror)}>
// 						<Textinput
// 							name='name'
// 							label='Name'
// 							placeholder='Enter Name'
// 							type='text'
// 							register={register}
// 							error={errors?.name}
// 							autoComplete='off'
// 						/>
// 						<Textinput
// 							name='entityId'
// 							label='Entity Id'
// 							placeholder='Enter Entity Id'
// 							type='text'
// 							register={register}
// 							error={errors?.abilityId}
// 							autoComplete='off'
// 						/>

// 						<Controller
// 							name='status'
// 							control={control}
// 							render={({ field: { onChange, value } }) => (
// 								<div className='mt-3'>
// 									<label className='form-label' htmlFor='icon_s'>
// 										Status
// 									</label>
// 									<Select
// 										options={options}
// 										value={options.find(c => c.value === value)}
// 										onChange={val => onChange(val.value)}
// 										// styles={styles}
// 										isMulti={false}
// 										className='react-select'
// 										classNamePrefix='select'
// 										defaultValue={0}
// 										id='icon_s'
// 										placeholder={'Select Status'}
// 									/>
// 								</div>
// 							)}
// 						/>
// 						<Textarea
// 							name='description'
// 							label='description'
// 							placeholder='Enter Description'
// 							type='text'
// 							register={register}
// 							error={errors?.description}
// 							autoComplete='off'
// 						/>

// 						<Button
// 							type='submit'
// 							className='btn btn-dark block w-full text-center mt-4'>
// 							Submit
// 						</Button>
// 					</form>
// 				</Modal>
// 			) : null}
// 		</div>
// 	);
// };

// export default Add;
