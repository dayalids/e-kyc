"use client";
import React, { use, useCallback } from 'react';
import {
  DELETE_ALL_ENTITY_COUNT,
  LIST_ALL_ENTITIES,
  LIST_ALL_USERS,
} from '@/configs/graphql/queries';
import { useQuery } from 'graphql-hooks';
import SkeletionTable from '@/components/skeleton/Table';
import Table from './table';
import { useDispatch } from 'react-redux';
import { setUsers } from '@/store/userReducer';
import { setAllRegisteredEntity } from '@/store/registeredEntityReducer';
import { useSelector } from 'react-redux';
import { setNewKybNotification } from '@/store/notificationReducer';

const StarterPage = () => {
  const dispatch = useDispatch();

  const AllRegEntity = useCallback((state) => state.registeredEntity, []);
  const { AllRegisteredEntities } = useSelector(AllRegEntity);

  const { error, loading, data } = useQuery(LIST_ALL_ENTITIES, {
    onSuccess: (res) => {
      dispatch(setAllRegisteredEntity(res?.data?.listAllEntities));
    },
  });

  const datatWithId = AllRegisteredEntities.map((obj, index) => ({
    ...obj,
    id: index + 1,
  }));

  const {
    data: response,
    error: countError,
    loading: countLoading,
  } = useQuery(DELETE_ALL_ENTITY_COUNT);
  !loading && dispatch(setNewKybNotification(0));

  if (loading) return <SkeletionTable />;
  if (error) return <pre>{error.message}</pre>;

  return (
    <div>
      <div className=" dark:bg-gray-900 p-5 mb-16">
        <Table items={datatWithId} />
      </div>
    </div>
  );
};

export default StarterPage;
