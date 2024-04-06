import React from 'react';

const TabBtn = ({ selected, title }) => {
	return (
		<button
			className={` text-sm font-medium mb-7 capitalize bg-white
             dark:bg-slate-800 ring-0 foucs:ring-0 focus:outline-none px-2
              transition duration-150 before:transition-all before:duration-150 relative 
              before:absolute before:left-1/2 before:bottom-[-6px] before:h-[1.5px] before:bg-primary-500 
              before:-translate-x-1/2 
              
              ${
								selected
									? 'text-primary-500 before:w-full'
									: 'text-slate-500 before:w-0 dark:text-slate-300'
							}
              `}>
			{title}
		</button>
	);
};

export default TabBtn;
