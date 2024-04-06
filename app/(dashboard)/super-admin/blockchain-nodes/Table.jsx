/* eslint-disable react/display-name */
import React, { useState, useMemo } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Tooltip from "@/components/ui/Tooltip";
import GlobalFilter from "@/components/partials/table/GlobalFilter";
import "../../../scss/utility/_blockchainNodes.scss";
import { CardTitle } from "reactstrap";
// import Image from "@/components/ui/Image";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import Editforms from "./Edits";

const Table = ({ title = " D-Apps list", items, openForm }) => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editId, SetEditId] = useState();
  // console.log('items++++', items);

  const openUserModal = (i) => {
    const ClickedButtonIndex = i.target.id;
    SetEditId([ClickedButtonIndex, data[ClickedButtonIndex]._id]);
    setIsUserModalOpen(true);
    // console.log("EditId:", ClickedButtonIndex);
    // console.log("EditId:", data[ClickedButtonIndex]._id);
  };

  const COLUMNS = [
    // {
    //   Header: "DAPP ID",
    //   accessor: "dappid",
    //   Cell: (row) => {
    //     return (
    //       <div>
    //         <span className="d-flex items-center">
    //         <span className="text-sm text-slate-600 dark:text-slate-300 ">
    //             {row?.cell?.value}
    //           </span>
    //         </span>

    //       </div>

    //     );
    //   },
    // },

    {
      Header: "LOGO",
      accessor: "logo",
      Cell: (row) => {
        const nodeStatus = row.data[row.cell.row.id].status;
        return (
          <div
            className={`p-[1px] float-left md:h-[4rem] md:w-[4rem] h-[4rem] w-[4rem] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-1  relative ${
              nodeStatus === 1 ? "ring-green-400" : "ring-red-400"
            } `}
          >
            <img
              src="/assets/images/users/user-1.jpg"
              alt=""
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        );
      },
    },

    {
      Header: "STATUS",
      accessor: "status",
      Cell: (row) => {
        return (
          <div className="float-left relative">
            <label
              for="file"
              className="absolute bg-opacity-100 h-[11px] w-[11px] rounded-full bg-white dark:bg-slate-800  flex flex-col items-center  justify-center top-[2.8rem] md:top-[2.9rem] left-[-0.68rem] "
            >
              <span>
                {row?.cell?.value === 1 ? (
                  <div className="w-[15px] h-[15px]">
                    <img
                      src="/assets/images/icon/green-circle-icon.png"
                      alt=""
                    />
                  </div>
                ) : row?.cell?.value === 0 ? (
                  <div className="w-[15px] h-[15px]">
                    <img src="/assets/images/icon/red-circle-icon.png" alt="" />
                  </div>
                ) : (
                  ""
                )}
              </span>
            </label>
          </div>
        );
      },
    },
    {
      Header: "Title",
      accessor: "title",
      Cell: (row) => {
        return (
          <div>
            <span className="text-center">
              <CardTitle className="mt-6 font-semibold  ">
                Bharat Blockchain Network{row?.cell?.value}
              </CardTitle>
            </span>
          </div>
        );
      },
    },

    {
      Header: "DESCRIPTION",
      accessor: "description",
      Cell: (row) => {
        return (
          <div className="mt-8 mb-4">
            <span className="text-md text-slate-800 dark:text-slate-300 ">
              Decentralized applications utilize blockchain technology to enable
              trustless and transparent interactions on a distributed network.
              {row?.cell?.value}
            </span>
          </div>
        );
      },
    },

    {
      Header: "Developed By",
      accessor: "DevelopedBy",
      Cell: (row) => {
        return (
          <div>
            <span className="d-flex items-center">
              <span className="text-sm text-slate-400 dark:text-slate-400 ">
                Developed By - Dayal mukati
              </span>
              <span className="text-md text-slate-400 dark:text-slate-400 mx-3 ">
                {row?.cell?.value}
              </span>
            </span>
          </div>
        );
      },
    },
    {
      Header: "Created By",
      accessor: "createdBy",
      Cell: (row) => {
        return (
          <div>
            <span className="d-flex items-center ">
              <span className="text-sm text-slate-400 dark:text-slate-400 ">
                Created By - Vineet kumar
              </span>
              <span className="text-md text-slate-400 dark:text-slate-400 mx-3 ">
                {row?.cell?.value}
              </span>
            </span>
          </div>
        );
      },
    },
    {
      Header: "Last updated",
      accessor: "lastupdated",
      Cell: (row) => {
        return (
          <div>
            <span className="d-flex items-center ">
              <span className="text-sm text-slate-400 dark:text-slate-400 ">
                Last Updated - 10/12/2023
              </span>
              <span className="text-md text-slate-400 dark:text-slate-400 mx-3 ">
                {row?.cell?.value}
              </span>
            </span>
          </div>
        );
      },
    },

    {
      Header: "ACTION",
      accessor: "action",
      Cell: (row) => {
        return (
          <div className="flex mt-3 ">
            <Tooltip
              content="Edit"
              placement="top"
              arrow
              animation="shift-away"
            >
              {/* <button
                className=" underline font-semibold  text-lg text-slate-800 dark:text-slate-300 "
                type="button"
                id={row?.row?.id}
                onClick={(i) => openUserModal(i)}
              >
                Edit
              </button> */}
              <button
                type="submit"
                id={row?.row?.id}
                onClick={(i) => openUserModal(i)}
                className=" btn w-full text-white text-md text-center mt-2 bg-[#4CA1EF] dark:bg-black-700"
              >
                Edit
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => items, []);

  // console.log("Data:", data);
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
      hooks.visibleColumns.push((columns) => [...columns]);
    }
  );
  const {
    getTableProps,
    getTableBodyProps,

    page,

    state,

    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter } = state;

  return (
    <>
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-center  mb-4 ">
          <div>
            <h4 className="card-title mb-2">{title}</h4>
          </div>
          <div className="flex flex-col sm:flex-row justify-center  items-center gap-6">
            <div className="mt-5">
              <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            </div>
            <Button
              text={"Create New Dapp"}
              onClick={() => {
                openForm();
              }}
              className={"w-fit h-10 btn btn-dark text-white items-center"}
            />
          </div>
        </div>
        <Editforms
          isUserModalOpen={isUserModalOpen}
          setIsUserModalOpen={setIsUserModalOpen}
          data={editId ? items[editId[0]] : ""}
        />
        <div
          className="divide divide-slate-100 dark:divide-slate-700"
          {...getTableProps}
        >
          <div className="frame">
            {page.map((row) => {
              prepareRow(row);
              const { key, ...restRowProps } = row.getRowProps();
              return (
                <div
                  className="shadow-xl p-6  dark:shadow-slate-900  border-[1px] dark:border-slate-700 mb-1 rounded-md"
                  key={key}
                  {...restRowProps}
                >
                  {row.cells.map((cell) => {
                    const { key, ...restCellProps } = cell.getCellProps();
                    return (
                      <div key={key} {...restCellProps}>
                        {cell.render("Cell")}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </>
  );
};

export default Table;
