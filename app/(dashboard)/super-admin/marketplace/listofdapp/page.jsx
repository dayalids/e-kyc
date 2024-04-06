'use client';
import React, { useCallback, useState } from 'react';
import {
  GET_ALL_DAPPS,
  GET_ALL_FEATURES,
  GET_ALL_ROLES,
} from "@/configs/graphql/queries";
import { useQuery } from "graphql-hooks";
import SkeletionTable from "@/components/skeleton/Table";
import Add from "./Add";
import DappCard from "@/app/(dashboard)/super-admin/marketplace/listofdapp/DappCard";
import { setDApps } from "@/store/dappsReducer";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setFeatures } from "@/store/featureReducer";
import { setRoles } from "@/store/roleReducer";

const StarterPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const openForm = () => {
    setIsModalOpen(true);
  };

  const { error, loading, data } = useQuery(GET_ALL_DAPPS, {
    onSuccess: (res) => {
      dispatch(setDApps(res.data.listAllDApps));
    },
  });

  const {
    error: featureError,
    loading: featureLoading,
    data: featureList,
  } = useQuery(GET_ALL_FEATURES, {
    onSuccess: (res) => {
      dispatch(setFeatures(res.data.listAllFeatures));
    },
  });

  const {
    error: listAllRolesError,
    loading: RolesLoading,
    data: rolesData,
  } = useQuery(GET_ALL_ROLES, {
    onSuccess: (res) => {
      dispatch(setRoles(res.data.listAllRoles));
    },
  });

  const dappsSelector = useCallback((state) => state.dApp, []);
  const featureSelector = useCallback((state) => state.feature, []);
  const { dApps } = useSelector(dappsSelector);
  const { features } = useSelector(featureSelector);

  if (loading) return <SkeletionTable />;
  if (error) {
    console.log("role fetch error -> ", error);
    toast.error("something went wrong: ", error.message);
    return <pre>{error.message}</pre>;
  }

  const dataWithId = dApps.map((obj, index) => ({
    ...obj,
    id: index + 1,
  }));
  // console.log("Data in list of dapp", dataWithId)

  return (
    <div>
      <div className="bg-gray-200 dark:bg-gray-900 mb-16 p-5">
        <Add isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
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
