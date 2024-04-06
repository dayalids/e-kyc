'use client';
import React, { useCallback } from 'react';
import Table from './table';
import { useSelector } from 'react-redux';
import { useQuery } from 'graphql-hooks';
import { LIST_ALL_USERS } from '@/configs/graphql/queries'; // Correct import
import { useDispatch } from 'react-redux';
import { setUsers } from '@/store/userReducer';
import SkeletionTable from '@/components/skeleton/Table';

const StarterPage = () => {
  const dispatch = useDispatch();

  const Alluser = useCallback((state) => state.users, []);
  const { users } = useSelector(Alluser);

  const { error, loading } = useQuery(LIST_ALL_USERS, {
    onSuccess: (res) => {
      dispatch(setUsers(res.data?.users));
    },
  });

  const dataWithId = users.map((obj, index) => ({
    ...obj,
    id: index + 1,
  }));

  if (loading) return <SkeletionTable />;
  if (error) return <pre>{error.message}</pre>;
  return (
    <div>
      <div className="bg-gray-200 dark:bg-gray-900 p-5 mb-16">
        <Table items={dataWithId} />
      </div>
    </div>
  );
};

export default StarterPage;
