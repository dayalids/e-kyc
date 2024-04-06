"use client";
import React, { useEffect, useState } from "react";
import { GET_POLY_USERS } from "@/configs/graphql/queries";
import { useQuery } from "graphql-hooks";
import SkeletionTable from "@/components/skeleton/Table";
import Table from "./Table/table";
import AddUser from "./AddUser";
import ListLoading from "@/components/skeleton/ListLoading";

const StarterPage = () => {
  const { error, loading, data } = useQuery(GET_POLY_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return <SkeletionTable count={5} />;
  // if (loading) return <ListLoading />;
  if (error) return <pre>{error.message}</pre>;

  // console.log(data.listAllAdminUsers);
  const polyUserData = data.listAllAdminUsers;

  polyUserData.forEach((item, index) => {
    item.serial = index + 1;
  });

  const openForm = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="bg-gray-200 dark:bg-gray-900 p-5 mb-16">
        <AddUser isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        <Table tableData={polyUserData} handleAddUser={openForm} />
      </div>
    </div>
  );
};

export default StarterPage;
