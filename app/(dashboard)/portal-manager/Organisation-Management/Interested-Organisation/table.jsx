'use client';
/* eslint-disable react/display-name */
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import GlobalFilter from '@/components/partials/table/GlobalFilter';
import { useMutation } from 'graphql-hooks';
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from 'react-table';

import { INVITE_ENTITIES } from '@/configs/graphql/mutations';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { useDispatch } from 'react-redux';

import { useSelector } from 'react-redux';
import { updateInterested } from '@/store/entitiesReducer';

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
          type="checkbox"
          ref={resolvedRef}
          {...rest}
          className="table-checkbox"
        />
      </>
    );
  }
);

const Table = ({ title = 'Interested Organisations', items }) => {
  const dispatch = useDispatch();

  const handleExport = () => {
    if (selectedRowIds.length === 0) {
      toast.info('Please select some Organisation to export', {});
      return;
    }

    try {
      const selectedRows = items.filter((item) =>
        selectedRowIds.includes(item._id)
      );

      const ws = XLSX.utils.json_to_sheet(selectedRows);

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'SelectedRows');

      XLSX.writeFile(wb, 'selected_rows.xlsx');

      toast.success('Exported Selected Rows Successfully', {});
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Error exporting selected rows', {});
    }
  };

  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const [inviteEntities] = useMutation(INVITE_ENTITIES);

  const onSubmit = async () => {
    if (selectedRowIds.length == 0) {
      toast.info('Please select some Organisation to resend invite', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else {
      try {
        const { data: mutationData, error } = await inviteEntities({
          variables: {
            input: {
              _ids: selectedRowIds,
            },
          },
        });
        // console.log('Invitation send', mutationData.inviteEntities);
        if (error) {
          throw new Error(error);
        }

        dispatch(updateInterested(mutationData.inviteEntities));
        toast.success('Invited Sucessfully', {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      } catch (error) {
        console.error('API call error:', error);
      }
    }
  };

  // useEffect(() => {
  //   console.log('Selected Row IDs:', selectedRowIds);
  // }, [selectedRowIds]);

  const handleRowSelection = (row) => {
    // console.log('Row Selected:', row);

    if (row.isSelected === false) {
      // Check if the row ID is already present in selectedRowIds array
      if (!selectedRowIds.includes(row.original._id)) {
        setSelectedRowIds((prevSelectedRowIds) => [
          ...prevSelectedRowIds,
          row.original._id,
        ]);
      }
    } else {
      setSelectedRowIds((prevSelectedRowIds) =>
        prevSelectedRowIds.filter((id) => id !== row.original._id)
      );
    }
  };

  const handleAllRowSelection = () => {
    setSelectedRowIds((prevSelectedRowIndexes) => {
      if (prevSelectedRowIndexes.length === items.length) {
        return [];
      } else {
        return items.map((item) => item._id);
      }
    });
  };

  const COLUMNS = [
    {
      Header: 'S.No.',
      accessor: 'id',
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: 'Organisation Name',
      accessor: 'name',
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: 'Email',
      accessor: 'email',
      Cell: (row) => {
        return <span className="lowercase">{row?.cell?.value}</span>;
      },
    },
    {
      Header: ' Name',
      accessor: 'pointOfContact',
      Cell: (row) => {
        return (
          <span>
            {row?.cell?.value.firstName} {row?.cell?.value.lastName}
          </span>
        );
      },
    },
    {
      Header: 'Address',
      accessor: 'address',
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: 'Interest Submission',
      accessor: 'createdAt',
      Cell: (row) => {
        const timestamp = row?.cell?.value;
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        let hours = date.getHours() % 12 || 12; // Convert hours to 12-hour format
        hours = hours < 10 ? '0' + hours : hours; // Add leading zero if single digit
        const minutes =
          date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(); // Add leading zero if single digit
        const period = date.getHours() >= 12 ? 'PM' : 'AM';

        return (
          <div className="flex flex-col ">
            <span>{`${day}-${month}-${year}`}</span>
            <span>{`${hours}:${minutes} : ${period}`}</span>
          </div>
        );
      },
    },
    {
      Header: 'status',
      accessor: 'status',
      Cell: (row) => {
        // console.log(row.cell.value);
        return (
          <span className="block w-full">
            <span
              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                row?.cell?.value === 1
                  ? 'text-warning-500  bg-warning-500'
                  : 'text-success-500 bg-success-500'
              } 
              `}
            >
              {row?.cell?.value === 1 ? 'Invited' : 'Interested'}
            </span>
          </span>
        );
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  // const data = useMemo(() => items, []);
  const data = items || [];

  const tableInstance = useTable(
    {
      columns,
      data,
    },

    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,

    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox
                {...getToggleAllRowsSelectedProps()}
                onClick={() => handleAllRowSelection()}
              />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox
                {...row.getToggleRowSelectedProps()}
                onClick={() => handleRowSelection(row)}
              />
            </div>
          ),
        },
        ...columns,
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
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <>
      <Card>
        <div className="md:flex justify-between items-center mb-6">
          <div>
            <h4 className="card-title">{title}</h4>
          </div>
          <div className="flex flex-col sm:flex-row justify-center  items-center gap-6">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <Button
              text={'Export'}
              className="btn btn-dark text-white h-10 py-2 md:mb-3"
              onClick={handleExport}
            />

            <Button
              text={'Send Invite'}
              className="btn btn-dark text-white h-10 py-2 md:mb-3"
              onClick={() => {
                onSubmit();
              }}
            />
          </div>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps}
              >
                <thead className="bg-slate-200 dark:bg-slate-700">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps()}
                          scope="col"
                          className=" table-th "
                        >
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
                <tbody
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                  {...getTableBodyProps}
                >
                  {page.map((row) => {
                    prepareRow(row);
                    const { key, ...restRowProps } = row.getRowProps();
                    return (
                      <tr key={key} {...restRowProps}>
                        {row.cells.map((cell) => {
                          const { key, ...restCellProps } = cell.getCellProps();
                          return (
                            <td
                              key={key}
                              {...restCellProps}
                              className="table-td"
                            >
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
        <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
          <div className=" flex items-center space-x-3 rtl:space-x-reverse">
            <select
              className="form-control py-2 w-max"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 25, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Page{' '}
              <span>
                {pageIndex + 1} of {pageOptions.length}
              </span>
            </span>
          </div>
          <ul className="flex items-center  space-x-3  rtl:space-x-reverse flex-wrap">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  !canPreviousPage ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons:chevron-double-left-solid" />
              </button>
            </li>
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  !canPreviousPage ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                Prev
              </button>
            </li>
            {pageOptions.map((page, pageIdx) => (
              <li key={pageIdx}>
                <button
                  href="#"
                  aria-current="page"
                  className={` ${
                    pageIdx === pageIndex
                      ? 'bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium '
                      : 'bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  '
                  }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                  onClick={() => gotoPage(pageIdx)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  !canNextPage ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                Next
              </button>
            </li>
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className={` ${
                  !canNextPage ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Icon icon="heroicons:chevron-double-right-solid" />
              </button>
            </li>
          </ul>
        </div>
      </Card>
    </>
  );
};

export default Table;
