'use client';
import React, { useCallback, useState } from 'react';
import { useQuery } from 'graphql-hooks';
import SkeletionTable from '@/components/skeleton/Table';
import Add from './Add';
import Table from './Table';
import { useSelector } from 'react-redux';
import {LIST_ALL_POLY_FLOWERS} from '@/configs/graphql/queries';
import { useDispatch } from 'react-redux';
import { setFlowers } from '@/store/flowerReducer';

const StarterPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const dispatch = useDispatch();

	const openForm = () => {
		setIsModalOpen(true);
	};

	const { error, loading, data } = useQuery(LIST_ALL_POLY_FLOWERS, {
		onSuccess: res => {
			dispatch(setFlowers(res.data.getAllPolyFlowers));
		}
	});

	const flowerSelector = useCallback(
		state => state.flower,
		[]
	);
	const { flowers } = useSelector(flowerSelector);

	if (loading) return <SkeletionTable />;
	if (error) return <pre>{error.message}</pre>;
	// console.log(data.getAllPolyFlowers);

	const dataWithId = flowers.map((flower, index) => ({
		...flower,
		id: index + 1
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
