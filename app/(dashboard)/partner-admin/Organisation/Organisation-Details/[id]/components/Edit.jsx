import React, { useState, useEffect } from 'react';
import { useMutation } from 'graphql-hooks';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import Select from 'react-select';
import { UPDATE_STUDENTAMBASSADOR } from '@/configs/graphql/mutations';
import { useDispatch } from 'react-redux';
import { updateStudent } from '@/store/registeredEntityReducer';
import { toast } from 'react-toastify';

const schema = yup
  .object({
    name: yup.string().required('Name is Required'),
    email: yup.string().email('Invalid email').required('Email is Required'),
    mobile: yup.string().required('Mobile No. is Required'),
    status: yup.number().required('Status is Required'),
  })
  .required();

const Edit = ({ isUserModalOpen, setIsUserModalOpen, studentData, id }) => {
  const dispatch = useDispatch();

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
    reset(studentData);
  }, [studentData]);

  const closeForm = () => {
    setIsUserModalOpen(false);
    reset();
  };
  const assigneeOptions = [
    {
      value: 1,
      label: "Active",
    },
    {
      value: 0,
      label: "InActive",
    },
  ];

  const [updateStudentAmbassador] = useMutation(UPDATE_STUDENTAMBASSADOR);

  const onSubmit = async (reqData, event) => {
    event.stopPropagation();
    try {
      const { data: mutationData } = await updateStudentAmbassador({
        variables: {
          _id: id,
          email: studentData.email,
          input: {
            name: reqData.name,
            mobile: reqData.mobile,
            email: reqData.email,
            status: reqData.status,
          },
        },
      });

      // console.log(
      //   'Updated Student Ambassador:',
      //   mutationData.updateStudentAmbassador?.studentAmbassador
      // );
      dispatch(
        updateStudent(mutationData.updateStudentAmbassador?.studentAmbassador)
      );
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
      closeForm();
      reset();
    } catch (error) {
      console.error('Error updating Student Ambassador:', error.message);
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

  return (
    <div>
      {isUserModalOpen ? (
        <Modal
          activeModal={isUserModalOpen}
          onClose={closeForm}
          title="Edit Student Details"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Textinput
              name="name"
              label="name"
              type="text"
              placeholder="Enter Name "
              register={register}
              error={errors?.name}
              autoComplete="off"
            />

            <Textinput
              name="email"
              label="Email ID"
              placeholder="Enter Email"
              disabled
              type="text"
              register={register}
              error={errors?.email}
              autoComplete="off"
            />

            <Textinput
              name="mobile"
              label="Mobile No."
              type="text"
              placeholder="Enter Contact Number"
              register={register}
              error={errors?.mobile}
              autoComplete="off"
            />

            <Controller
              name="status"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="my-3 ">
                  <label className="form-label" htmlFor="icon_s">
                    Status
                  </label>
                  <Select
                    options={assigneeOptions}
                    value={assigneeOptions.find((c) => c.value === value)}
                    onChange={(val) => onChange(val.value)}
                    isMulti={false}
                    className="react-select"
                    classNamePrefix="select"
                    defaultValue={0}
                    id="icon_s"
                    placeholder={'Select Status'}
                  />
                  {errors.status && (
                    <p className="text-red-500">
                      {errors.sstudentAmbassador.status.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Button
              text={'Submit'}
              type="submit"
              className="bg-black-500 text-white w-full py-2 mb-8"
            />
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

export default Edit;
