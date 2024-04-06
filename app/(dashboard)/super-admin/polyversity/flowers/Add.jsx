import React from 'react';
import Modal from '@/components/ui/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Textarea from '@/components/ui/Textarea';
import { Controller, useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import Select from 'react-select';

import { useMutation } from "graphql-hooks";
import { CREATE_POLY_FLOWER } from "@/configs/graphql/mutations";
import Button from "@/components/ui/Button";
import { addFlower } from "@/store/flowerReducer";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';

const schema = yup.object({
  title: yup.string().required('Title is Required'),
  status: yup.number().required('Status is Required'),
  description: yup.string().required('Description is Required'),
  flowerId: yup.string().required('Flower Id is Required'),
});

const Add = ({ isModalOpen, setIsModalOpen }) => {
  const [addFlowerMutation] = useMutation(CREATE_POLY_FLOWER);
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

  const onSubmit = async (reqData) => {
    try {
      // console.log('data from role add form->', reqData);
      const { data: mutationData, error } = await addFlowerMutation({
        variables: {
          input: {
            title: reqData.title,
            description: reqData.description,
            flowerId: reqData.flowerId,
            status: reqData.status,
          },
        },
      });

      if (error) {
        throw new Error(error);
      }
      dispatch(addFlower(mutationData.createPolyFlower));
      closeForm();
      reset();
      toast.success('Flower Added Successfully');
    } catch (error) {
      console.error('Error updating flower:', error);
      toast.error('Something went wrong!');
    }
  };
  const onError = (err) => {
    console.log('error from flower add form->', err);
  };

  return (
    <div>
      {isModalOpen ? (
        <Modal
          activeModal={isModalOpen}
          onClose={closeForm}
          title="Add Flower"
          className="max-w-xl pb-4 mt-[100px]"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onError)}>
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <Textinput
                  {...field}
                  label="Title"
                  placeholder="Enter Flower Title"
                  type="text"
                  register={register}
                  disabled={false} // Enable the input
                  autoComplete="off"
                  error={errors.title}
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
                  {/* Display error message */}
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
                  error={errors.description}
                />
              )}
            />

            <Button
              type="submit"
              className="block text-white w-full text-center mt-4  btn btn-dark"
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
