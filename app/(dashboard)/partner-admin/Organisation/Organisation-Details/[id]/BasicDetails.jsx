import React, { useCallback } from 'react';
import { useState, useEffect, useRef } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Textinput from '@/components/ui/Textinput';
import { Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Select from 'react-select';
import { Icon } from '@iconify/react';
import { useDispatch } from 'react-redux';
import { useMutation, useQuery } from 'graphql-hooks';
import { useForm } from 'react-hook-form';
import { UPDATE_BASIC_DETAILS } from '@/configs/graphql/mutations';
import { toast } from 'react-toastify';
import { PUT_OBJECT_PRESIGNED_URL_MUTATION } from '@/configs/graphql/mutations';
import UploadGetPreSignedUrl, { HandleUpload } from '@/lib/upload';
import ImageViewerModal from '@/components/features/IMAGEviewer/ImageViewerModal';
import { GET_OBJECT_QUERY } from '@/configs/graphql/queries';
import { setEntityDetail } from '@/store/registeredEntityReducer';
import Textarea from '@/components/ui/Textarea';

const schema = yup
  .object({
    name: yup.string().required('Name is Required'),
    type: yup.string().optional(),
    regNumber: yup.string(),
    website: yup.string().required('Website is Required'),
    address: yup.object({
      city: yup.string().required('City is Required'),
      state: yup.string().required('State is Required'),
      pincode: yup.number().required('Pincode is Required'),
      // country: yup.string().required('Country is Required'),
      street: yup.string().required('Street is Required'),
    }),
    systemAdminDetails: yup.object({
      firstName: yup.string().required('First Name is Required'),
      lastName: yup.string().required('Last Name is Required'),
      email: yup.string().email('Invalid email').required('Email is Required'),
      mobile: yup.string().required('Mobile No. is Required'),
    }),
  })
  .required();

const BasicDetails = ({ userData }) => {

  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [readonly, setReadOnly] = useState(true);
  const [updateBasicMutation] = useMutation(UPDATE_BASIC_DETAILS);
  const [uploadFileMutation] = useMutation(PUT_OBJECT_PRESIGNED_URL_MUTATION);
  const hiddenFileInput = useRef(null);

  const [preAssigenedUrl, setPreAssigenedUrl] = useState();
  const [File, setFile] = useState('');
  const [Key, setKey] = useState(userData?.logo);
  const [s3BucketUrl, setS3BucketurlUrl] = useState();

  const { loading, data, error } = useQuery(GET_OBJECT_QUERY, {
    variables: { key: userData?.logo },
    onSuccess: (res) => {
      setS3BucketurlUrl(res.data.getObject.url);
    },
    skip: !userData?.logo,
  });
  const assigneeOptions = [
    {
      value: ' University',
      label: ' University',
    },

    {
      value: 'College',
      label: 'College',
    },
    {
      value: 'Company',
      label: 'Company',
    },
    {
      value: 'Startup',
      label: 'Startup',
    },
    {
      value: 'Goverment',
      label: 'Goverment',
    },
  ];
  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  useEffect(() => {
    // Fetch the data from your API
    // fetchDataFromAPI().then((apiData) => {
    // Update the form values with the data from the API
    // This assumes that your API data has a structure that matches your form field names.
    reset(userData);
  }, [userData]);

  const onSubmit = async (reqData) => {
    try {
      if (File) {
        const statusCode = await HandleUpload({
          url: preAssigenedUrl,
          file: File,
          type: File?.type.split('/')[1],
        });
        console.log('Upload response code:', statusCode);
      }

      const { data: mutationData, error } = await updateBasicMutation({
        variables: {
          id: userData._id,
          input: {
            name: reqData.name,
            regNumber: reqData.regNumber,
            website: reqData.website,
            address: reqData.address,
            logo: Key,
            type: reqData.type,
            systemAdminDetails: {
              firstName: reqData.systemAdminDetails.firstName,
              lastName: reqData.systemAdminDetails.lastName,
              mobile: reqData.systemAdminDetails.mobile,
              email: reqData.systemAdminDetails.email,
            },
          },
        },
      });
      if (error) {
        throw new Error(error);
      }
      // console.log('updated basic detail', mutationData?.updateEntity);
      dispatch(setEntityDetail(mutationData?.updateEntity));
      toast.success('Updated successfully', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      setReadOnly(true);
      closeForm();
    } catch (error) {
      console.error('Error updating basic details:', error);
      toast.error('Something went wrong', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  const closeForm = () => {
    setModalOpen(false);
  };
  const handleChange = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const { key, url } = await UploadGetPreSignedUrl({
        file,
        uploadFileMutation,
      });
      setKey(key);
      setPreAssigenedUrl(url);
    } else {
      toast.warn('Please upload a png/jpg file');
    }
  };

  const allowEdit = () => {
    setReadOnly(!readonly);
  };
  const onError = (err) => {
    console.log('error from basic-detail->', err);
  };

  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const openModal = () => {
    if (File) {
      const url = URL.createObjectURL(File);
      setImageUrl(url);
      setShowModal(true);
    } else {
      setImageUrl(s3BucketUrl);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const handleFileClick = () => {
    if (!readonly) {
      hiddenFileInput.current.click();
    } else {
      toast.info('Click "Edit" to upload files.');
    }
  };

  return showModal ? (
    <ImageViewerModal
      imageUrl={imageUrl}
      onClose={closeModal}
      title="Logo Preview"
    />
  ) : (
    <div className="pb-6">
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onError)}>
        <Card className="bg-white rounded-none" bodyClass="p-0">
          <div className="mb-8 p-6 border-b-2 w-full">
            <h6>Organisation Details</h6>
          </div>
          <div className="p-6 lg:gap-x-36 gap-x-14 grid md:grid-cols-2 justify-items-center">
            <div className="w-full">
              <Textinput
                name="name"
                label="Name of Organisation"
                placeholder=""
                type="text"
                register={register}
                error={errors?.name}
                readonly={readonly}
              />
            </div>
            <div className="w-full ">
              <Controller
                name="type"
                control={control}
                defaultValue={
                  assigneeOptions.find((option) => option.value === data?.type)
                    ?.label
                }
                render={({ field: { onChange, value } }) => (
                  <div>
                    <label className="form-label" htmlFor="icon_s">
                    Organisation type
                    </label>
                    <Select
                      options={assigneeOptions}
                      value={assigneeOptions.find((c) => c.value === value)}
                      onChange={(val) => onChange(val.value)}
                      isMulti={false}
                      className="react-select"
                      classNamePrefix="select"
                      defaultValue={0}
                      isDisabled={readonly}
                      id="icon_s"
                      placeholder={'Select Type '}
                    />
                    {errors.type && (
                      <p className="text-red-500">{errors.type.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="w-full">
              <Textinput
                name="regNumber"
                label="Registration Number(PRN/CRN)"
                placeholder="Enter Registration Number"
                type="text"
                readonly={readonly}
                error={errors?.regNumber}
                register={register}
              />
            </div>
            <div className="w-full">
              <Textinput
                name="website"
                label="Website"
                placeholder="Website"
                type="text"
                register={register}
                error={errors?.website}
                autoComplete="off"
                readonly={readonly}
              />
            </div>
            <div className="d-flex w-full">
              <div>Logo</div>
              <div
                className={`pointer ${
                  readonly
                    ? 'flex items-center w-full h-12 dark:bg-slate-600 bg-slate-200 rounded my-3'
                    : 'bg-white flex items-center w-full border dark:border-none h-12 dark:bg-slate-900 rounded my-3 '
                }`}
              >
                <span className=" rounded-md cursor-pointer overflow-hidden text-sm px-2">
                  {File ? File.name : userData?.logo}
                </span>
                <div className="flex ml-auto items-center">
                  <Icon
                    className="h-6 w-6 cursor-pointer text-slate-400"
                    icon="heroicons-outline:eye"
                    onClick={openModal}
                  />
                  <input
                    ref={hiddenFileInput}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex ml-2">
                  <Button
                    className={`pointer ${
                      readonly
                        ? 'opacity-70 h-12  btn  cursor-not-allowed text-black bg-slate-300 dark:bg-slate-700 dark:text-slate-100  rounded'
                        : ' bg-slate-200 h-12 w-auto dark:bg-slate-700 '
                    }`}
                    onClick={handleFileClick}
                    disabled={readonly}
                  >
                    Browse files
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-8 p-6  border-b-2 w-full">
              <h6> Address Details </h6>
            </div>
            <div className="p-6 lg:gap-x-36 gap-x-14 grid md:grid-cols-2 justify-items-center ">
              <div className="w-full">
                <Textinput
                  name="address.state"
                  label="State"
                  placeholder="Enter state"
                  type="text"
                  register={register}
                  error={errors?.address?.state}
                  readonly={readonly}
                />
              </div>
              <div className="w-full">
                <Textinput
                  name="address.city"
                  label="City"
                  placeholder="Enter City"
                  type="text"
                  register={register}
                  error={errors?.address?.city}
                  readonly={readonly}
                />
              </div>
              <div className="w-full">
                <Textinput
                  name="address.street"
                  label="Street"
                  placeholder="Enter Street"
                  type="text"
                  register={register}
                  error={errors?.address?.street}
                  readonly={readonly}
                />
              </div>
              <div className="w-full">
                <Textinput
                  name="address.pincode"
                  label="Pincode"
                  placeholder="Enter Area PinCode"
                  type="text"
                  register={register}
                  error={errors?.address?.pincode}
                  readonly={readonly}
                />
              </div>
            </div>
          </div>

          <div className="mb-8 p-6 border-b-2 w-full">
            <h6>Admin's Details</h6>
          </div>
          <div className="p-6 lg:gap-x-36 gap-x-14 grid md:grid-cols-2 justify-items-center outline-none">
            <div className="w-full">
              <Textinput
                name="systemAdminDetails.firstName"
                label="First Name"
                placeholder="Enter First Name"
                type="text"
                register={register}
                error={errors?.systemAdminDetails?.firstName}
                autoComplete="off"
                readonly={readonly}
                msgTooltip
              />
            </div>
            <div className="w-full">
              <Textinput
                name="systemAdminDetails.lastName"
                label="Last Name"
                placeholder="Enter Last Name"
                type="text"
                register={register}
                error={errors?.systemAdminDetails?.lastName}
                autoComplete="off"
                readonly={readonly}
                msgTooltip
              />
            </div>
            <div className="w-full">
              <Textinput
                name="systemAdminDetails.mobile"
                label="Mobile"
                placeholder="Enter Contact Number"
                type="text"
                register={register}
                error={errors?.systemAdminDetails?.mobile}
                autoComplete="off"
                readonly={readonly}
                msgTooltip
              />
            </div>
            <div className="w-full">
              <Textinput
                name="systemAdminDetails.email"
                label="Email"
                placeholder="Enter Email"
                type="text"
                register={register}
                error={errors?.systemAdminDetails?.email}
                autoComplete="off"
                readonly={readonly}
                msgTooltip
              />
            </div>
          </div>

          <div className="p-6 flex w-full justify-center md:justify-end">
            {readonly === true ? (
              <Button
                text="Edit"
                className="btn btn-dark text-white py-2 w-full md:w-1/6"
                onClick={allowEdit}
              />
            ) : (
              <div className="w-full flex  lg:gap-x-36 md:gap-x-14  md:grid grid-cols-2">
                <div></div>
                <div className="w-full flex justify-end gap-x-12">
                  <Button
                    text="Submit"
                    type="submit"
                    className="btn btn-dark text-white py-2 w-2/6"
                  />
                  <Button
                    text="Cancel"
                    className="bg-danger-500 hover:bg-danger-600 text-white py-2 w-2/6"
                    onClick={allowEdit}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
};

export default BasicDetails;
