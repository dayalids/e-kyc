'use client';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LIST_ALL_EVENTS } from '@/configs/graphql/queries';
import { useQuery } from 'graphql-hooks';
import SkeletionTable from '@/components/skeleton/Table';
import Table from './table';
import Add from './add';
import { setEvents } from '@/store/eventsReducer';

const StarterPage = () => {
  const Allevents = useCallback((state) => state.events, []);
  const { events } = useSelector(Allevents);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispach = useDispatch();
  const { error, loading, data } = useQuery(LIST_ALL_EVENTS, {
    onSuccess: (res) => {
      dispach(setEvents(res?.data?.findAllPolyEvents));
    },
  });

  const openForm = () => {
    setIsModalOpen(true);
  };

  if (loading) return <SkeletionTable />;
  if (error) return <pre>{error.message}</pre>;

  const dataWithId = events.map((events, index) => ({
    ...events,
    id: index + 1,
  }));

  return (
    <div>
      <div className=" dark:bg-gray-900 p-5 mb-16">
        <Add isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} userData={events} />
        <Table items={dataWithId} openForm={openForm} />
      </div>
    </div>
  );
};

export default StarterPage;
