import React from 'react';

import Modal from '@/components/ui/Modal';
// form handlers
import { useForm, Controller, set } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Textinput from '@/components/ui/Textinput';
import Select from 'react-select';
import Button from '@/components/ui/Button';

import { metakeepCreateTransaction } from '../_lib/metakeepCreateTransaction';
import { TRANSFER_ASSET } from '@/configs/graphql/mutations';
import { useMutation } from 'graphql-hooks';
import { toast } from 'react-toastify';

const schema = yup.object({
	sendFrom: yup.string().required('Address is Required'),
	sendTo: yup.string().required('Sender Address is Required'),
	// asset: yup.string().required('Please select the Asset'),
	amount: yup.number().required('Amount is Required')
});

const SendModal = ({ isOpen, setIsOpen, env, walletAddress }) => {
	const [transferAssetsMutation] = useMutation(TRANSFER_ASSET);
	const [transactionRunning, setTransactionRunning] =
		React.useState(false);
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
	const onSubmit = async reqData => {
		try {
			setTransactionRunning(true);
			// console.log('reqData', reqData);
			const transactionResult = await metakeepCreateTransaction(
				reqData,
				env
			);
			if (!transactionResult.transactionHash) {
				// console.log('Transaction Result:', transactionResult);
				toast.error('Transaction Failed: no transaction hash');
				return closeForm();
			}
			const { mutationData, transferError } =
				await transferAssetsMutation({
					variables: {
						input: {
							from: transactionResult.from,
							to: transactionResult.to,
							amount: reqData.amount,
							token: 'BBN',
							txnHash: transactionResult.transactionHash,
							coin: {
								currency: 'BBN',
								symbol: 'BBN'
							}
						}
					},
					refetchQueries: []
				});
			if (transferError) {
				setTransactionRunning(false);
				toast.error('failed to update the transfer');
				return closeForm();
			}
			// console.log('mutationData', mutationData);
			setTransactionRunning(false);
			closeForm();
			toast.success('Transaction Successful');
		} catch (error) {
			console.error('Error in transfer:', error);
		}
	};
	const closeForm = () => {
		setIsOpen(false);
		setTransactionRunning(false);
		reset();
	};
	const addressOptions = [
		{
			value: walletAddress,
			label: walletAddress
		}
	];
	const assetOptions = [
		{
			value: 'BBN',
			label: 'BBN'
		},
		{
			value: 'ETH',
			label: 'ETH'
		},
		{
			value: 'BTC',
			label: 'BTC'
		},
		{
			value: 'USDT',
			label: 'USDT'
		}
	];
	return (
		<Modal
			activeModal={isOpen}
			onClose={closeForm}
			title='Send BBN'
			className='max-w-xl pb-4 mt-[100px]'>
			<form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
				<Controller
					name='sendFrom'
					control={control}
					defaultValue={addressOptions[0].value}
					render={({ field: { onChange, value } }) => (
						<div className='mb-4'>
							<label className='form-label' htmlFor='icon_s'>
								Send From
							</label>
							<Select
								options={addressOptions}
								value={addressOptions.find(c => c.value === value)}
								onChange={val => onChange(val.value)}
								isMulti={false}
								className='react-select '
								classNamePrefix='select'
								id='icon_s'
								placeholder={'Select Status'}
							/>
							{errors.sendFrom && (
								<p className='text-red-500'>
									{errors.sendFrom.message}
								</p>
							)}
							{/* Display error message */}
						</div>
					)}
				/>
				<Textinput
					className='pt-3'
					label='Send To'
					placeholder='Enter Address'
					type={'text'}
					register={register}
					name={'sendTo'}
				/>
				{errors.sendTo && (
					<p className='text-red-500 -mt-4'>
						{errors.sendTo.message}
					</p>
				)}
				{/* <Controller
					name='asset'
					control={control}
					render={({ field: { onChange, value } }) => (
						<div className=''>
							<label className='form-label' htmlFor='icon_s'>
								Asset
							</label>
							<Select
								options={assetOptions}
								value={assetOptions.find(c => c.value === value)}
								onChange={val => onChange(val.value)}
								isMulti={false}
								className='react-select mb-2'
								classNamePrefix='select'
								defaultValue={0}
								id='icon_s'
								placeholder={'Select Status'}
							/>
							{errors.asset && (
								<p className='text-red-500 -mt-2'>
									{errors.asset.message}
								</p>
							)}
							
						</div>
					)}
				/> */}

				<Textinput
					label='Amount'
					name='amount'
					placeholder='Enter Address'
					register={register}
					type={'text'}
					defaultValue={0}
					// defaultValue={0}
					error={errors.amount?.message}
				/>
				{errors.amount && (
					<p className='text-red-500'>{errors.amount.message}</p>
				)}
				<Button
					isLoading={transactionRunning}
					type='submit'
					className='block text-white w-full text-center mt-4  btn btn-dark'>
					Submit
				</Button>
			</form>
		</Modal>
	);
};

export default SendModal;
