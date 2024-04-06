import React, { useCallback } from 'react';
import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Textinput from '@/components/ui/Textinput';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/Button';
import StudentAmbassador from './components/StudentAmbassador';
import Add from './components/Add';
import { useDispatch } from 'react-redux';
import { useMutation } from 'graphql-hooks';
import { UPDATE_BLOCKCHAINCHAPTER } from '@/configs/graphql/mutations';
import { toast } from 'react-toastify';
import { setEntityDetail } from '@/store/registeredEntityReducer';

const schema = yup
  .object({
    blockchainChapter: yup.object({
      chapterName: yup.string().required('Chapter Name is required'),
      chairDetails: yup.object({
        name: yup.string().required('Chair name is Required'),
        designation: yup.string().required('Designation is Required'),
        email: yup
          .string()
          .email('Invalid email')
          .required('Email is Required'),
        mobile: yup.string().required('Mobile No. is Required'),
      }),
    }),
  })
  .required();

const BlockchainChapter = ({ userData }) => {
  const dispatch = useDispatch();
  const [readonly, setReadOnly] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [updateBlockchainMutation] = useMutation(UPDATE_BLOCKCHAINCHAPTER);
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

  const onSubmit = async (reqData) => {
    console.log('blockchain onsbumit button');
    try {
      // Call the mutation here
      const { data: mutationData, error } = await updateBlockchainMutation({
        variables: {
          id: userData._id,
          input: {
            chapterName: reqData.blockchainChapter.chapterName,
            chairDetails: {
              name: reqData.blockchainChapter.chairDetails.name,
              designation: reqData.blockchainChapter.chairDetails.designation,
              email: reqData.blockchainChapter.chairDetails.email,
              mobile: reqData.blockchainChapter.chairDetails.mobile,
            },
          },
        },
      });
      if (error) throw new Error(error);

      // console.log('update blockchain', mutationData?.updateEntity);
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
    } catch (error) {
      console.error('Error updating Blockchain:', error);
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

  const openForm = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    reset(userData);
  }, [userData]);

  const allowEdit = () => {
    setReadOnly(!readonly);
  };

  return (
    <div>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Card className="bg-white rounded-none" bodyClass="p-0">
          <div className="p-6 lg:gap-x-36 gap-x-14 grid md:grid-cols-2 justify-items-center outline-none">
            <div className="w-full">
              <Textinput
                name="blockchainChapter.chapterName"
                label="Chapter Name"
                placeholder="Chapter Name"
                type="text"
                register={register}
                error={errors?.chapterName}
                autoComplete="off"
                readonly={readonly}
                msgTooltip
              />
            </div>
          </div>
          <div className="mb-8 p-6 border-b-2 w-full">
            <h6>Chair Details</h6>
          </div>
          <div className="px-6 lg:gap-x-36 gap-x-14 grid md:grid-cols-2 justify-items-center outline-none">
            <div className="w-full">
              <Textinput
                name="blockchainChapter.chairDetails.name"
                label="Chair Name"
                placeholder="Chair name"
                type="text"
                register={register}
                error={errors?.blockchainChapter?.chairDetails?.name}
                autoComplete="off"
                readonly={readonly}
                msgTooltip
              />
            </div>
            <div className="w-full">
              <Textinput
                name="blockchainChapter.chairDetails.designation"
                label="Designation"
                placeholder="Designation"
                type="text"
                register={register}
                error={errors?.blockchainChapter?.chairDetails?.designation}
                autoComplete="off"
                readonly={readonly}
                msgTooltip
              />
            </div>
            <div className="w-full">
              <Textinput
                name="blockchainChapter.chairDetails.email"
                label="Email"
                placeholder="Email"
                type="text"
                register={register}
                error={errors?.blockchainChapter?.chairDetails?.email}
                autoComplete="off"
                readonly={readonly}
                msgTooltip
              />
            </div>
            <div className="w-full">
              <Textinput
                name="blockchainChapter.chairDetails.mobile"
                label="Mobile"
                placeholder="Mobile"
                type="text"
                register={register}
                error={errors?.blockchainChapter?.chairDetails?.mobile}
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
                className="btn-dark text-white py-2 w-full md:w-1/6"
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
        {/* <Card className="mb-6"> */}
      </form>
      <Add
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        userData={userData}
      />

      <StudentAmbassador openForm={openForm} userData={userData} />
      {/* add user data when api available */}
      {/* </Card> */}
    </div>
  );
};

export default BlockchainChapter;
