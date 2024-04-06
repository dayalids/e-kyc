import React, { useCallback, useRef } from 'react';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Textarea from '@/components/ui/Textarea';
import { Controller, useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import Select from 'react-select';
import { useMutation } from 'graphql-hooks';
import { UPDATE_DAPP } from '@/configs/graphql/mutations';
import { useDispatch } from 'react-redux';
import { updateDApp } from '@/store/dappsReducer';
import { toast } from 'react-toastify';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';

const schema = yup
  .object({
    title: yup.string().required('Title is Required'),
    description: yup.string().required('description is Required'),
    roles: yup
      .array()
      .of(yup.string().required())
      .required('Roles is Required'),
  })
  .required();

const EditForms = ({
  isUserModalOpen,
  setIsUserModalOpen,
  data,
  featureList,
}) => {
  const [selectedOpt, setOption] = useState();

  // useEffect(() => {
  //   reset(data);
  // }, [data]);

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
  const [updateDappMutation] = useMutation(UPDATE_DAPP);
  const dispatch = useDispatch();

  const closeForm = () => {
    setIsUserModalOpen(false);
    reset();
  };

  const statusOptions = [
    {
      value: 1,
      label: 'Active',
    },
    {
      value: 0,
      label: 'InActive',
    },
  ];

  const typeOptions = [
    {
      value: 'Custom',
      label: 'Custom',
    },
    {
      value: 'Global',
      label: 'Global',
    },
  ];

  const rolesSelector = useCallback((state) => state.role);
  const { roles } = useSelector(rolesSelector);

  const Rolesoptions = roles.map((role) => ({
    value: role._id,
    label: role.title,
  }));

  const handleSelectChange = (selectedOption) => {
    setOption(selectedOption);
  };

  const handleChange = () => {
    // console.log('logo');
  };

  const onSubmit = async (reqData) => {
    // console.log('Inside Edit Submit Button from DappId', reqData);
    const { data: apiData, error } = await updateDappMutation({
      variables: {
        _id: data._id,
        input: {
          title: reqData.title,
          description: reqData.description,
          roles: reqData.roles,
        },
      },
    });
    if (error) {
      // console.log('error->', error);
    }
    dispatch(updateDApp(apiData.updateDApp));
    toast.success('Dapp Updated Successfully');
    // console.log('Modal Add:', apiData);
    // console.log(reqData);
    closeForm();
    reset();
  };
  const onerror = (err) => {
    console.log('err->', err);
  };

  return (
    <div>
      {isUserModalOpen ? (
        <Modal
          activeModal={isUserModalOpen}
          onClose={closeForm}
          title="Edit Dapplist"
          className="max-w-xl pb-4 mt-[100px]"
          // themeClass="bg-[#4CA1EF] dark:border-b dark:border-slate-700"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onerror)}>
            <Textinput
              name="title"
              label="Title"
              type="text"
              defaultValue={data?.title}
              register={register}
              placeholder="Title"
              error={errors?.title}
              autoComplete="off"
            />
            <Textarea
              name="description"
              label="description"
              placeholder="Write here..."
              defaultValue={data?.description}
              type="text"
              register={register}
              error={errors?.description}
              autoComplete="off"
            />
            <div className="flex justify-center items-center w-full h-16 border-dashed border-2 my-4">
              <Button
                disabled={true}
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
                disabled
                type="file"
                className="hidden"
                onChange={handleChange}
              />
            </div>
            <Controller
              name="roles"
              control={control}
              defaultValue={data?.roles.map((role) => role._id)}
              render={({ field: { onChange, value, ref } }) => (
                <div className="mt-3">
                  <label className="form-label" htmlFor="icon_s">
                    Roles
                  </label>
                  <Select
                    ref={ref}
                    options={Rolesoptions}
                    value={Rolesoptions.filter((option) =>
                      value.includes(option.value)
                    )}
                    onChange={(vals) => onChange(vals.map((val) => val.value))}
                    isMulti={true}
                    className="react-select"
                    classNamePrefix="select"
                    id="icon_s"
                    placeholder={'Select Role'}
                  />
                </div>
              )}
            />

            {errors.assign && (
              <div className=" mt-2  text-danger-500 block text-sm">
                {errors.roles?.message || errors.roles?.label.message}
              </div>
            )}
            <Textinput
              name="weblink"
              disabled={true}
              label="Website Link"
              placeholder="ex:http://"
              type="text"
              register={register}
              defaultValue={data.weblink}
              error={errors?.weblink}
              autoComplete="off"
            />

            <Controller
              name="status"
              control={control}
              defaultValue={data.status}
              render={({ field: { onChange, value, ref } }) => (
                <div className="mt-3">
                  <label className="form-label" htmlFor="icon_s">
                    Status
                  </label>
                  <Select
                    ref={ref}
                    options={statusOptions}
                    isMulti={false}
                    isDisabled={true}
                    className="react-select"
                    classNamePrefix="select"
                    onChange={(val) => onChange(val.value)}
                    value={statusOptions.find((c) => c.value === value)}
                    id="icon_s"
                    placeholder={'Select Type'}
                  />
                </div>
              )}
            />
            {errors.status && (
              <div className=" mt-2  text-danger-500 block text-sm">
                {errors.status?.message || errors.status?.label.message}
              </div>
            )}

            <Controller
              name="type"
              control={control}
              defaultValue={data.type}
              render={({ field: { onChange, value, ref } }) => (
                <div className="mt-3">
                  <label className="form-label" htmlFor="icon_s">
                    Type
                  </label>
                  <Select
                    ref={ref}
                    isDisabled={true}
                    options={typeOptions}
                    isMulti={false}
                    className="react-select"
                    classNamePrefix="select"
                    onChange={(val) => onChange(val.value)}
                    value={typeOptions.find((c) => c.value === value)}
                    id="icon_s"
                    placeholder={'Select Role'}
                  />
                </div>
              )}
            />
            {errors.type && (
              <div className=" mt-2  text-danger-500 block text-sm">
                {errors.type?.message || errors.type?.label.message}
              </div>
            )}

            <Button
              type="submit"
              className="btn btn-dark block w-full text-center mt-4"
            >
              Submit
            </Button>
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

export default EditForms;
