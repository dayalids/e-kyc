'use client';
import React from 'react';
import { LIST_ALL_ENTITIES } from '@/configs/graphql/queries';
import { useQuery } from 'graphql-hooks';
import SkeletionTable from '@/components/skeleton/Table';
import Table from './table';

const StarterPage = () => {
  const { error, loading, data } = useQuery(LIST_ALL_ENTITIES);

  const dataWithId = data?.listAllEntities.map((obj, index) => ({
    ...obj,
    id: index + 1,
  }));

  if (loading) return <SkeletionTable />;
  if (error) return <pre>{error.message}</pre>;
  return (
    <div>
      <div className=" dark:bg-gray-900 p-5 mb-16">
        <Table items={dataWithId} />
      </div>
    </div>
  );
};

export default StarterPage;
