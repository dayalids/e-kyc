import React, { useCallback } from 'react';

import Modal from '@/components/ui/Modal';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import Select from 'react-select';

import { useMutation } from 'graphql-hooks';
import { INVITE_ADMIN_USER } from '@/configs/graphql/mutations';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
 
const schema = yup.object({
  firstname: yup.string().required('Firstname is Required'),
  lastname: yup.string().required('Lastname is Required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is Required'),
   roleId: yup.string().required('Role is required'),
});

const Add = ({ isModalOpen, setIsModalOpen }) => {
  const [inviteUser] = useMutation(INVITE_ADMIN_USER);
 
  const {
    register,
    control,
    reset,
    clearErrors,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const closeForm = () => {
    setIsModalOpen(false);
  };

  const assigneeOptions = [
    {
      value: 1,
      label: 'Active',
    },
    {
      vlaue: 0,
      label: 'InActive',
    },
  ];

  const rolesSelector = useCallback((state) => state.role);
  const { roles } = useSelector(rolesSelector);

  const Rolesoptions = roles.map((role) => ({
    value: role._id,
    label: role.title,
  }));

  const onSubmit = async (reqData) => {
    try {
      const { data: mutationData, error } = await inviteUser({
        variables: {
          input: {
            firstName: reqData.firstname,
            lastName: reqData.lastname,
            email: reqData.email,
            roleId: reqData.roleId,
          },
        },
      });
      if (error) {
        throw new Error(error);
      }
       toast.success('Invitation sent sucessfully');
      closeForm();
      reset();
    } catch (error) {
      console.log('Something went wrong in sending invite ', error);
      toast.error('Something went wrong!');
    }
  };
  const onError = (err) => {
    console.log('error from role add form->', err);
  };

  return (
    <div>
      {isModalOpen ? (
        <Modal
          activeModal={isModalOpen}
          onClose={closeForm}
          title="Invite User"
          className="max-w-xl pb-4 mt-[100px]"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onError)}>
            <Textinput
              name="firstname"
              label="First Name"
              type="text"
              placeholder="Enter firstname"
              register={register}
              error={errors?.firstname}
              autoComplete="off"
              onClick={() => clearErrors()}
            />
            <Textinput
              name="lastname"
              label="Last Name"
              type="text"
              placeholder="Enter lastname"
              register={register}
              error={errors?.lastname}
              autoComplete="off"
              onClick={() => clearErrors()}
            />
            <Textinput
              name="email"
              label="Email"
              type="text"
              placeholder="Enter User Email"
              register={register}
              error={errors?.email}
              autoComplete="off"
              onClick={() => clearErrors()}
            />
            <Controller
              name="roleId"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="mt-3">
                  <label className="form-label" htmlFor="icon_s">
                    Roles
                  </label>
                  <Select
                    options={Rolesoptions}
                    value={Rolesoptions.find((c) => c.value === value)}
                    onChange={(val) => onChange(val.value)}
                    isMulti={false}
                    className="react-select"
                    classNamePrefix="select"
                    defaultValue={0}
                    id="icon_s"
                    placeholder={'Select Role'}
                  />
                </div>
              )}
            />
            {/* <Controller
              name="status"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="mt-3">
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
                    placeholder={"Select Role"}
                  />
                </div>
              )}
            /> */}
            <Button
              type="submit"
              className="btn btn-dark text-white block w-full text-center mt-8 mb-4"
            >
              Send Invite
            </Button>
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

export default Add;
