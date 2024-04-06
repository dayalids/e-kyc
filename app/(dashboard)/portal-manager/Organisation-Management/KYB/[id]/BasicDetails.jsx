import React, { useCallback } from 'react';
import { useState, useEffect, useRef } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Textinput from '@/components/ui/Textinput';
import Modal from '@/components/ui/Modal';
import Image from '@/components/ui/Image';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Icon } from '@iconify/react';
import { useDispatch } from 'react-redux';
import { useMutation, useQuery } from 'graphql-hooks';
import { useForm } from 'react-hook-form';
import { UPDATE_BASIC_DETAILS } from '@/configs/graphql/mutations';
import { toast } from 'react-toastify';
import { setEntityDetail } from '@/store/registeredEntityReducer';
import Textarea from '@/components/ui/Textarea';

const schema = yup
  .object({
    name: yup.string().required('Name is Required'),
    type: yup.string().optional(),
    regNumber: yup.string(),
    address: yup.string().required('Address is Required'),
    website: yup.string().required('Website is Required'),
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

  const [selectedOpt, setOption] = useState();
  const [showImage, setshowImage] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [readonly, setReadOnly] = useState(true);
  const [updateBasicMutation] = useMutation(UPDATE_BASIC_DETAILS);
  const hiddenFileInput = useRef(null);

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
      const { data: mutationData, error } = await updateBasicMutation({
        variables: {
          id: userData._id,
          input: {
            name: reqData.name,
            regNumber: reqData.regNumber,
            website: reqData.website,
            address: reqData.address,
            logo: reqData.logo,
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
      // console.log('update basic detail', mutationData?.updateEntity);
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

  const assigneeOptions = [
    {
      value: 1,
      label: 'Active',
    },
    {
      value: 0,
      label: 'InActive',
    },
  ];
  
  const closeForm = () => {
    setModalOpen(false);
  };
  const handleChange = () => {
    // console.log('logo');
  };
  const allowEdit = () => {
    setReadOnly(!readonly);
  };
  const onError = (err) => {
   console.log('error from basic-detail->', err);
  };

  return (
    <div className="pb-6">
      {modalOpen ? (
        <Modal
          activeModal={modalOpen}
          onClose={closeForm}
          title="Logo"
          label="logo"
          labelClass="btn-outline-dark"
        >
          {showImage === true ? (
            <Image
              className="w-[100%] h-[100%]"
              src="https://media.threatpost.com/wp-content/uploads/sites/103/2019/09/26105755/fish-1.jpg"
            />
          ) : (
            <p>Logo photo</p>
          )}
        </Modal>
      ) : (
        ''
      )}
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onError)}>
        <Card className="bg-white rounded-none" bodyClass="p-0">
          <div className="mb-8 p-6 border-b-2 w-full">
            <h6>Organisation Details</h6>
          </div>
          <div className="p-6 lg:gap-x-36 gap-x-14 grid md:grid-cols-2 justify-items-center">
            <div className="w-full ">
              <Textinput
                name="name"
                label="Name of Organisation"
                placeholder="Enter Name"
                type="text"
                register={register}
                error={errors?.name}
                readonly={readonly}
              />
            </div>
            <div className="w-full">
              <Textinput
                name="type"
                label="Organisation Type"
                placeholder="Organisation Type"
                defaultValue={userData.type ? userData.type : ''}
                type="text"
                register={register}
                error={errors?.type}
                readonly={readonly}
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
              <Textarea
                name="address"
                label="Address"
                placeholder="Enter Address"
                type="text"
                register={register}
                error={errors?.address}
                autoComplete="off"
                readonly={readonly}
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
              <div className="flex justify-center items-center w-full h-10 dark:bg-slate-600 bg-slate-200  border-2 rounded my-3">
                <Button
                  className="pointer"
                  onClick={() => {
                    hiddenFileInput.current.click();
                  }}
                >
                  <Icon
                    className="h-6 w-6"
                    icon="heroicons-outline:arrow-up-on-square-stack"
                  ></Icon>
                </Button>
                <input
                  ref={hiddenFileInput}
                  type="file"
                  className="hidden"
                  onChange={handleChange}
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
                <div className="w-full flex justify-between">
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

