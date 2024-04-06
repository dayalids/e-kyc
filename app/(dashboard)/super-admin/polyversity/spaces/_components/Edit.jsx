import React, { useCallback } from "react";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textarea from "@/components/ui/Textarea";
import { Controller, useForm } from "react-hook-form";
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";
import { UPDATE_SPACE_MUTATION } from '@/configs/graphql/mutations';
import { useMutation } from 'graphql-hooks';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateSpaces } from '@/store/spacesReducer';

const schema = yup
  .object({
    title: yup.string().optional('Name is Required'),
    description: yup.string().optional('Description is Required'),
    flowerId: yup.string().required('Flower id is Required'),
    hexagonId: yup.string().required('Hexagon Id is Required'),
    spaceId: yup.string().required('Space Id is Required'),
    roles: yup
      .array()
      .of(yup.string().required())
      .required('Roles is Required'),
    status: yup.number().optional('Status is Required'),
  })
  .required();

const EditForm = ({ isUserModalOpen, setIsUserModalOpen, data }) => {
  // console.log('Data->', data);
  const [updateSpacesMutation] = useMutation(UPDATE_SPACE_MUTATION);
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

  const dispatch = useDispatch();

  // useEffect(() => {
  //   // Fetch the data from your API
  //   // fetchDataFromAPI().then((apiData) => {
  //   // Update the form values with the data from the API
  //   // This assumes that your API data has a structure that matches your form field names.
  //   reset(data);
  // }, [data]);

  const closeForm = () => {
    setIsUserModalOpen(false);
    reset();
  };

  const assigneeOptions = [
    {
      value: 0,
      label: 'InActive',
    },
    {
      value: 1,
      label: 'Active',
    },
  ];

  const flowerSelector = useCallback((state) => state.flower, []);
  const { flowersId } = useSelector(flowerSelector);

  var assigneeOptionsFlower = flowersId.map((flower) => {
    return {
      value: flower._id,
      label: flower.flowerId,
    };
  });

  const rolesSelector = useCallback((state) => state.role);
  const { roles } = useSelector(rolesSelector);

  const Rolesoptions = roles.map((role) => ({
    value: role._id,
    label: role.title,
  }));

  const onSubmit = async (reqData) => {
    // console.log('reqdata', reqData);
    try {
      const { data: mutationData } = await updateSpacesMutation({
        variables: {
          id: data._id,
          input: {
            title: reqData.title,
            spaceId: reqData.spaceId,
            hexagonId: reqData.hexagonId,
            description: reqData.description,
            flower: reqData.flowerId,
            status: reqData.status,
            roles: reqData.roles,
          },
        },
      });
      // console.log('Updated spaces:', mutationData.updateSpace);
      dispatch(updateSpaces(mutationData.updateSpace));
      toast.success('Updated Successfully');
      closeForm();
      reset();
    } catch (error) {
      console.error('Error updating spaces:', error);
      toast.error('Something went wrong!');
    }
  };
  const onError = (errors) => {
    console.log('Form errors', errors);
  };

  return (
    <div>
      {isUserModalOpen ? (
        <Modal
          activeModal={isUserModalOpen}
          onClose={closeForm}
          title="Edit Spaces"
          className="max-w-xl pb-4 mt-[100px]"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onError)}>
            <Controller
              name="title"
              control={control}
              defaultValue={data.title}
              render={({ field }) => (
                <Textinput
                  {...field}
                  label="Title"
                  placeholder="Enter Title"
                  type="text"
                  register={register}
                  disabled={false} // Enable the input
                  autoComplete="off"
                  error={errors?.title}
                />
              )}
            />
            <Controller
              name="spaceId"
              control={control}
              defaultValue={data.spaceId}
              render={({ field }) => (
                <Textinput
                  {...field}
                  label="Space-ID"
                  placeholder="Enter SpaceId"
                  type="text"
                  register={register}
                  autoComplete="off"
                  error={errors?.spaceId}
                />
              )}
            />
            <Controller
              name="hexagonId"
              control={control}
              rules={{ required: 'hexagon ID is required' }}
              defaultValue={data.hexagonId}
              render={({ field }) => (
                <Textinput
                  {...field}
                  label="Hexagon-ID"
                  placeholder="Enter Hexagon ID"
                  type="text"
                  register={register}
                  disabled={false} // Enable the input
                  autoComplete="off"
                  error={errors?.hexagonId}
                />
              )}
            />
            <Controller
              name="flowerId"
              control={control}
              defaultValue={data?.flower?._id}
              render={({ field: { onChange, value } }) => (
                <div className="mt-3">
                  <label className="form-label" htmlFor="icon_s">
                    Flower-ID
                  </label>
                  <Select
                    options={assigneeOptionsFlower}
                    value={assigneeOptionsFlower.find((c) => c.value === value)}
                    onChange={(val) => onChange(val.value)}
                    isMulti={false}
                    className="react-select"
                    classNamePrefix="select"
                    id="icon_s"
                    placeholder={data.flower.flowerId}
                  />
                  {errors.status && (
                    <p className="text-red-500">{errors.status.message}</p>
                  )}
                  {/* Display error message */}
                </div>
              )}
            />

            <Controller
              name="roles"
              control={control}
              defaultValue={data?.roles.map((role) => role?._id)}
              render={({ field: { onChange, value, ref } }) => (
                <div className="mt-3">
                  <label className="form-label" htmlFor="icon_s">
                    Roles
                  </label>
                  <Select
                    ref={ref}
                    options={Rolesoptions}
                    value={Rolesoptions.filter((option) =>
                      value?.includes(option.value)
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
            <Controller
              name="status"
              control={control}
              defaultValue={data.status}
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
                  {errors.status && (
                    <p className="text-red-500">{errors.status.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="description"
                  placeholder="Enter Description"
                  type="text"
                  autoComplete="off"
                  register={register}
                  defaultValue={data?.description}
                  error={errors?.description?.message}
                />
              )}
            />

            <Button
              type="submit"
              className="btn btn-dark text-white block w-full text-center mt-4"
            >
              Submit
            </Button>
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

export default EditForm;
