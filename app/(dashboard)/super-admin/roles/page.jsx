'use client';
import React, { useCallback, useState } from 'react';
import {
  GET_ALL_ROLES,
  LIST_ABILITY_OPTIONS,
  LIST_ALL_DAPPS_BASIC_DETAIL,
} from "@/configs/graphql/queries";
import { useQuery } from 'graphql-hooks';
import SkeletionTable from '@/components/skeleton/Table';
import Add from './_components/Add';
import Table from './_components/Table';
import {
	setAbilitiesOptions,
	setDappOptions,
	setRoles
} from '@/store/roleReducer';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const StarterPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const dispatch = useDispatch();

	const openForm = () => {
		setIsModalOpen(true);
	};

	const { error, loading, data } = useQuery(GET_ALL_ROLES, {
		onSuccess: res => {
			dispatch(setRoles(res.data.listAllRoles));
		}
	});
	const { data: dappOptions } = useQuery(
		LIST_ALL_DAPPS_BASIC_DETAIL,
		{
			onSuccess: res => {
				dispatch(
					setDappOptions(
						res.data.listAllDApps.map(item => {
							// console.log(item);
							return {
								value: item._id,
								label: item.title,
			
							};
						})
					)
				);
			}
		}
	);
	const { data: abilityOptions } = useQuery(LIST_ABILITY_OPTIONS, {
		onSuccess: res => {
			dispatch(
				setAbilitiesOptions(
					res.data.listAllAbilities.map(item => {
						return {
							value: item._id,
							label: item.title
						};
					})
				)
			);
		}
	});

	const roleSelector = useCallback(state => state.role, []);
	const { roles } = useSelector(roleSelector);


	if (loading) return <SkeletionTable />;
	if (error) {
		 console.log('role fetch error -> ', error);
		toast.error('something went wrong: ', error.message);
		return <pre>{error.message}</pre>;
	}

	const dataWithId = roles.map((obj, index) => ({
		...obj,
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
