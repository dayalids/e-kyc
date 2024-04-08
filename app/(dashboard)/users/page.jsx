'use client';
import React, { useCallback, useState } from 'react';
import { GET_ALL_ROLES, GET_USERS } from '@/graphql/queries';
import { useQuery } from '@apollo/client';
import SkeletionTable from '@/components/skeleton/Table';
import InviteUsers from './invite';
import Table from './Table';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers } from '@/store/userReducer';
import { setRoles } from '@/store/roleReducer';
import { selectUser } from '@/store/userReducer';

const UserPage = () => {
	const dispatch = useDispatch();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openForm = () => {
		setIsModalOpen(true);
	};

	const { error, loading, data } = useQuery(GET_USERS, {
		variables: {
			pageNumber: 1,
			pageSize: 20
		}
	});
	console.log({ data });

	const dataWithId =
		data?.users?.users.map((obj, index) => ({
			...obj,
			id: index + 1
		})) || [];
	if (loading) return <SkeletionTable />;
	if (error) return <pre>{error.message}</pre>;
	return (
		<div>
			<div className=' bg-gray-200 dark:bg-gray-900 p-5 mb-16'>
				<InviteUsers
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
				/>
				<Table items={dataWithId} openForm={openForm} />
			</div>
		</div>
	);
};

export default UserPage;
