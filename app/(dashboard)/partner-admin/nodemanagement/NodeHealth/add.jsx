import React from 'react';
import Modal from '@/components/ui/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import Select from 'react-select';
import { useQuery } from 'graphql-hooks';
import { useMutation } from 'graphql-hooks';
import { CREATE_NODE } from '@/configs/graphql/mutations';
import { LIST_ALL_ENTITIES } from '@/configs/graphql/queries';
import SkeletionTable from '@/components/skeleton/Table';
import Button from '@/components/ui/Button';
import { addNode } from '@/store/nodeReducer';

const schema = yup.object({
  firstname: yup.string().required('Firstname is Required'),
  lastname: yup.string().optional(),
  //entityID: yup.string().required("Entity ID is required"),
  eNodeAddress: yup.string().required('eNode Address is required'),
  status: yup.number().required(),
  nodeID: yup.string().required('Node ID is required'),
  publicKey: yup.string().required('Public Key is required'),
});

const Add = ({ isModalOpen, setIsModalOpen }) => {
  const [createNode] = useMutation(CREATE_NODE);

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

  const assigneeOptionsRole = [
    {
      value: 'Admin',
      label: 'Admin',
    },
    {
      value: 'Moderator',
      label: 'Moderator',
    },
    {
      value: 'User',
      label: 'User',
    },
  ];

  const { error, loading, data } = useQuery(LIST_ALL_ENTITIES);
  if (loading) return <SkeletionTable />;
  if (error) return <pre>{error.message}</pre>;
  // console.log('data+++', data);
  const entityIDOptions = data.listAllEntities.map((obj, index) => ({
    label: obj.entityID,
    value: obj.entityAdmin._id,
  }));
  // console.log('entityIDOptions', typeof entityIDOptions[0].value);

  const onSubmit = async (reqData) => {
    // console.log('Inside ADD Submit Button from create Node', reqData);
    try {
      const { data: apiData, error } = await createNode({
        variables: {
          input: {
            name: reqData.firstname,
            entityID: reqData.entityID,
            isActive: reqData.status == 1 ? true : false,
            type: 'example-type-2',
            status: reqData.status,
            eNodeAddress: reqData.eNodeAddress,
            nodeID: reqData.nodeID,
            publicKey: reqData.publicKey,
          },
        },
      });
      //console.log('Updated subscription', mutationData?.createNode);
      //dispatch(addNode(mutationData?.createNode));
      closeForm();
      reset();
    } catch (error) {
      console.log('Something went wrong', error);
    }
  };
  const onError = (err) => {
    console.log('error from Check Node health->', err);
  };

  return (
    <div>
      {isModalOpen ? (
        <Modal
          activeModal={isModalOpen}
          onClose={closeForm}
          title="Check Node health"
          className="max-w-xl pb-4 mt-[100px]"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onError)}>
            <Textinput
              name="firstname"
              label="Name"
              type="text"
              placeholder="Enter Name"
              register={register}
              error={errors?.firstname}
              autoComplete="off"
              onClick={() => clearErrors()}
            />
            {/* <Textinput
              name="entityID"
              label="Entity ID"
              type="text"
              placeholder="Enter entity ID"
              register={register}
              error={errors?.entityID}
              autoComplete="off"
              onClick={() => clearErrors()}
            /> */}
            <Controller
              name="entityID"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="mt-3 pb-4">
                  <label className="form-label" htmlFor="icon_s">
                    Entity ID
                  </label>
                  <Select
                    options={entityIDOptions}
                    value={entityIDOptions.find((c) => c.value === value)}
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
            <Controller
              name="status"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="mt-3 pb-4">
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
            <Textinput
              name="eNodeAddress"
              label="eNode Address"
              type="text"
              placeholder="Enter eNode Address"
              register={register}
              error={errors?.eNodeAddress}
              autoComplete="off"
              onClick={() => clearErrors()}
            />
            <Textinput
              name="nodeID"
              label="Node ID"
              type="text"
              placeholder="Enter Node ID"
              register={register}
              error={errors?.nodeID}
              autoComplete="off"
              onClick={() => clearErrors()}
            />
            <Textinput
              name="publicKey"
              label="Public Key"
              type="text"
              placeholder="Enter public key"
              register={register}
              error={errors?.publicKey}
              autoComplete="off"
              onClick={() => clearErrors()}
            />
            <Button
              type="submit"
              className="btn btn-dark text-white block w-full text-center mt-8 mb-4"
            >
              Check Node health
            </Button>
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

export default Add;
