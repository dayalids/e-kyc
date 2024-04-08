import React from 'react';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Textarea from '@/components/ui/Textarea';
import { Controller, useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import Select from 'react-select';
import { UPDATE_ABILITY } from '@/configs/graphql/mutations';
import { useMutation } from 'graphql-hooks';
import { useDispatch } from 'react-redux';
import { updateAbility } from '@/store/abilityReducer';

const schema = yup
  .object({
    title: yup.string().required("Name is Required"),
    // abilityId: yup.string(),
    description: yup.string().required("Description is Required"),
    status: yup.number().required("Status is Required"),
    abilityGroup: yup.string(),
  })
  .required();

const EditForm = ({ isUserModalOpen, setIsUserModalOpen, data }) => {
  // console.log(data);
  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });
  const [updateAbilityMutation] = useMutation(UPDATE_ABILITY);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch the data from your API
    // fetchDataFromAPI().then((apiData) => {
    // Update the form values with the data from the API
    // This assumes that your API data has a structure that matches your form field names.
    reset(data);
  }, [data]);

  const closeForm = () => {
    setIsUserModalOpen(false);
    reset();
  };

  const assigneeOptions = [
    {
      value: 0,
      label: "InActive",
    },
    {
      value: 1,
      label: "Active",
    },
  ];

  const assigneeOptionsAg = [
    {
      value: "OTH",
      label: "Other Abilities",
    },
    {
      value: "GEN",
      label: "General Abilities",
    },
    {
      value: "COM",
      label: "Communication",
    },
    {
      value: "null",
      label: "Other",
    },
  ];

  const onSubmit = async (reqData) => {
    try {
      const { data: mutationData } = await updateAbilityMutation({
        variables: {
          _id: data._id,
          input: {
            title: reqData.title,
            description: reqData.description,
            abilityId:reqData.abilityId,
            abilityGroup: reqData.abilityGroup,
            status: reqData.status,
          },
        },
      });

      // console.log("Updated ability:", mutationData.updateAbility);
      dispatch(updateAbility(mutationData.updateAbility));
      closeForm();
      reset();
    } catch (error) {
      console.error("Error updating ability:", error);
    }
  };
  const onError = (errors) => {
    console.log("Form errors", errors);
  };

  return (
    <div>
      {isUserModalOpen ? (
        <Modal
          activeModal={isUserModalOpen}
          onClose={closeForm}
          title="Edit Ability"
          className="max-w-xl pb-4 mt-[100px]"
          // themeClass='bg-[#4CA1EF] dark:border-b dark:border-slate-700'
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
                  placeholder="Enter Ability Title"
                  type="text"
                  register={register}
                  disabled={false} // Enable the input
                  autoComplete="off"
                  error={errors?.title}
                />
              )}
            />
            <Controller
              name="abilityGroup"
              control={control}
              defaultValue={data?.abilityGroup}
              render={({ field: { onChange, value, ref } }) => (
                <div className="mt-3">
                  <label className="form-label" htmlFor="icon_s">
                    Ability Group
                  </label>
                  <Select
                    ref={ref}
                    options={assigneeOptionsAg}
                    defaultValue={assigneeOptionsAg.filter((option) =>
                      value.includes(option.value)
                    )}
                    placeholder={data?.abilityGroup}
                    onChange={(val) => onChange(val.value)}
                    isMulti={false}
                    className="react-select"
                    classNamePrefix="select"
                    id="icon_s"
                    // placeholder={'Select Ability Group'}
                  />
                  {errors.status && (
                    <p className="text-red-500">{errors.status.message}</p>
                  )}
                  {/* Display error message */}
                </div>
              )}
            />
            <Controller
              name="status"
              control={control}
              defaultValue={assigneeOptions.find(
                (option) => option.value === Number(data.status)
              )}
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
