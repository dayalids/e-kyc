import React, { useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Textarea from '@/components/ui/Textarea';
import { Controller, useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import Select from 'react-select';
import { useMutation, useQuery } from 'graphql-hooks';
import { CREATE_POLY_PETAL } from '@/configs/graphql/mutations';
import Button from '@/components/ui/Button';
import { useDispatch } from 'react-redux';
import { addPetal } from '@/store/petalReducer';
import { useSelector } from 'react-redux';
import { LIST_ALL_POLY_FLOWERS_ID } from '@/configs/graphql/queries';
import { setFlowersId } from '@/store/flowerReducer';
import { toast } from 'react-toastify';

const schema = yup.object({
  title: yup.string().required('Title is Required'),
  status: yup.number().required('Status is Required'),
  description: yup.string().required('Description is Required'),
  petalId: yup.string().required('Petal Id is Required'),
  flowerId: yup.string().required('Flower selection  is Requird'),
});

const Add = ({ isModalOpen, setIsModalOpen }) => {
  const [addPetalMutation] = useMutation(CREATE_POLY_PETAL);
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
  const { error, loading, data } = useQuery(LIST_ALL_POLY_FLOWERS_ID, {
    onSuccess: (res) => {
      dispatch(setFlowersId(res.data.getAllPolyFlowers));
    },
  });

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
      // console.log(reqData);
      const { data: mutationData } = await addPetalMutation({
        variables: {
          _id: reqData._id,
          input: {
            title: reqData.title,
            description: reqData.description,
            petalId: reqData.petalId,
            flower: reqData.flowerId,
            status: reqData.status,
          },
        },
      });

      // console.log("Updated petal:", mutationData);
      dispatch(addPetal(mutationData.createPolyPetal));
      closeForm();
      reset();
      toast.success('Petals Added Successfully');
    } catch (error) {
      console.error('Error adding petal:', error);
      toast.error('Something went wrong!');
    }
  };
  const onError = (err) => {
    console.log('error from add petal->', err);
	toast.info('Check the input!');
  };

  return (
    <div>
      {isModalOpen ? (
        <Modal
          activeModal={isModalOpen}
          onClose={closeForm}
          title="Add Petals"
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
                  placeholder="Enter Petal Title"
                  type="text"
                  register={register}
                  disabled={false} // Enable the input
                  autoComplete="off"
                  error={errors.title}
                />
              )}
            />
            <Controller
              name="petalId"
              control={control}
              rules={{ required: 'Petal Id is required' }}
              render={({ field }) => (
                <Textinput
                  {...field}
                  label="Petal Id"
                  placeholder="Enter Petal Id"
                  type="text"
                  register={register}
                  disabled={false} // Enable the input
                  autoComplete="off"
                  error={errors.petalId}
                />
              )}
            />
            <Controller
              name="flowerId"
              control={control}
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
                    defaultValue={0}
                    id="icon_s"
                    placeholder={'Select Flower'}
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
