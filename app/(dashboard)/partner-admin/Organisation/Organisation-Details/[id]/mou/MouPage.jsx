'use client';
import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Textinput from '@/components/ui/Textinput';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useMutation } from 'graphql-hooks';
import { useForm } from 'react-hook-form';
import { UPDATE_SIGNATORY_AUTHORITY } from '@/configs/graphql/mutations';
import { toast } from 'react-toastify';
import { PUT_OBJECT_PRESIGNED_URL_MUTATION } from '@/configs/graphql/mutations';
import Add from './Add';
import { setEntityDetail } from '@/store/registeredEntityReducer';

const schema = yup
  .object({
    signatoryAuthority: yup.object({
      name: yup.string().required('Name is Required'),
      designation: yup.string().required('Designation is required'),
      email: yup
        .string()
        .required('Email is required')
        .email('Invalid email format'),
    }),
  })
  .required();

const MOUpage = ({ userData }) => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [readonly, setReadOnly] = useState(true);
  const [updatesignatoryAuthority] = useMutation(UPDATE_SIGNATORY_AUTHORITY);
  const [uploadFileMutation] = useMutation(PUT_OBJECT_PRESIGNED_URL_MUTATION);

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
    reset(userData);
  }, [userData]);

  const onSubmit = async (reqData) => {
    try {
      const { data: mutationData, error } = await updatesignatoryAuthority({
        variables: {
          id: userData._id,
          input: {
            signatoryAuthority: reqData.signatoryAuthority,
          },
        },
      });
      if (error) {
        throw new Error(error);
      }
      // console.log('updated ', mutationData?.updateEntity);
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
      console.error('Error updating details:', error);
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openForm = () => {
    setIsModalOpen(true);
  };
  return (
    <>
      <Add
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        data={userData}
      />
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onError)}>
        <Card className="bg-white rounded-none" bodyClass="p-0">
          <div className="flex flex-col sm:flex-row justify-between items-center  px-6 pt-6 ">
            <div>
              <h4 className="card-title mb-2">MOU Details</h4>
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Button
                text={'Raise MOU Request'}
                className="btn btn-dark text-white py-2 mb-3"
                onClick={() => {
                  openForm();
                }}
              />
            </div>
          </div>

          <div className="p-6 lg:gap-x-36 gap-x-14 grid md:grid-cols-2 justify-items-center">
            <div className="w-full">
              <Textinput
                name="signatoryAuthority.name"
                label="Signatory Authority Name"
                placeholder="Signatory Authority Name"
                type="text"
                register={register}
                error={errors?.signatoryAuthority?.name}
                readonly={readonly}
              />
            </div>
            <div className="w-full">
              <Textinput
                name="signatoryAuthority.email"
                label="Signatory Authority Email ID"
                placeholder="Signatory Authority Email ID"
                type="text"
                readonly={readonly}
                error={errors?.signatoryAuthority?.email}
                register={register}
              />
            </div>
            <div className="w-full">
              <Textinput
                name="signatoryAuthority.designation"
                label="Designation Of Signatory Authority"
                placeholder="Designation Of Signatory Authority"
                type="text"
                register={register}
                error={errors?.signatoryAuthority?.designation}
                autoComplete="off"
                readonly={readonly}
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
    </>
  );
};

export default MOUpage;
