"use client";
import React, { useState } from "react";
import { LIST_ALL_ABILITIES } from "@/configs/graphql/queries";
import { useQuery } from "graphql-hooks";
import SkeletionTable from "@/components/skeleton/Table";
import Add from "./Add";
import Tables from "./Table";

const StarterPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openForm = () => {
    setIsModalOpen(true);
  };

  const { error, loading, data } = useQuery(LIST_ALL_ABILITIES);

  if (loading) return <SkeletionTable />;
  if (error) return <pre>{error.message}</pre>;

  const dataWithId = data.listAllAbilities.map((obj, index) => ({
    ...obj,
    id: index + 1,
  }));

  return (
    <div>
      <div className="bg-gray-200 dark:bg-gray-900 p-5 mb-16">
        <Add isModalOpen={ isModalOpen } setIsModalOpen={ setIsModalOpen } />
        <Tables items={ dataWithId } openForm={ openForm }/>
      </div>
    </div>
  );
};

export default StarterPage;
