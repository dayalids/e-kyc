'use client';
import React, { useCallback, useEffect } from 'react';
import Table from './table';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { LIST_ALL_INTERESTED_ENTITIES } from '@/configs/graphql/queries';

import { useQuery } from 'graphql-hooks';
import SkeletionTable from '@/components/skeleton/Table';
import { setIntrestedEntities } from '../../../../../store/entitiesReducer';

const Interested = () => {
  const dispatch = useDispatch();
  const interestedEntities = useSelector(
    (state) => state.entities.interestedEntities
  );

  // console.log(interestedEntities);

  const { error, loading } = useQuery(LIST_ALL_INTERESTED_ENTITIES, {
    onSuccess: (res) => {
      dispatch(setIntrestedEntities(res.data?.listAllInterestedEntities));
    },
  });

  const items = interestedEntities.map((obj, index) => ({
    ...obj,
    id: index + 1,
  }));

  if (loading) return <SkeletionTable />;
  if (error) return <pre>{error.message}</pre>;
  return (
    <div>
      <div className="bg-gray-200 dark:bg-gray-900 p-5 mb-16">
        <Table items={items} />
      </div>
    </div>
  );
};

export default Interested;
