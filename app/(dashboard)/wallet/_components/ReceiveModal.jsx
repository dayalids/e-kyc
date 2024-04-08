import Modal from '@/components/ui/Modal';
import React from 'react';

import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import Select from 'react-select';

import QRcode from './QRcode';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/components/ui/Button';
import copyText from '@/lib/copyText';
import { toast } from 'react-toastify';

const schema = yup.object({
	address: yup.string().required('Address is Required')
});

const ReceiveModal = ({ isOpen, setIsOpen, env, walletAddress }) => {
	const closeForm = () => {
		setIsOpen(false);
	};

	const addressOptions = [
		{
			value: walletAddress,
			label: walletAddress
		}
	];

	const [selectedAddress, setSelectedAddress] = React.useState('');
	const handleClick = () => {
		copyText(selectedAddress);
		toast.success('Copied to clipboard');
		closeForm();
	};

	return (
		<Modal
			activeModal={isOpen}
			onClose={closeForm}
			title='Receive BBN'
			className='max-w-md pb-4 mt-[100px]'>
			<div className='flex flex-col items-center'>
				<div className='flex flex-col w-full mx-2'>
					<Select
						options={addressOptions}
						onChange={val => setSelectedAddress(val?.value)}
						isMulti={false}
						className='react-select mb-4'
						classNamePrefix='select'
						defaultValue={addressOptions[0]}
						id='icon_s'
						placeholder={'Select Address'}
					/>
				</div>
				<QRcode text={selectedAddress} />
				<Button
					className='bg-black-500 text-white mt-4 w-full'
					text={'Copy to clipboard'}
					icon={'iconamoon:copy-light'}
					onClick={handleClick}
				/>
			</div>
		</Modal>
	);
};

export default ReceiveModal;
