import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import { useMutation } from "graphql-hooks";
import { ADD_STUDENTAMBASSADOR } from "@/configs/graphql/mutations";
import { useDispatch } from 'react-redux';
import { addStudentDetail } from '@/store/registeredEntityReducer';
import { toast } from 'react-toastify';
const schema = yup.object({
  name: yup.string().required('Name is Required'),
  email: yup.string().email('Invalid email').required('Email is Required'),
  mobile: yup.string().required('Mobile No. is Required'),
  status: yup.number().required('Status is Required'),
});

const Add = ({ isModalOpen, setIsModalOpen, userData }) => {
  const [addStudentAmbassador] = useMutation(ADD_STUDENTAMBASSADOR);
  const [selectedOpt, setOption] = useState();
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

  const closeForm = () => {
    setIsModalOpen(false);
    reset();
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

  const onSubmit = async (reqData, event) => {
    event.stopPropagation();
    try {
      const { data: mutationData, error } = await addStudentAmbassador({
        variables: {
          id: userData._id,
          input: {
            name: reqData.name,
            email: reqData.email,
            mobile: reqData.mobile,
            status: reqData.status,
          },
        },
      });
      if (error) {
        throw new Error(error);
      }
      // console.log(
      //   'add Student Ambassador:',
      //   mutationData.addStudentAmbassador?.studentAmbassador
      // );
      dispatch(
        addStudentDetail(mutationData?.addStudentAmbassador?.studentAmbassador)
      );
      toast.success('Added successfully', {
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
      console.error('Error adding Student Ambassador:', error.message);
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
      {isModalOpen ? (
        <Modal
          activeModal={isModalOpen}
          onClose={closeForm}
          title="Add Student Ambassador"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Textinput
              name="name"
              label="Name"
              type="text"
              placeholder="Enter Name"
              register={register}
              error={errors?.name}
              autoComplete="off"
            />

            <Textinput
              name="email"
              label="Email ID"
              type="text"
              placeholder="Enter Email"
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

export default Add;
