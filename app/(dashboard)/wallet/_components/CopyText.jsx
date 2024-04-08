import Tooltip from '@/components/ui/Tooltip';
import copyText from '@/lib/copyText';
import { Icon } from '@iconify/react';
import React from 'react';
import { toast } from 'react-toastify';

const CopyText = ({ text }) => {
	return (
		<Tooltip
			content='copy'
			children={
				<div
					className=' text-blue-500 underline cursor-pointer flex'
					onClick={() => {
						copyText(text);
						toast.success('Copied to clipboard');
					}}>
					{text}
					<Icon
						icon={'iconamoon:copy-light'}
						className='text-lg text-gray-700 cursor-pointer ml-1'
					/>
				</div>
			}></Tooltip>
	);
};

export default CopyText;
