import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { walletsData } from '@/constant/data';
import Image from 'next/image';

const TokenAccordion = ({ item, index, className = 'space-y-5' }) => {
	const [open, setOpen] = useState(false);
	// console.log('coindata', item);

	const toggleAccrodian = index => {
		setOpen(!open);
	};

	return (
		<div className={className}>
			<div
				className='accordion shadow-sm border dark:border-none dark:shadow-none rounded-md my-2'
				key={index}>
				<div
					className={`flex justify-between cursor-pointer transition duration-150 font-medium w-full text-start text-base text-slate-600 dark:text-slate-300 px-8 py-4 ${
						open
							? 'bg-slate-50 dark:bg-slate-700 dark:bg-opacity-60 rounded-t-md '
							: 'bg-white dark:bg-slate-700  rounded-md'
					}`}
					onClick={toggleAccrodian}>
					<div className='flex  items-center justify-start'>
						<Image
							src={
								item.symbol === 'BBN'
									? walletsData.bbnIcon
									: walletsData.polygonIcon
							}
							alt='polygon icon'
							width={50}
							height={50}
						/>
						<div className='flex flex-col ml-6'>
							<span className='text-xl'>{item?.name}</span>
							<span className='text-xs text-gray-400'>
								{item?.symbol}
							</span>
						</div>
					</div>
					<span
						className={`text-slate-900 dark:text-white text-[22px] transition-all duration-300 h-5 ${
							open ? 'rotate-180 transform' : ''
						}`}>
						<Icon icon='heroicons-outline:chevron-down' />
					</span>
				</div>

				{open && (
					<div
						className={`${
							open
								? 'dark:border dark:border-slate-700 dark:border-t-0'
								: 'l'
						} text-sm text-slate-600 font-normal bg-white dark:bg-slate-900 dark:text-slate-300 rounded-b-md`}>
						<div className='px-8 py-4 grid grid-cols-2 gap-4'>
							<div className='flex flex-col'>
								<span className='text-md'>Amount:</span>
								<span className='text-xs text-gray-400'>
									{item?.balance}
								</span>
							</div>
							<div className='flex flex-col'>
								<span className='text-md'>Currency:</span>
								<span className='text-xs text-gray-400'>
									{item?.symbol}
								</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
export default TokenAccordion;
