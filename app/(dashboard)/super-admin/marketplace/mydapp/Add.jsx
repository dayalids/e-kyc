import React from 'react';
import Modal from '@/components/ui/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Textarea from '@/components/ui/Textarea';
import { Controller, useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import Select from 'react-select';

import { useMutation } from 'graphql-hooks';
import { ADD_ROLE } from '@/configs/graphql/mutations';
import Button from '@/components/ui/Button';
import useDarkmode from '@/hooks/useDarkMode';

const schema = yup.object({
  name: yup.string().required('Name is Required'),
  status: yup.number().required(),
  permission: yup.string().required('Permission is required'),
  description: yup.string().required('Description is Required'),
});

const Add = ({ isModalOpen, setIsModalOpen }) => {
  const [addrole] = useMutation(ADD_ROLE);
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

  const assigneeOptionsPermission = [
    {
      value: 'Write',
      label: 'Write',
    },
    {
      value: 'Read',
      label: 'Read',
    },
    {
      value: 'Append',
      label: 'Append',
    },
  ];

  const onSubmit = async (data) => {
    // console.log('Inside ADD Submit Button from roles', data);
    // const { inputValues: apiData, error } = await addrole({
    //   variables: {
    //     input: {
    //       name: data.name,
    //       // abiityGroup: data.abiityGroup,
    //       description: data.description,
    //       type: data.type,
    //       status: Number(data.Status.value),
    //     },
    //   },
    // });
    // if (error) {
    //   console.log("error", error);
    //   throw new Error(error.graphQLErrors[0].message);
    // }
    closeForm();
    reset();
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
          title="Add Permission"
          className="max-w-xl pb-4 mt-[100px]"
          // themeClass="bg-[#4CA1EF]  dark:bg-slate-700 dark:border-black dark:border-slate-700"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onError)}>
            <Textinput
              name="name"
              label="permission"
              type="text"
              placeholder="Enter Permission"
              register={register}
              error={errors?.name}
              autoComplete="off"
            />

            <Controller
              name="permission"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="mt-3">
                  <label className="form-label" htmlFor="icon_s">
                    Permission
                  </label>
                  <Select
                    options={assigneeOptionsPermission}
                    value={assigneeOptionsPermission.find(
                      (c) => c.value === value
                    )}
                    onChange={(val) => onChange(val.value)}
                    isMulti={false}
                    className="react-select"
                    classNamePrefix="select"
                    defaultValue={0}
                    id="icon_s"
                    placeholder={'Assign permission'}
                  />
                </div>
              )}
            />
            <Controller
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
                    placeholder={'Select Status'}
                  />
                </div>
              )}
            />
            <Textarea
              name="description"
              label="Description"
              type="text"
              placeholder="description"
              register={register}
              error={errors?.description}
              autoComplete="off"
            />

            <Button
              type="submit"
              className="block btn btn-dark text-white w-full text-center mt-4"
            >
              Submit
            </Button>
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

export default Add;
