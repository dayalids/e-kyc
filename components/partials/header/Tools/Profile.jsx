'use client';
import React, { useCallback, useEffect } from 'react';
import Dropdown from '@/components/ui/Dropdown';
import Icon from '@/components/ui/Icon';
import { Menu, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';

import {
	GET_CURRENT_USER,
	GET_OBJECT_QUERY,
	GET_USER
} from '@/graphql/queries';
import {
	handleLogout,
	loadUser,
	selectUserAuth
} from '@/store/authReducer';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import getDefaultRole from '@/lib/getDefaultRole';
import { useQuery } from '@apollo/client';

const ProfileLabel = () => {
	const dispatch = useDispatch();
	const userId = localStorage.getItem('userId');

	const { error } = useQuery(GET_CURRENT_USER, {
		variables: {
			_id: userId
		},

		onCompleted: data => {
			const authToken = localStorage.getItem('authToken');
			// console.log("authToken+++", authToken);
			if (!authToken) return;
			console.log('inside');
			console.log(data.getCurrentUser, 'data');
			console.log(authToken, 'authToken');
			// console.log('res.data.getUser', res.data.getUser);
			const defaultRole = getDefaultRole(
				data.getCurrentUser.userRoles
			);
			dispatch(
				loadUser({
					_id: data.getCurrentUser._id,
					firstName: data.getCurrentUser.firstName,
					lastName: data.getCurrentUser.lastName,
					userRoles: data.getCurrentUser.userRoles,
					gender: data.getCurrentUser.gender,
					defaultRole: defaultRole,
					mobile: data.getCurrentUser.mobile,
					profilePic: data.getCurrentUser.profilePic,
					email: data.getCurrentUser.email,
					token: data.getCurrentUser.token,
					wallet: data.getCurrentUser.wallet
				})
			);
		}
	});

	const { user } = useSelector(selectUserAuth);

	const { data } = useQuery(GET_OBJECT_QUERY, {
		variables: {
			key: user?.profilePic
		},
		skip: !user?.profilePic
	});
	const ProfileUrl = data?.getObject?.url;

	return (
		<div className='flex items-center'>
			<div className='flex-1 ltr:mr-[10px] rtl:ml-[10px]'>
				<div
					className={`lg:h-8 lg:w-8 h-7 w-7 object-cover rounded-full ${
						!ProfileUrl ? 'bg-black-500' : ''
					}`}>
					{ProfileUrl ? (
						<img
							src={ProfileUrl}
							alt=''
							className='block w-full h-full object-cover rounded-full'
						/>
					) : null}
				</div>
			</div>
			<div className='flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap'>
				<span className='overflow-hidden text-ellipsis whitespace-nowrap w-[85px] block'>
					{user.firstName} {user.lastName}
					<br />
					{<p className='text-xs '> {user.defaultRole}</p>}
				</span>

				<span className='text-base inline-block ltr:ml-[10px] rtl:mr-[10px]'>
					<Icon icon='heroicons-outline:chevron-down'></Icon>
				</span>
			</div>
		</div>
	);
};

const Profile = () => {
	const dispatch = useDispatch();
	const router = useRouter();

	// console.log(router);
	const selectUser = useCallback(state => state.auth.user, []);
	const user = useSelector(selectUser);

	const ProfileMenu = [
		{
			label: 'Profile',
			icon: 'heroicons-outline:user',

			action: () => {
				router.push(`/profile`);
			}
		},

		{
			label: 'Change Password',
			icon: 'heroicons-outline:key',
			action: () => {
				router.push(`/change-password`);
			}
		},
		{
			label: 'Logout',
			icon: 'heroicons-outline:login',
			action: () => {
				localStorage.removeItem('authToken');
				localStorage.removeItem('userRole');
				localStorage.removeItem('userId');
				dispatch(handleLogout());
				toast.info('Logged out successfully');
				router.push('/auth/login');
			}
		}
	];

	return (
		<Dropdown
			label={ProfileLabel()}
			classMenuItems='w-[180px] top-[58px]'>
			{ProfileMenu.map((item, index) => (
				<Menu.Item key={index}>
					{({ active }) => (
						<div
							onClick={() => item.action()}
							className={`${
								active
									? 'bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50'
									: 'text-slate-600 dark:text-slate-300'
							} block     ${
								item.hasDivider
									? 'border-t border-slate-100 dark:border-slate-700'
									: ''
							}`}>
							<div className={`block cursor-pointer px-4 py-2`}>
								<div className='flex items-center'>
									<span className='block text-xl ltr:mr-3 rtl:ml-3'>
										<Icon icon={item.icon} />
									</span>
									<span className='block text-sm'>{item.label}</span>
								</div>
							</div>
						</div>
					)}
				</Menu.Item>
			))}
		</Dropdown>
	);
};

export default Profile;
