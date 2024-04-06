import React from 'react';
import Modal from '@/components/ui/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import Select from 'react-select';
import { useMutation } from 'graphql-hooks';
import { CREATE_NODE } from '@/configs/graphql/mutations';
import Button from '@/components/ui/Button';
import { addNode } from '@/store/nodeReducer';
import { useDispatch } from 'react-redux';

const schema = yup.object({
  name: yup.string().required('title is Required'),
  staticIpAddress: yup.string().required('staticIpAddress is required'),
  eNodeAddress: yup.string().required('eNode Address is required'),
  type: yup.string().required('type of node is required'),
  location: yup.string().required('location is required'),
  status: yup.number().required(),
  publicKey:yup.string().required('location is required'),
  nodeID:yup.string().required('nodeID is required'),
});

const Add = ({ isModalOpen, setIsModalOpen }) => {
  const [createNode] = useMutation(CREATE_NODE);
  const dispatch = useDispatch();
  const {
    register,
    control,
    reset,
    clearErrors,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const closeForm = () => {
    setIsModalOpen(false);
  };

  const typeOptions = [
    {
      value: 'RPC',
      label: 'RPC',
    },
    {
      value: 'Validator',
      label: 'Validator',
    },
  ];

   
  const assigneeOptions = [
    {
      value: 1,
      label: 'Active',
    },
    {
      value: 0,
      label: 'Inactive',
    },
  ];

  const onSubmit = async (reqData) => {
    // console.log('Inside ADD Submit Button from create Node', reqData);
    try {
      const { data: mutationData, error } = await createNode({
        variables: {
          input: {
            name: reqData.name,
            staticIpAddress: reqData.staticIpAddress,
            eNodeAddress: reqData.eNodeAddress,
            type: reqData.type,
            location: reqData.location,
            status:reqData.status,
            publicKey:reqData.publicKey,
            nodeID:reqData.nodeID,
          },
        },
      });
      dispatch(addNode(mutationData?.createNode));
      closeForm();
      reset();
    } catch (error) {
      console.log('Something went wrong', error);
    }
  };
  const onError = (err) => {
    console.log('error from create node form->', err);
  };

  return (
    <>
      {isModalOpen ? (
        <Modal
          activeModal={isModalOpen}
          onClose={closeForm}
          title="Create Node"
          className="max-w-xl pb-4 mt-[100px]"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onError)}>
            <Textinput
              name="name"
              label="Title"
              type="text"
              placeholder="Enter Title"
              register={register}
              error={errors?.name}
              autoComplete="off"
            />
            <Textinput
              name="staticIpAddress"
              label="staticIpAddress"
              type="text"
              placeholder="Enter staticIpAddress"
              register={register}
              error={errors?.staticIpAddress}
              autoComplete="off"
            />
            <Textinput
              name="eNodeAddress"
              label="eNode Address"
              type="text"
              placeholder="Enter eNode Address"
              register={register}
              error={errors?.eNodeAddress}
              autoComplete="off"
           
            />
            <Controller
              name="type"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="mt-3">
                  <label className="form-label" htmlFor="icon_s">
                    Type
                  </label>
                  <Select
                    options={typeOptions}
                    value={typeOptions.find((c) => c.value === value)}
                    onChange={(val) => onChange(val.value)}
                    isMulti={false}
                    className="react-select"
                    classNamePrefix="select"
                    id="icon_s"
                    placeholder={'Select Type'}
                  />
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
                    id="icon_s"
                    placeholder={'Select Status'}
                  />
                </div>
              )}
            />
              <Textinput
              name="location"
              label="Location"
              type="text"
              placeholder="Enter Location"
              register={register}
              error={errors?.location}
              autoComplete="off"
            />
               <Textinput
              name="publicKey"
              label=" Public Key"
              type="text"
              placeholder="Enter publicKey"
              register={register}
              error={errors?.publicKey}
              autoComplete="off"
            />
            <Textinput
              name="nodeID"
              label="NodeID"
              type="text"
              placeholder="Enter NodeID"
              register={register}
              error={errors?.NodeID}
              autoComplete="off"
            />
          
            <Button
              type="submit"
              className="btn btn-dark text-white block w-full text-center mt-8 mb-4"
            >
              Create Node
            </Button>
          </form>
        </Modal>
      ) : null}
    </>
  );
};

export default Add;
