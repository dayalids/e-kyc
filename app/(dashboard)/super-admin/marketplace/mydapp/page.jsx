'use client';
import React, { useCallback, useState } from 'react';
import { GET_ALL_DAPPS, GET_ALL_FEATURES } from '@/configs/graphql/queries';
import { useQuery } from 'graphql-hooks';
import SkeletionTable from '@/components/skeleton/Table';
import { useSelector } from 'react-redux';
import { setDApps } from '@/store/dappsReducer';
import { useDispatch } from 'react-redux';
import { setFeatures } from '@/store/featureReducer';
import DappCard from './DappCard';

const StarterPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const openForm = () => {
    setIsModalOpen(true);
  };

  useQuery(GET_ALL_FEATURES, {
    onSuccess: (res) => {
      dispatch(setFeatures(res.data.listAllFeatures));
    },
  });

  const { error, loading, data } = useQuery(GET_ALL_DAPPS, {
    onSuccess: (res) => {
      dispatch(setDApps(res.data.listAllDApps));
    },
  });

  const dappsSelector = useCallback((state) => state.dApp, []);
  const featureSelector = useCallback((state) => state.feature, []);
  const { dApps } = useSelector(dappsSelector);
  const { features } = useSelector(featureSelector);

  if (loading) return <SkeletionTable />;
  if (error) {
    // console.log('dapps fetch error -> ', error);
    toast.error('something went wrong: ', error.message);
    return <pre>{error.message}</pre>;
  }
  // console.log(data.listAllUserRoles);

  const dataWithId = dApps.map((obj, index) => ({
    ...obj,
    id: index + 1,
  }));
  // console.log('Data in my dapp', dataWithId);
  return (
    <div>
      <div className=" bg-gray-200 dark:bg-gray-900 p-5 mb-16">
        {/* <Add
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
				/> */}
        <DappCard
          items={dataWithId}
          openForm={openForm}
          featureList={features}
        />
      </div>
    </div>
  );
};

export default StarterPage;
