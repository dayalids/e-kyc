'use client';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GET_NODE_BY_ID } from '@/configs/graphql/queries';
import { useQuery } from 'graphql-hooks';
import SkeletionTable from '@/components/skeleton/Table';

import Add from './Add';
import { setNode } from '@/store/nodeReducer';
import Table from './Table';

const StarterPage = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { error, loading, data } = useQuery(GET_NODE_BY_ID, {
    onSuccess: (res) => {
      dispatch(setNode(res.data.getNodesByEntityId));
    },
  });
  const nodeSelector = useCallback((state) => state.node, []);
  const { node } = useSelector(nodeSelector);
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
