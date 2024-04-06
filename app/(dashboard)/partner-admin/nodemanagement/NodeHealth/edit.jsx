import React, { useCallback } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import { GET_NODE } from '@/configs/graphql/queries';
import { useMutation, useQuery } from 'graphql-hooks';
import { updateNode } from '@/store/nodeReducer';
import { useDispatch } from 'react-redux';

const schema = yup
  .object({
    name: yup.string().required('Name is Required'),
    eNodeAddress: yup.string().optional('eNode Address is Required'),
    nodeID: yup.string().required('Node ID is Required'),
    entityID: yup.string().required('Node ID is Required'),
    publicKey: yup.string().required('Public Key is Required'),
    type: yup.string().required('Type is Required'),
    status: yup.number().required('Status is Required'),
  })
  .required();

const EditForm = ({ isUserModalOpen, setIsUserModalOpen, data }) => {
  // console.log("data->", data);
  const dispatch = useDispatch();

  const [getNodeMutation] = useMutation(GET_NODE);

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

  const onSubmit = async (reqData) => {
    // console.log('reqData', reqData);
    try {
      const { data: mutationData } = await getNodeMutation({
        variables: {
          _id: data._id,
          input: {
            name: reqData.name,
            entityID: reqData.entityID,
            eNodeAddress: reqData.eNodeAddress,
            isActive: reqData.isActive ? true : false,
            publicKey: reqData.publicKey,
            nodeID: reqData.nodeID,
            status: reqData.status,
            type: reqData.type,
          },
        },
      });
      dispatch(updateNode(mutationData.updateNode));
      closeForm();
      reset();
    } catch (error) {
      console.error('Error updating node:', error);
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
          title="View Node"
          className="max-w-xl pb-4 mt-[100px]"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onError)}>
            <Textinput
              name="name"
              label="Title"
               type="text"
              register={register}
               defaultValue={data?.name}
              disabled={true}
            />
            <Textinput
              name="eNodeAddress"
              label="eNode Address"
               type="text"
              register={register}
               autoComplete="off"
              defaultValue={data?.eNodeAddress}
              disabled={true}
            />
            <Textinput
              name="nodeID"
              label="Node ID"
               type="text"
              register={register}
               defaultValue={data?.nodeID}
              disabled={true}
            />
            <Textinput
              name="staticIpAddress"
              label="staticIpAddress"
               register={register}
              defaultValue={data?.staticIpAddress}
              disabled={true}
            /> 
            <Textinput
              name="location"
              label="location"
               register={register}
              defaultValue={data?.location}
              disabled={true}
            /> 
            <Textinput
              name="nodeID"
              label="nodeID"
               register={register}
              defaultValue={data?.nodeID}
              disabled={true}
            /> 
             <Textinput
              name="status"
              label="status"
               register={register}
               defaultValue={
                assigneeOptions.find((option) => option.value === data.status)?.label
              }            
               disabled={true}
            /> 
            <Textinput
              name="type"
              label="type"
               register={register}
              defaultValue={data?.type}
              disabled={true}
            />
           
            <Textinput
              name="publicKey"
              label="publicKey"
               register={register}
              defaultValue={data?.publicKey}
              disabled={true}
            />
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

export default EditForm;
