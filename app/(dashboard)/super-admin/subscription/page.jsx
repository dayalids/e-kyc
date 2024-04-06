'use client';
import React, { useCallback, useState } from 'react';
import {
	LIST_ALL_DAPPS_BASIC_DETAIL,
	LIST_ALL_SUBSCRIPTIONS
} from '@/configs/graphql/queries';
import { useQuery } from 'graphql-hooks';
import SkeletionTable from '@/components/skeleton/Table';
import Add from './Add';
import Table from './Table';
import { useSelector, useDispatch } from 'react-redux';
import { setSubscription } from '@/store/subscriptionReducer';
import { setDappOptions } from '@/store/roleReducer';

const StarterPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const dispatch = useDispatch();

	const openForm = () => {
		setIsModalOpen(true);
	};

	const { error, loading, data } = useQuery(LIST_ALL_SUBSCRIPTIONS, {
		onSuccess: res => {
			dispatch(setSubscription(res.data.listAllSubscriptions));
		}
	});
	const { data: DappData } = useQuery(LIST_ALL_DAPPS_BASIC_DETAIL, {
		onSuccess: res => {
			dispatch(setDappOptions(res.data.listAllDApps));
		}
	});

	const subscriptionSelector = useCallback(
		state => state.subscription,
		[]
	);
	const { subscription } = useSelector(subscriptionSelector);
	if (loading) return <SkeletionTable />;
	if (error) return <pre>{error.message}</pre>;

	const dataWithId = subscription.map((subscription, index) => ({
		...subscription,
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
