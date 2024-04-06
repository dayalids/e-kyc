"use client";
import React, { useCallback, useState } from "react";
import { LIST_ALL_POLY_PETALS } from "@/configs/graphql/queries";
import { useQuery } from "graphql-hooks";
import SkeletionTable from "@/components/skeleton/Table";
import Add from "./Add";
import Table from "./Table";
import { useSelector } from "react-redux";
import { setPetals } from "@/store/petalReducer";
import { useDispatch } from "react-redux";

const StarterPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const dispatch = useDispatch();

	const openForm = () => {
		setIsModalOpen(true);
	};

  const { error, loading, data } = useQuery(LIST_ALL_POLY_PETALS, {
    onSuccess: (res) => {
      dispatch(setPetals(res.data.listAllPolyPetals));
    },
  });

  const petalSelector = useCallback((state) => state.petal, []);
  const { petals } = useSelector(petalSelector);

  if (loading) return <SkeletionTable />;
  if (error) return <pre>{error.message}</pre>;
  // console.log('petal->',data.listAllPolyPetals);

  const dataWithId = petals.map((petal, index) => ({
    ...petal,
    id: index + 1,
  }));

	return (
		<div>
			<div className=' bg-gray-200 dark:bg-gray-900 p-5 mb-16'>
				<Add
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
				/>
				<Table items={dataWithId} openForm={openForm} />
			</div>
		</div>
	);
};

export default StarterPage;
