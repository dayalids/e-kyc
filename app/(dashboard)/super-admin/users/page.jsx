'use client';
import React, { useCallback, useState } from 'react';
import { GET_ALL_ROLES, LIST_ALL_USERS } from '@/configs/graphql/queries';
import { useQuery } from 'graphql-hooks';
import SkeletionTable from '@/components/skeleton/Table';
import Add from './add';
import Table from './Table';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers } from '@/store/userReducer';
import { setRoles } from '@/store/roleReducer';

const UserPage = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { error: listAllRolesError, loading: RolesLoading } = useQuery(
    GET_ALL_ROLES,
    {
      onSuccess: (res) => {
        dispatch(setRoles(res.data.listAllRoles));
      },
    }
  );

  const openForm = () => {
    setIsModalOpen(true);
  };

  const { error, loading, data } = useQuery(LIST_ALL_USERS, {
    onSuccess: (res) => {
      dispatch(setUsers(res?.data?.users));
    },
  });

  const usersSelector = useCallback((state) => state.users, []);
  const { users } = useSelector(usersSelector);

  const dataWithId = users
    .filter((obj) => obj.userRoles.some((role) => role.type === 'global'))
    .map((obj, index) => ({
      ...obj,
      id: index + 1,
    }));
  if (loading || RolesLoading) return <SkeletionTable />;
  if (error || listAllRolesError) return <pre>{error.message}</pre>;
  return (
    <div>
      <div className=" bg-gray-200 dark:bg-gray-900 p-5 mb-16">
        <Add isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        <Table items={dataWithId} openForm={openForm} />
      </div>
    </div>
  );
};

export default UserPage;
