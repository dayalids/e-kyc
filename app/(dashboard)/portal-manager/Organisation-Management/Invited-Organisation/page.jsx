'use client';
import React, { useCallback } from 'react';
import SkeletionTable from '@/components/skeleton/Table';
import Table from './table';
import { useSelector } from 'react-redux';
import { LIST_ALL_INVITED_ENTITIES } from '@/configs/graphql/queries';
import { useDispatch } from 'react-redux';
import { setInvitedEntities } from '@/store/entitiesReducer';
import { useQuery } from 'graphql-hooks';

const StarterPage = () => {
  const dispatch = useDispatch();
  const InvitedEntities = useCallback((state) => state.entities, []);
  const { invitedEntities } = useSelector(InvitedEntities);

  //setting data for Entity management
  const { error, loading } = useQuery(LIST_ALL_INVITED_ENTITIES, {
    onSuccess: (res) => {
      dispatch(setInvitedEntities(res?.data?.listAllInvitedEntities));
    },
  });

  if (loading) return <SkeletionTable />;
  const dataWithId = invitedEntities.map((obj, index) => ({
    ...obj,
    id: index + 1,
  }));

  return (
    <div>
      <div className="bg-gray-200 dark:bg-gray-900 p-5 mb-16">
        <Table items={dataWithId} />
      </div>
    </div>
  );
};

export default StarterPage;
