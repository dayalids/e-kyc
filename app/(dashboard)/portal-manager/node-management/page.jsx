"use client";
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {LIST_ALL_NODES} from "@/configs/graphql/queries";
import { useQuery } from "graphql-hooks";
import SkeletionTable from "@/components/skeleton/Table";
import Table from "./table";
import Add from './add';
import { setNode } from '@/store/nodeReducer';

const StarterPage = () => {
  const AllNode = useCallback((state) => state.node, []);
  const { node } = useSelector(AllNode);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispach = useDispatch();
  const { error, loading, data } = useQuery(LIST_ALL_NODES, {
    onSuccess: (res) => {
      dispach(setNode(res?.data?.listAllNodes));
    },
  });

  const openForm = () => {
    setIsModalOpen(true);
  };

  if (loading) return <SkeletionTable />;
  if (error) return <pre>{error.message}</pre>;

  const dataWithId = node.map((node, index) => ({
    ...node,
    id: index + 1,
  }));

  return (
    <div>
      <div className=" dark:bg-gray-900 p-5 mb-16">
        <Add isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        <Table items={dataWithId} openForm={openForm} />
      </div>
    </div>
  );
};

export default StarterPage;
