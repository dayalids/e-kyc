'use client';
import React, { useCallback, useState } from 'react';
import {
	LIST_ALL_ABILITIES
} from '@/configs/graphql/queries';
import { useQuery } from 'graphql-hooks';
import SkeletionTable from '@/components/skeleton/Table';
import Add from './_components/Add';
import Table from './_components/Table';
import { useSelector } from 'react-redux';
import { setAbilities } from '@/store/abilityReducer';
import { useDispatch } from 'react-redux';

const StarterPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const dispatch = useDispatch();

	const openForm = () => {
		setIsModalOpen(true);
	};

	const { error, loading, data } = useQuery(LIST_ALL_ABILITIES, {
		onSuccess: res => {
			dispatch(setAbilities(res.data.listAllAbilities));
		}
	});

	const abilitiesSelector = useCallback(state => state.ability, []);
	const { abilities } = useSelector(abilitiesSelector);

	if (loading) return <SkeletionTable />;
	if (error) return <pre>{error.message}</pre>;

	const dataWithId = abilities.map((ability, index) => ({
		...ability,
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
