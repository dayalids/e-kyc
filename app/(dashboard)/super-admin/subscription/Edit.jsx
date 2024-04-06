import React, { useCallback } from 'react';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Textarea from '@/components/ui/Textarea';
import { Controller, useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import Select from 'react-select';
import { UPDATE_SUBSCRIPTION } from '@/configs/graphql/mutations';
import { useMutation, useQuery } from 'graphql-hooks';
import { useDispatch } from 'react-redux';
import { updateSubscription } from '@/store/subscriptionReducer';
import { useSelector } from 'react-redux';
 
const schema = yup
  .object({
    title: yup.string().required('Title is Required'),
    description: yup.string().required(),
    price: yup.string().required(),
    dapps: yup.array().of(yup.string().required()).required('Dapp is Required'),
    status: yup.number().required(),
  })
  .required();

const EditForm = ({ isUserModalOpen, setIsUserModalOpen, data }) => {
  const [updateSubscriptionMutation] = useMutation(UPDATE_SUBSCRIPTION);
  const roleSelector = useCallback((state) => state.role, []);
  const { dappOptions } = useSelector(roleSelector);
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

  // useEffect(() => {
  //  // Fetch the data from your API
  //  // fetchDataFromAPI().then((apiData) => {
  //  // Update the form values with the data from the API
  //  // This assumes that your API data has a structure that matches your form field names.
  //  reset(data);
  // }, [data]);

  const closeForm = () => {
    setIsUserModalOpen(false);
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

  const assigneeOptionsDapp = dappOptions?.map((item) => {
    return {
      value: item._id,
      label: item.title,
    };
  });

  const onSubmit = async (reqData) => {
    // console.log("reqData", reqData);
    try {
      const { data: mutationData } = await updateSubscriptionMutation({
        variables: {
          _id: data._id,
          input: {
            title: reqData.title,
            description: reqData.description,
            dapps: reqData.dapps,
            status: reqData.status,
            price: reqData.price,
          },
        },
      });
      dispatch(updateSubscription(mutationData.updateSubscription));
      closeForm();
      reset();
    } catch (error) {
      console.error('Error updating subscription:', error);
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
          title="Edit Subscription"
          className="max-w-xl pb-4 mt-[100px]"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onError)}>
            <Textinput
              name="title"
              label="title"
              placeholder="Edit Title"
              defaultValue={data?.title}
              type="text"
              register={register}
              error={errors?.title}
              autoComplete="off"
            />
            <Textarea
              name="description"
              label="description"
              placeholder="Enter Description"
              type="text"
              register={register}
              error={errors?.description}
              autoComplete="off"
              defaultValue={data?.description}
            />
            <Controller
              name="dapps"
              control={control}
              defaultValue={data?.dapps.map((dapp) => dapp._id)}
              render={({ field: { onChange, value, ref } }) => (
                <div className="my-3">
                  <label className="form-label" htmlFor="icon_s">
                    DAPP's
                  </label>
                  <Select
                    ref={ref}
                    options={assigneeOptionsDapp}
                    defaultValue={assigneeOptionsDapp.filter((option) =>
                      value.includes(option.value)
                    )}
                    onChange={(vals) => onChange(vals.map((val) => val.value))}
                    isMulti={true}
                    className="react-select"
                    classNamePrefix="select"
                    id="icon_s"
                    placeholder={'Select Dapp'}
                  />
                </div>
              )}
            />
            <Textinput
              name="price"
              label="price"
              placeholder="Enter price"
              type="text"
              register={register}
              error={errors?.price}
              defaultValue={data?.price}
            />

            <Controller
              name="status"
              control={control}
              defaultValue={
                assigneeOptions.find((option) => option.value === data.status)
                  ?.value
              }
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
                    id="icon_s"
                    placeholder={'Select Status'}
                  />
                </div>
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
 