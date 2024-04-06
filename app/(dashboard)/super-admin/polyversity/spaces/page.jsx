'use client';
import React, { useCallback, useState } from 'react';
import { useQuery } from 'graphql-hooks';
import SkeletionTable from '@/components/skeleton/Table';
import Add from './_components/Add';
import Table from './_components/Table';
import { useSelector } from 'react-redux';
import { GET_ALL_ROLES, LIST_ALL_SPACES } from "@/configs/graphql/queries";

import { useDispatch } from "react-redux";
import { setSpaces } from "@/store/spacesReducer";
import { setRoles } from "@/store/roleReducer";

const StarterPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const openForm = () => {
    setIsModalOpen(true);
  };

  const { error, loading, data } = useQuery(LIST_ALL_SPACES, {
    onSuccess: (res) => {
      dispatch(setSpaces(res.data.listAllSpaces));
    },
  });

  const spacesSelector = useCallback((state) => state.space, []);

  const {
    error: listAllRolesError,
    loading: RolesLoading,
    data: rolesData,
  } = useQuery(GET_ALL_ROLES, {
    onSuccess: (res) => {
      dispatch(setRoles(res.data.listAllRoles));
    },
  });

  const { spaces } = useSelector(spacesSelector);
  // console.log(spaces);

  if (loading) return <SkeletionTable />;
  if (error) return <pre>{error.message}</pre>;

  const dataWithId = spaces.map((genPlaza, index) => ({
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
