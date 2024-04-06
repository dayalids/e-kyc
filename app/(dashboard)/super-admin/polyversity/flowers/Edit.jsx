import React from "react";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textarea from "@/components/ui/Textarea";
import { Controller, useForm } from "react-hook-form";
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";
import { UPDATE_POLY_FLOWER } from "@/configs/graphql/mutations";
import { useMutation } from "graphql-hooks";
import { useDispatch } from "react-redux";
import { updateFlower } from "@/store/flowerReducer";
import { toast } from 'react-toastify';

const schema = yup
  .object({
    title: yup.string().required("Name is Required"),
    description: yup.string().required("Description is Required"),
    status: yup.number().required("Status is Required"),
    flowerId: yup.string().required("Flower Id is Required"),
  })
  .required();

const EditForm = ({ isUserModalOpen, setIsUserModalOpen, data }) => {
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
  const [updateFlowerMutation] = useMutation(UPDATE_POLY_FLOWER);
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
			label: 'InActive'
		},
		{
			value: 1,
			label: 'Active'
		}
	];

  const onSubmit = async (reqData) => {
    try {
      const { data: mutationData } = await updateFlowerMutation({
        variables: {
          _id: data._id,
          input: {
            title: reqData.title,
            description: reqData.description,
            flowerId: reqData.flowerId,
          },
        },
      });

      // console.log("Updated flower:", mutationData.updatePolyFlower);
      dispatch(updateFlower(mutationData.updatePolyFlower));
      closeForm();
      reset();
      toast.success('Flower Added Successfully');
    } catch (error) {
      console.error("Error updating flower:", error);
       toast.error('Something went wrong!');
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
          title="Edit Role"
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
                  placeholder="Enter Permission Title"
                  type="text"
                  register={register}
                  disabled={false} // Enable the input
                  autoComplete="off"
                  error={errors?.title}
                />
              )}
            />
            <Controller
              name="flowerId"
              control={control}
              rules={{ required: 'Flower ID is required' }}
              render={({ field }) => (
                <Textinput
                  {...field}
                  label="Flower ID"
                  placeholder="Enter Flower ID"
                  type="text"
                  register={register}
                  disabled={false} // Enable the input
                  autoComplete="off"
                  error={errors.flowerId}
                />
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
                    isDisabled={true}
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
