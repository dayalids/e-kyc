'use client';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Textinput from '@/components/ui/Textinput';
import { useMutation, useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import {
	UPDATE_USER_DETAILS_MUTATION,
	PUT_OBJECT_PRESIGNED_URL_MUTATION
} from '@/graphql/mutations';
import { GET_OBJECT_QUERY } from '@/graphql/queries';

import * as yup from 'yup';
import Button from '@/components/ui/Button';
import '../../../app/scss/utility/_superadmin.scss';
import '@/app/scss/utility/_superadmin.scss';

import UploadGetPreSignedUrl, {
	HandleUpload
} from '../../../lib/upload';
import { toast } from 'react-toastify';
import { loadUser } from '@/store/authReducer';
import { useDispatch } from 'react-redux';

const schema = yup
	.object({
		firstName: yup.string().required('First name required'),
		lastName: yup.string().optional(),
		location: yup.string().optional(),
		gender: yup.string().required('Gender is required'),
		mobile: yup.string().required('Contact Number is required')
	})
	.required();

export const ProfileTemplate = () => {
	const dispatch = useDispatch();
	const [uploadFileMutation] = useMutation(
		PUT_OBJECT_PRESIGNED_URL_MUTATION
	);
	const [updateProfile] = useMutation(UPDATE_USER_DETAILS_MUTATION);
	const { user } = useSelector(state => state.auth);

	const [preAssigenedUrl, setPreAssigenedUrl] = useState();
	const [File, setFile] = useState('');
	const [Key, setKey] = useState(user?.profilePic);
	const [s3BucketUrl, setS3BucketurlUrl] = useState();
	const [LocalUrl, setLocalUrl] = useState();
	const [uploading, setUploading] = useState(false);

	const { loading, data, error } = useQuery(GET_OBJECT_QUERY, {
		variables: { key: user?.profilePic },
		onSuccess: res => {
			setS3BucketurlUrl(res.data.getObject.url);
		},
		skip: !user?.profilePic
	});

	const {
		register,
		control,
		reset,
		formState: { errors },
		handleSubmit
	} = useForm({
		resolver: yupResolver(schema),
		mode: 'all'
	});

	useEffect(() => {
		reset(user);
	}, [user]);

	const onSubmit = async reqData => {
		try {
			if (File) {
				setUploading(true);
				const statusCode = await HandleUpload({
					url: preAssigenedUrl,
					file: File,
					type: File?.type.split('/')[1]
				});
				console.log('Upload response code:', statusCode);
			}

			const { data: apiData, error } = await updateProfile({
				variables: {
					_id: user._id,
					input: {
						firstName: reqData.firstName,
						lastName: reqData.lastName,
						mobile: reqData.mobile,
						gender: reqData.gender,
						profilePic: Key
					}
				}
			});
			if (error) {
				throw new Error(error);
			}
			dispatch(
				loadUser({
					...user,
					_id: apiData.updateUser._id,
					firstName: apiData.updateUser.firstName,
					lastName: apiData.updateUser.lastName,
					gender: apiData.updateUser.gender,
					mobile: apiData.updateUser.mobile,
					profilePic: apiData.updateUser.profilePic,
					location: apiData.updateUser.location
				})
			);
			toast.success('Profile update successfull');
			setUploading(false);
		} catch (error) {
			console.error('Error during Update:', error);
			toast.error('Something went wrong');
		}
	};

	const onerror = err => {
		console.log(err);
	};

	const handleChange = async event => {
		event.preventDefault();
		const file = event.target.files[0];
		if (file) {
			setFile(file);
			const LocalUrl = URL.createObjectURL(file);
			setLocalUrl(LocalUrl);

			const { key, url } = await UploadGetPreSignedUrl({
				file,
				uploadFileMutation
			});
			setKey(key);
			setPreAssigenedUrl(url);
		} else {
			toast.warn('Please upload a png/jpg file');
		}
	};

	return (
		<div>
			<div className='space-y-5 profile-page pb-20'>
				<div className='profile-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]'>
					<div className='bg-black-500 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg'></div>
					<div className='profile-box flex-none md:text-start text-center'>
						<div className='md:flex items-end md:space-x-6 rtl:space-x-reverse'>
							<div className='flex-none'>
								<div className='md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 object-cover rounded-full ring-4 ring-slate-100 relative  bg-black-900'>
									<img
										src={LocalUrl ? LocalUrl : s3BucketUrl}
										className={`${
											uploading ? 'backdrop-blur-2xl shadow-lg' : ''
										} w-full h-full object-cover rounded-full `}
									/>
									{uploading && (
										<div className='dark:text-slate-900 text-slate-600 text-sm absolute font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
											Uploading...
										</div>
									)}

									<label
										for='file'
										className='absolute right-2 h-8 w-8 bg-slate-50 text-slate-600 rounded-full cursor-pointer shadow-sm flex flex-col items-center justify-center md:top-[140px] top-[100px]'>
										<Icon
											icon='fluent:camera-edit-20-regular'
											width='24'
										/>
										<input
											type='file'
											id='file'
											className='hidden'
											name='image'
											accept='image/gif,image/jpeg,image/jpg,image/png'
											data-original-title='upload photos'
											onChange={handleChange}
										/>
									</label>
								</div>
							</div>
							<div className='flex-1 mb-10'>
								<div className='text-2xl font-medium text-slate-900 dark:text-slate-200'>
									{user?.firstName} {user?.lastName}
								</div>
								<div className='text-sm font-light text-slate-600 dark:text-slate-400'>
									{user?.defaultRole}
								</div>
							</div>
						</div>
					</div>
				</div>

				<form
					autoComplete='off'
					onSubmit={handleSubmit(onSubmit, onerror)}>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-x-8 xl:gap-x-28 gap-y-4 py-10 px-2 lg:px-20 rounded-lg bg-white dark:bg-slate-800'>
						<div className='d-flex'>
							<div>
								<label
									className='form-label text-sm'
									htmlFor='icon_s'>
									First Name
								</label>
							</div>
							<div className='flex'>
								<IconField src='mdi:user-outline' />
								<InputField
									fieldName={'firstName'}
									placeholder={'Enter First Name'}
									value={user?.firstName}
									register={register}
									error={errors?.firstName}
								/>
							</div>
						</div>
						<div className='d-flex'>
							<div>
								<label
									className='form-label text-sm '
									htmlFor='icon_s'>
									Last Name
								</label>
							</div>
							<div className='flex'>
								<IconField src='mdi:user-outline' />

								<InputField
									fieldName={'lastName'}
									value={user?.lastName}
									placeholder={'Enter Last Name'}
									register={register}
									error={errors?.lastName}
								/>
							</div>
						</div>
						<div className='d-flex'>
							<div>
								<label
									className='form-label text-sm '
									htmlFor='icon_s'>
									Email address
								</label>
							</div>
							<div className='flex'>
								<IconField src='mdi:user-outline' />

								<InputField
									fieldName={'email'}
									placeholder={'Enter Email Address'}
									value={user?.email}
									register={register}
									error={errors?.email}
								/>
							</div>
						</div>
						<div className='d-flex'>
							<div>
								<label
									className='form-label text-sm '
									htmlFor='icon_s'>
									Gender
								</label>
							</div>
							<div className='flex'>
								<IconField src='ph:gender-intersex' />

								<InputField
									fieldName={'gender'}
									placeholder={'Gender'}
									value={user?.gender}
									register={register}
									error={errors?.gender}
								/>
							</div>
						</div>
						{/* <div className="d-flex">
              <div>
                <label className="form-label text-sm " htmlFor="icon_s">
                  Location
                </label>
              </div>
              <div className="flex">
                <IconField src="ep:location" />

                <InputField
                  fieldName={'location'}
                  placeholder={'Enter your address'}
                  value={user?.location}
                  register={register}
                  error={errors?.location}
                />
              </div>
            </div> */}
						<div className='d-flex'>
							<div>
								<label
									className='form-label text-sm'
									htmlFor='icon_s'>
									Phone number
								</label>
							</div>
							<div className='flex'>
								<IconField src='ph:phone-incoming-light' />
								<InputField
									fieldName={'mobile'}
									placeholder={'Enter Contact Number'}
									value={user?.mobile}
									register={register}
									error={errors?.mobile}
								/>
							</div>
						</div>
						{/* <div></div> */}
						{/* <div></div> */}
						<div className='flex justify-start sm:justify-end xl:w-[90%]'>
							<Button
								type='submit'
								text='Save'
								className='bg-black-500 text-white lg:w-fit h-10  py-2 px-20 mt-12 w-full items-center mr-auto'
							/>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

const InputField = ({
	fieldName,
	label,
	value,
	placeholder,
	register,
	error
}) => (
	<div className='xl:w-[90%] w-full'>
		<Textinput
			name={fieldName}
			label={label}
			defaultValue={value}
			placeholder={placeholder}
			type='text'
			register={register}
			error={error}
			autoComplete='off'
			className={`bg-slate-100 py-4 indent-2 px-12  border-none rounded-lg font-serif text-lg ${
				error ? 'indent-6' : ''
			}`}
			classLabel='form-label text-lg'
		/>
	</div>
);

const IconField = ({ src }) => {
	return (
		<Icon
			className='icon-profile bg-slate-100 dark:bg-slate-900 mt-2'
			icon={src}
		/>
	);
};
