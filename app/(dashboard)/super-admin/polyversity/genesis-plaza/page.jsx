'use client';
import React, { useCallback, useState } from 'react';
import { useQuery } from 'graphql-hooks';
import SkeletionTable from '@/components/skeleton/Table';
import Add from './Add';
import Table from './Table';
import { useSelector } from 'react-redux';
import { LIST_ALL_POLY_GEN_PLAZAS} from '@/configs/graphql/queries';

import { setGenPlazas } from '@/store/genPlazaReducer';
import { useDispatch } from 'react-redux';

const StarterPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const openForm = () => {
    setIsModalOpen(true);
  };

  const { error, loading, data } = useQuery(LIST_ALL_POLY_GEN_PLAZAS, {
    onSuccess: (res) => {
      dispatch(setGenPlazas(res.data.listAllPolyGenPlazas));
    },
  });

  const genPlazaSelector = useCallback((state) => state.genPlaza, []);
  const { genPlazas } = useSelector(genPlazaSelector);

  if (loading) return <SkeletionTable />;
  if (error) return <pre>{error.message}</pre>;
  // console.log(genPlazas);

  const dataWithId = genPlazas.map((genPlaza, index) => ({
    ...genPlaza,
    id: index + 1,
  }));

  return (
    <div>
      <div className=" bg-gray-200 dark:bg-gray-900 p-5 mb-16">
        <Add isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        <Table items={dataWithId} openForm={openForm} />
      </div>
    </div>
  );
};

export default StarterPage;
