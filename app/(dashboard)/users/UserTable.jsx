'use client';

import React, { useState } from 'react';
import { GET_USERS, LIST_ALL_USERS } from '@/graphql/queries';
import { useQuery } from '@apollo/client';
import SkeletionTable from '@/components/skeleton/Table';
import AddUsers from './add';
import Table from './Table';

const UserTable = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openForm = () => {
		setIsModalOpen(true);
	};

	const { error, loading, data } = useQuery(LIST_ALL_USERS, {
		variables: {
			pageNumber: 1,
			pageSize: 20
		}
	});
	const dataWithId =
		data?.listAllUsers?.map((obj, index) => ({
			...obj,
			id: index + 1
		})) || [];
	if (loading) return <SkeletionTable />;
	if (error) return <pre>{error.message}</pre>;
	return (
		<>
			<AddUsers
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
			/>
			<Table items={dataWithId} openForm={openForm} />
		</>
	);
};

export default UserTable;
