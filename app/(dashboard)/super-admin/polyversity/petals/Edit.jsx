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
import { UPDATE_POLY_PETAL } from "@/configs/graphql/mutations";
import { useMutation } from "graphql-hooks";
import { useDispatch } from "react-redux";
import { updatePetal } from "@/store/petalReducer";
import { useSelector } from "react-redux";

const schema = yup
  .object({
    title: yup.string().optional(),
    description: yup.string().optional(),
    status: yup.number().optional(),
    petalId: yup.string().required(),
    flowerId: yup.string().required(),
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
    mode: 'all',
  });
  const [updatePetalMutation] = useMutation(UPDATE_POLY_PETAL);
  const dispatch = useDispatch();

  useEffect(() => {
    reset(data);
  }, [data]);

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

  const onSubmit = async (reqData) => {
    try {
      const { data: mutationData } = await updatePetalMutation({
        variables: {
          id: data._id,
          input: {
            title: reqData.title,
            description: reqData.description,
            petalId: reqData.petalId,
            flower: reqData.flowerId,
            status: reqData.status,
          },
        },
      });

      // console.log('Updated Petal:', mutationData.updatePetal);
      dispatch(updatePetal(mutationData.updatePolyPetal));
      closeForm();
      reset();
    } catch (error) {
      console.error('Error updating Petal:', error);
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
          title="Edit Petals"
          className="max-w-xl pb-4 mt-[100px]"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onError)}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Textinput
                  {...field}
                  label="Title"
                  placeholder="Enter Petal Title"
                  type="text"
                  register={register}
                  disabled={false} // Enable the input
                  autoComplete="off"
                  error={errors?.title}
                />
              )}
            />
            <Controller
              name="petalId"
              control={control}
              render={({ field }) => (
                <Textinput
                  {...field}
                  label="Peatal Id"
                  placeholder="Enter petal Id "
                  type="text"
                  register={register}
                  disabled={false} // Enable the input
                  autoComplete="off"
                  error={errors?.petalId}
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
                    defaultInputValue={data?.flower?.flowerId}
                    value={assigneeOptionsFlower.find((c) => c.value === value)}
                    onChange={(val) => onChange(val.value)}
                    isMulti={false}
                    className="react-select"
                    classNamePrefix="select"
                    id="icon_s"
                  />
                  {errors['flower.flowerId'] && (
                    <p className="text-red-500">
                      {errors['flower.flowerId'].message}
                    </p>
                  )}
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
