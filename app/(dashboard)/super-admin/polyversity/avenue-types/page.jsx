"use client";
import React, { useState } from "react";
import { GET_AVENUE_TYPES } from "@/configs/graphql/queries";
import { useQuery } from "graphql-hooks";
import SkeletionTable from "@/components/skeleton/Table";
import Add from "./Add";
import Table from "./Table";

const StarterPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openForm = () => {
    setIsModalOpen(true);
  };

  const { error, loading, data } = useQuery(GET_AVENUE_TYPES);

  if (loading) return <SkeletionTable />;
  if (error) return <pre>{error.message}</pre>;

  const dataWithId = data.listAllAvenueType.map((obj, index) => ({
    ...obj,
    id: index + 1,
  }));

  return (
    <div>
      <div className="bg-gray-100 dark:bg-gray-900 p-5">
        <Add isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        <Table items={dataWithId} openForm={openForm} />
      </div>
    </div>
  );
};

export default StarterPage;
