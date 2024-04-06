import React, { useCallback } from "react";
import Modal from "@/components/ui/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textarea from "@/components/ui/Textarea";
import { Controller, useForm } from "react-hook-form";
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";

import { useMutation, useQuery } from "graphql-hooks";
import { CREATE_SPACE} from "@/configs/graphql/mutations";
import Button from "@/components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { LIST_ALL_POLY_FLOWERS_ID, LIST_ALL_POLY_PETALS } from "@/configs/graphql/queries";
import { setFlowersId } from "@/store/flowerReducer";
import { setPetals } from "@/store/petalReducer";
import { addSpaces } from "@/store/spacesReducer";
import { toast } from 'react-toastify';

const schema = yup.object({
  title: yup.string().required('Title is Required'),
  description: yup.string().required('Description is Required'),
  spaceId: yup.string().required('Space is Required'),
  status: yup.number().required('Status is Required'),
  flowerId: yup.string().required('Flower Id is Required'),
  petalId: yup.string().required('Genesis Id is Required'),
  roles: yup.array().of(yup.string().required()).required('Dapp is Required'),
  hexagonId: yup.string().required('Hexagon Id is Required'),
  roles: yup.array().of(yup.string().required()).required('Roles is Required'),
});

const Add = ({ isModalOpen, setIsModalOpen }) => {
  const [addSpaceMutation] = useMutation(CREATE_SPACE);
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

  const {
    error: petalError,
    loading: petalLoading,
    data: petalData,
  } = useQuery(LIST_ALL_POLY_PETALS, {
    onSuccess: (res) => {
      dispatch(setPetals(res.data.listAllPolyPetals));
    },
  });

  const petalSelector = useCallback((state) => state.petal, []);
  const { petals } = useSelector(petalSelector);

  var assigneeOptionsPetal = petals.map((petal) => {
    return {
      value: petal._id,
      label: petal.title,
    };
  });

  const rolesSelector = useCallback((state) => state.role);
  const { roles } = useSelector(rolesSelector);

  const Rolesoptions = roles.map((role) => ({
    value: role._id,
    label: role.title,
  }));

  const onSubmit = async (reqData) => {
    try {
      const { data: mutationData } = await addSpaceMutation({
        variables: {
          input: {
            title: reqData.title,
            description: reqData.description,
            spaceId: reqData.spaceId,
            hexagonId: reqData.hexagonId,
            flower: reqData.flowerId,
            petal: reqData.petalId,
            roles: reqData.roles,
            status: reqData.status,
          },
        },
      });
      // console.log('Added spaces:', mutationData.createSpace);
      dispatch(addSpaces(mutationData.createSpace));
      closeForm();
      reset();
      toast.success('Spaces Added Successfully');
    } catch (error) {
      console.error('Error create Spaces:', error);
      toast.error('Something went wrong');
    }
  };
  const onError = (err) => {
    console.log('Error from spaces->', err);
  };

  return (
    <div>
      {isModalOpen ? (
        <Modal
          activeModal={isModalOpen}
          onClose={closeForm}
          title="Add Spaces"
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
                  placeholder="Enter Space Title"
                  type="text"
                  register={register}
                  disabled={false} // Enable the input
                  autoComplete="off"
                  error={errors.title}
                />
              )}
            />
            <Controller
              name="spaceId"
              control={control}
              rules={{ required: 'Hexagon ID is required' }}
              render={({ field }) => (
                <Textinput
                  {...field}
                  label="Space ID"
                  placeholder="Enter Space ID"
                  type="text"
                  register={register}
                  disabled={false} // Enable the input
                  autoComplete="off"
                  error={errors.spaceId}
                />
              )}
            />
            <Controller
              name="hexagonId"
              control={control}
              rules={{ required: 'Hexagon ID is required' }}
              render={({ field }) => (
                <Textinput
                  {...field}
                  label="Hexagon ID"
                  placeholder="Enter Hexagon ID"
                  type="text"
                  register={register}
                  disabled={false} // Enable the input
                  autoComplete="off"
                  error={errors.hexagonId}
                />
              )}
            />

            <Controller
              name="flowerId"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="mt-3">
                  <label className="form-label" htmlFor="icon_s">
                    Flower
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
              name="petalId"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="mt-3">
                  <label className="form-label" htmlFor="icon_s">
                    Petal
                  </label>
                  <Select
                    options={assigneeOptionsPetal}
                    value={assigneeOptionsPetal.find((c) => c.value === value)}
                    onChange={(val) => onChange(val.value)}
                    isMulti={false}
                    className="react-select"
                    classNamePrefix="select"
                    defaultValue={0}
                    id="icon_s"
                    placeholder={'Select Petal'}
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
              render={({ field: { onChange, value } }) => (
                <div className="mt-3">
                  <label className="form-label" htmlFor="icon_s">
                    Roles
                  </label>
                  <Select
                    options={Rolesoptions}
                    value={Rolesoptions.filter((option) =>
                      value?.includes(option.value)
                    )}
                    onChange={(vals) => onChange(vals.map((val) => val.value))}
                    isMulti={true}
                    className="react-select"
                    classNamePrefix="select"
                    defaultValue={value}
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
