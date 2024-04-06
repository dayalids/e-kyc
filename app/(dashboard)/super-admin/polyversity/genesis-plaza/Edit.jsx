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
import { UPDATE_POLY_GEN_PLAZA } from "@/configs/graphql/mutations";
import { useMutation } from "graphql-hooks";
import { useDispatch } from "react-redux";
import { updateGenPlaza } from "@/store/genPlazaReducer";
import { useSelector } from "react-redux";

const schema = yup
  .object({
    title: yup.string().optional("Name is Required"),
    description: yup.string().optional("Description is Required"),
    status: yup.number().optional("Status is Required"),
    flowerId: yup.string().required("Flower id is Required"),
    genPlazaId: yup.string().required("Genplaza Id is Required"),
  })
  .required();

const EditForm = ({ isUserModalOpen, setIsUserModalOpen, data }) => {
  //  console.log("Data->",data);
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

  const [updateGenPlazaMutation] = useMutation(UPDATE_POLY_GEN_PLAZA, {
    onSuccess: (res) => {
      dispatch(updateGenPlaza(res.data.updatePolyGenPlaza));
    },
  });
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

  const flowerSelector = useCallback((state) => state.flower, []);
  const { flowersId } = useSelector(flowerSelector);

  var assigneeOptionsFlower = flowersId.map((flower) => {
    return {
      value: flower._id,
      label: flower.flowerId,
    };
  });

  const onSubmit = async (reqData) => {
    // console.log("reqdata", reqData);
    try {
      const { data: mutationData } = await updateGenPlazaMutation({
        variables: {
          _id: data._id,
          input: {
            title: reqData.title,
            genPlazaId: reqData.genPlazaId,
            description: reqData.description,
            flower: reqData.flowerId,
            status: reqData.status,
          },
        },
      });
      const updatedGenPlaza = {
        ...mutationData.updatePolyGenPlaza,
        flower: { ...reqData.flower },
      };
      // console.log('Updated genplaza:', updatedGenPlaza);
      dispatch(updateGenPlaza(updateGenPlaza));
      closeForm();
      reset();
    } catch (error) {
      console.error('Error updating polyGenPlaza:', error);
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
          title="Edit Genesis Plaza"
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
              name="genPlazaId"
              control={control}
              rules={{ required: 'Genesis ID is required' }}
              defaultValue={data.genPlazaId}
              render={({ field }) => (
                <Textinput
                  {...field}
                  label="Gen Plaza ID"
                  placeholder="Enter Genesis plaza ID"
                  type="text"
                  register={register}
                  disabled={false} // Enable the input
                  autoComplete="off"
                  error={errors.genPlazaId}
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
                    Flower ID
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
