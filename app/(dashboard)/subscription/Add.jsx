import React from "react";
import Modal from "@/components/ui/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textarea from "@/components/ui/Textarea";
import { Controller, useForm } from "react-hook-form";
import Textinput from "@/components/ui/Textinput";
import Select from 'react-select';
import { useMutation, useQuery } from "graphql-hooks";
import { CREATE_SUBSCRIPTION } from "@/configs/graphql/mutations";
import { LIST_ALL_DAPPS_BASIC_DETAIL } from "@/configs/graphql/queries";
import Button from '@/components/ui/Button';
import { useDispatch } from "react-redux";
import { addSubscription } from "@/store/subscriptionReducer";


const schema = yup.object({
  title: yup.string().required('Name is Required'),
  status: yup.number().required('Status is required'),
  price: yup.string().required('price is required'),
  description: yup.string().required('Description is Required'),
  dapps: yup.array().of(yup.string().required()).required('Dapp is Required'),
});

const Add = ({ isModalOpen, setIsModalOpen }) => {
  const [createsubscription] = useMutation(CREATE_SUBSCRIPTION);
  const dispatch = useDispatch();
  const {
    error,
    loading,
    data: DappData,
  } = useQuery(LIST_ALL_DAPPS_BASIC_DETAIL);

  if (error) return <pre>{error.message}</pre>;

  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      dapps: [],
    },
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
  var assigneeOptionsDapp = [];

  if (DappData) {
    assigneeOptionsDapp = DappData.listAllDApps.map((item) => {
      // console.log(item);
      return {
        value: item._id,
        label: item.title,
        // id: item._id
      };
    });
  }

  const onSubmit = async (reqData) => {
    // console.log('Inside ADD Submit Button from subscription', reqData);

    try {
      const { data: mutationData } = await createsubscription({
        variables: {
          input: {
            title: reqData.title,
            description: reqData.description,
            dapps: reqData.dapps,
            price: reqData.price,
            status: reqData.status,
          },
        },
      });
      // console.log('Updated subscription', mutationData);
      dispatch(addSubscription(mutationData.createSubscription));
      closeForm();
      reset();
    } catch (error) {
      console.error('Caught an exception:', error);
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
          title="Create Plan"
          className="max-w-xl pb-4 mt-[100px]"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onError)}>
            <Textinput
              name="title"
              label="Title"
              type="text"
              placeholder="title"
              register={register}
              error={errors?.title}
              autoComplete="off"
            />
            <Textarea
              name="description"
              label="Description"
              type="text"
              placeholder="Write here..."
              register={register}
              error={errors?.description}
              autoComplete="off"
            />
            <Controller
              name="dapps"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="my-3">
                  <label className="form-label" htmlFor="icon_s">
                    DAPP's
                  </label>
                  <Select
                    options={assigneeOptionsDapp}
                    value={assigneeOptionsDapp.filter((option) =>
                      value?.includes(option.value)
                    )} // Add the value prop
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
              label="Price per month"
              type="text"
              placeholder="Enter price"
              register={register}
              error={errors?.price}
              autoComplete="off"
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

            <Button
              type="submit"
              className="block btn btn-dark text-white w-full text-center mt-4 "
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
