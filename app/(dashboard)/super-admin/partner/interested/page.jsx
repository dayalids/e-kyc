'use client';
import React from 'react';
import {LIST_ALL_INTERESTED_ENTITIES } from '@/configs/graphql/queries';
import { useQuery } from 'graphql-hooks';
import SkeletonTable from '@/components/skeleton/Table';
import Table from './table';

const Interested = () => {
	const { error, loading, data } = useQuery(LIST_ALL_INTERESTED_ENTITIES);
	// console.log('data+++', data);
	if (loading) return <SkeletonTable />;
	if (error) return <pre>{error.message}</pre>;

	const dataWithId = data.listAllInterestedEntities.map(
		(obj, index) => ({
			...obj,
			id: index + 1,
		})
	);

	return (
		<div>
			<div className='bg-gray-200 dark:bg-gray-900 p-5 mb-16'>
				<Table items={dataWithId} />
			</div>
		</div>
	);
};

export default Interested;
