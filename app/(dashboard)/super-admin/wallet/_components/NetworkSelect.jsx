import React from 'react';
import Select from 'react-select';

const NetworkSelect = ({ options, selectedOption, onChange }) => {
	const handleChange = selectedOption => {
		onChange(selectedOption);
	};

	return (
		<Select
			options={options}
			value={options.find(
				option => option.value === selectedOption.value
			)}
			onChange={handleChange}
			className='react-select'
		/>
	);
};

export default NetworkSelect;
