/* eslint-disable react/display-name */
import React, { useState, useMemo } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import Tooltip from '@/components/ui/Tooltip';
import GlobalFilter from '@/components/partials/table/GlobalFilter';

import {
	useTable,
	useRowSelect,
	useSortBy,
	useGlobalFilter,
	usePagination,
	useFilters
} from 'react-table';
import EditForm from './edit';
import Select from '@/components/ui/Select';
import { setFilter } from '@/components/partials/app/email/store';
import ReceiveConcentModal from './ReceiveConcent';

const IndeterminateCheckbox = React.forwardRef(
	({ indeterminate, ...rest }, ref) => {
		const defaultRef = React.useRef();
		const resolvedRef = ref || defaultRef;

		React.useEffect(() => {
			resolvedRef.current.indeterminate = indeterminate;
		}, [resolvedRef, indeterminate]);

		return (
			<>
				<input
					type='checkbox'
					ref={resolvedRef}
					{...rest}
					className='table-checkbox'
				/>
			</>
		);
	}
);

const Table = ({ title = 'KYC Requests', items, openForm }) => {
	const [isUserModalOpen, setIsUserModalOpen] = useState(false);
	const [editId, SetEditId] = useState();

	const openUserModal = i => {
		const ClickedButtonIndex = i.target.id;
		SetEditId([ClickedButtonIndex, data[ClickedButtonIndex]._id]);
		setIsUserModalOpen(true);
		// console.log("EditId:", ClickedButtonIndex);
		// console.log("EditId:", data[ClickedButtonIndex]._id);
	};

	const COLUMNS = [
		{
			Header: 'Sr',
			accessor: 'id',
			Cell: row => {
				return <span>{row?.cell?.value}</span>;
			}
		},
		{
			Header: 'Requested By',
			accessor: 'requestedBy',
			Cell: row => {
				return (
					<div>
						<span className='inline-flex items-center'>
							<span className='text-slate-600 text-sm dark:text-slate-300 capitalize'>
								{row?.value.firstName} {row?.value.lastName}
							</span>
						</span>
					</div>
				);
			}
		},
		{
			Header: 'Bank',
			accessor: 'requestedBy.org',
			Cell: row => {
				return (
					<div>
						<span className='inline-flex items-center'>
							<span className='text-slate-600 text-sm dark:text-slate-300 capitalize'>
								{row?.cell?.value}
							</span>
						</span>
					</div>
				);
			}
		},

		{
			Header: 'Status',
			accessor: 'status',
			Cell: row => {
				return (
					<span className='block w-full'>
						<span
							className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
								row?.cell?.value === 3
									? 'text-success-500  bg-success-500'
									: ''
							} 
            ${
							row?.cell?.value === 2
								? 'text-warning-500 bg-warning-500'
								: ''
						}
            ${
							row?.cell?.value === 'canceled'
								? 'text-danger-400 bg-danger-800'
								: ''
						}
            +
             `}>
							{row?.cell?.value === 2
								? 'Pending'
								: row?.cell?.value === 3
								? 'Approved'
								: 'No status'}
						</span>
					</span>
				);
			}
		},
		{
			Header: 'ACTION',
			accessor: 'action',
			Cell: row => {
				return (
					<div className='flex justify-center space-x-3 rtl:space-x-reverse w-8 h-8'>
						<Tooltip
							content='Receive Concent'
							placement='top'
							arrow
							animation='shift-away'>
							<button
								className='border-none w-5 h-5 action-btn'
								type='button'
								id={row?.row?.id}
								onClick={i => openUserModal(i)}>
								<Icon
									icon='heroicons:arrow-down-on-square-stack'
									className='w-full h-full pointer-events-none'
								/>
							</button>
						</Tooltip>
					</div>
				);
			}
		}
	];

	const columns = useMemo(() => COLUMNS, []);
	const data = useMemo(() => items, []);
	console.log(data);

	const tableInstance = useTable(
		{
			columns,
			data
		},

		useGlobalFilter,
		useSortBy,
		usePagination,
		useRowSelect,
		setFilter,

		hooks => {
			hooks.visibleColumns.push(columns => [
				// {
				// 	id: 'selection',
				// 	Header: ({ getToggleAllRowsSelectedProps }) => (
				// 		<div>
				// 			<IndeterminateCheckbox
				// 				{...getToggleAllRowsSelectedProps()}
				// 			/>
				// 		</div>
				// 	),
				// 	Cell: ({ row }) => (
				// 		<div>
				// 			<IndeterminateCheckbox
				// 				{...row.getToggleRowSelectedProps()}
				// 			/>
				// 		</div>
				// 	)
				// },
				...columns
			]);
		}
	);
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		footerGroups,
		page,
		nextPage,
		previousPage,
		canNextPage,
		canPreviousPage,
		pageOptions,
		state,
		gotoPage,
		pageCount,
		setPageSize,
		setGlobalFilter,

		prepareRow
	} = tableInstance;

	const { globalFilter, pageIndex, pageSize } = state;

	// TODO: map these values in the select with hasPermission

	return (
		<>
			<Card>
				<div className='flex sm:flex-row flex-col justify-between items-center mb-6'>
					<div>
						<h4 className='mb-2 card-title'>{title}</h4>
					</div>
					<div className='flex sm:flex-row flex-col justify-center items-center gap-6'>
						<GlobalFilter
							filter={globalFilter}
							setFilter={setGlobalFilter}
						/>

						{/* <Button
							text={'Invite Users'}
							className='mb-3 py-2 text-white btn btn-dark'
							onClick={() => {
								openForm();
							}}
						/> */}
					</div>
				</div>
				<div className='-mx-6 overflow-x-auto'>
					<div className='inline-block min-w-full align-middle'>
						<div className='overflow-hidden'>
							<table
								className='table-fixed divide-y divide-slate-100 dark:divide-slate-700 min-w-full'
								{...getTableProps}>
								<thead className='bg-[#EEF4F899] dark:bg-slate-700'>
									{headerGroups.map(headerGroup => (
										<tr {...headerGroup.getHeaderGroupProps()}>
											{headerGroup.headers.map(column => (
												<th
													{...column.getHeaderProps()}
													scope='col'
													className='table-th'>
													{column.render('Header')}
													<span>
														{column.isSorted
															? column.isSortedDesc
																? ' 🔽'
																: ' 🔼'
															: ''}
													</span>
												</th>
											))}
										</tr>
									))}
								</thead>

								<ReceiveConcentModal
									isUserModalOpen={isUserModalOpen}
									setIsUserModalOpen={setIsUserModalOpen}
									data={editId ? items[editId[0]] : ''}
								/>
								<tbody
									className='bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700'
									{...getTableBodyProps}>
									{page.map(row => {
										prepareRow(row);
										const { key, ...restRowProps } =
											row.getRowProps();
										return (
											<tr key={key} {...restRowProps}>
												{row.cells.map(cell => {
													const { key, ...restCellProps } =
														cell.getCellProps();
													return (
														<td
															key={key}
															{...restCellProps}
															className='table-td'>
															{cell.render('Cell')}
														</td>
													);
												})}
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div className='md:flex justify-between items-center space-y-5 md:space-y-0 mt-6'>
					<div className='flex items-center space-x-3 rtl:space-x-reverse'>
						<select
							className='form-control py-2 w-max'
							value={pageSize}
							onChange={e => setPageSize(Number(e.target.value))}>
							{[10, 25, 50].map(pageSize => (
								<option key={pageSize} value={pageSize}>
									Show {pageSize}
								</option>
							))}
						</select>
						<span className='font-medium text-slate-600 text-sm dark:text-slate-300'>
							Page{' '}
							<span>
								{pageIndex + 1} of {pageOptions.length}
							</span>
						</span>
					</div>
					<ul className='flex flex-wrap items-center space-x-3 rtl:space-x-reverse'>
						<li className='text-slate-900 text-xl dark:text-white leading-4 rtl:rotate-180'>
							<button
								className={` ${
									!canPreviousPage
										? 'opacity-50 cursor-not-allowed'
										: ''
								}`}
								onClick={() => gotoPage(0)}
								disabled={!canPreviousPage}>
								<Icon icon='heroicons:chevron-double-left-solid' />
							</button>
						</li>
						<li className='text-slate-900 text-sm dark:text-white leading-4 rtl:rotate-180'>
							<button
								className={` ${
									!canPreviousPage
										? 'opacity-50 cursor-not-allowed'
										: ''
								}`}
								onClick={() => previousPage()}
								disabled={!canPreviousPage}>
								Prev
							</button>
						</li>
						{pageOptions.map((page, pageIdx) => (
							<li key={pageIdx}>
								<button
									href='#'
									aria-current='page'
									className={` ${
										pageIdx === pageIndex
											? 'bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium '
											: 'bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  '
									}    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
									onClick={() => gotoPage(pageIdx)}>
									{page + 1}
								</button>
							</li>
						))}
						<li className='text-slate-900 text-sm dark:text-white leading-4 rtl:rotate-180'>
							<button
								className={` ${
									!canNextPage ? 'opacity-50 cursor-not-allowed' : ''
								}`}
								onClick={() => nextPage()}
								disabled={!canNextPage}>
								Next
							</button>
						</li>
						<li className='text-slate-900 text-xl dark:text-white leading-4 rtl:rotate-180'>
							<button
								onClick={() => gotoPage(pageCount - 1)}
								disabled={!canNextPage}
								className={` ${
									!canNextPage ? 'opacity-50 cursor-not-allowed' : ''
								}`}>
								<Icon icon='heroicons:chevron-double-right-solid' />
							</button>
						</li>
					</ul>
				</div>
			</Card>
		</>
	);
};

export default Table;
