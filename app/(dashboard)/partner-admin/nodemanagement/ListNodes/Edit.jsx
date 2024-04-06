import React, { useCallback ,useEffect} from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import Select from 'react-select';
import { UPDATE_NODE } from '@/configs/graphql/mutations';
import { useMutation } from 'graphql-hooks';
import { updateNode } from '@/store/nodeReducer';
import { useDispatch } from 'react-redux';

const schema = yup
  .object({
    name: yup.string().required('title is Required'),
    staticIpAddress: yup.string().required('Public Key is required'),
    eNodeAddress: yup.string().required('eNode Address is required'),
    type: yup.string().required('type of node is required'),
    location: yup.string().required('location is required'),
    status: yup.number().required(),
    nodeID:yup.string().required('nodeID is required'),
    publicKey:yup.string().required('location is required'),

  })
  .required();

const EditForm = ({ isUserModalOpen, setIsUserModalOpen, data }) => {
  const dispatch = useDispatch();
  const [updateNodeMutation] = useMutation(UPDATE_NODE);

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

   useEffect(() => {
    reset(data);
  }, [data]);

  const closeForm = () => {
    setIsUserModalOpen(false);
   ;
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
    // console.log('reqData', reqData);
    try {
      const { data: mutationData } = await updateNodeMutation({
        variables: {
          _id: data._id,
          input: {
            name: reqData.name,
            staticIpAddress: reqData.staticIpAddress,
            eNodeAddress: reqData.eNodeAddress,
            type: reqData.type,
            location: reqData.location,
            status: reqData.status,
            nodeID:reqData.nodeID,
            publicKey:reqData.publicKey,
          },
        },
      });
      dispatch(updateNode(mutationData?.updateNode));
      closeForm();
      reset();
    } catch (error) {
      console.error('Error updating node:', error.message || error);
    }
  };
  return (
    <>
      {isUserModalOpen ? (
        <Modal
          activeModal={isUserModalOpen}
          onClose={closeForm}
          title="Edit Node"
          className="max-w-xl pb-4 mt-[100px]"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
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
              defaultValue={
                typeOptions.find((option) => option.value === data.type)?.value
              }
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
              )}    />
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
              placeholder="Enter nodeID"
              register={register}
              error={errors?.nodeID}
              autoComplete="off"
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
    </>
  );
};

export default EditForm;
