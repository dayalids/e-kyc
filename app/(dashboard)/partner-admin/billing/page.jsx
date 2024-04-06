"use client";
import React, { useState } from "react";
import { GET_All_USER_ROLES } from "@/configs/graphql/queries";
import { useQuery } from "graphql-hooks";
import SkeletionTable from "@/components/skeleton/Table";
import Table from "./Table";

const StarterPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openForm = () => {
    setIsModalOpen(true);
  };

  const { error, loading, data } = useQuery(GET_All_USER_ROLES);

  if (loading) return <SkeletionTable />;
  // if (error) return <pre>{error.message}</pre>;
  // console.log(data.listAllUserRoles);

  // const dataWithId = data.listAllUserRoles.map((obj, index) => ({
  //   ...obj,
  //   id: index + 1,
  // }));
  const dataWithId = [[],[],[],[],[],[]] 
  return (
    <div>
      <div className=" bg-gray-200 dark:bg-gray-900 p-5 mb-16">
        <Table items={dataWithId} openForm={openForm} />
      </div>
    </div>
  );
};

export default StarterPage;
