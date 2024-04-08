import Button from '@/components/ui/Button';
import { Icon } from '@iconify/react';
import React from 'react';

const WalletTransactionBtn = ({ label, handleClick, iconStr }) => {
	return (
		<div className='flex flex-col items-center w-12 '>
			<Button className='bg-transparent' onClick={handleClick}>
				<Icon
					icon={iconStr || 'fluent:arrow-download-20-regular'}
					className='text-4xl  cursor-pointer bg-black-500 text-white rounded-full p-2'
					aria-label={label}
				/>
			</Button>
			<p className='text-black text-sm pr-1 '>{label}</p>
		</div>
	);
};

export default WalletTransactionBtn;
