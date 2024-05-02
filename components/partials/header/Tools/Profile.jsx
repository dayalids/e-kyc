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

	const { error } = useQuery(GET_CURRENT_USER, {
		variables: {},

		onCompleted: data => {
			const authToken = localStorage.getItem('authToken');
			// console.log("authToken+++", authToken);
			if (!authToken) return;
			console.log('inside');

			console.log(authToken, 'authToken');
			// console.log('res.data.getUser', res.data.getUser);
			const defaultRole = data.getCurrentUser.userRole.name;

			dispatch(
				loadUser({
					_id: data.getCurrentUser._id,
					firstName: data.getCurrentUser.firstName,
					lastName: data.getCurrentUser.lastName,
					userRoles: data.getCurrentUser.userRole.name,
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

	const ProfileUrl = '';

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
							className='block rounded-full w-full h-full object-cover'
						/>
					) : null}
				</div>
			</div>
			<div className='lg:flex flex-none items-center hidden font-normal text-ellipsis text-slate-600 text-sm dark:text-white whitespace-nowrap overflow-hidden'>
				<span className='block w-[85px] text-ellipsis whitespace-nowrap overflow-hidden'>
					{user.firstName} {user.lastName}
					<br />
					{<p className='text-xs'> {user.defaultRole}</p>}
				</span>

				<span className='inline-block rtl:mr-[10px] ltr:ml-[10px] text-base'>
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
									<span className='block ltr:mr-3 rtl:ml-3 text-xl'>
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
