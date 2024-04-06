import React, { useCallback } from 'react';
import Select, { components } from 'react-select';
import Modal from '@/components/ui/Modal';
import { useMutation, useQuery } from 'graphql-hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Textarea from '@/components/ui/Textarea';
import { Controller, useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import { useState, useRef } from 'react';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import generateId from '@/lib/generateID';
import { useDispatch } from 'react-redux';
import { addDApp } from '@/store/dappsReducer';
import { toast } from 'react-toastify';
import {
  CREATE_DAPP,
  PUT_OBJECT_PRESIGNED_URL_MUTATION,
} from '@/configs/graphql/mutations';
import { useSelector } from 'react-redux';
import UploadGetPreSignedUrl, { HandleUpload } from '../../../../../lib/upload';

const schema = yup
  .object({
    title: yup.string().required('Title is Required'),
    description: yup.string().required('description is Required'),
    websiteLink: yup.string().optional(),
    type: yup.string().required('Type is required'),
    roles: yup
      .array()
      .of(yup.string().required())
      .required('Roles is Required'),
  })

  .required();

const Add = ({ isModalOpen, setIsModalOpen }) => {
  const dispatch = useDispatch();
  const [preAssigenedUrl, setPreAssigenedUrl] = useState();
  const [File, setFile] = useState('');
  const [Key, setKey] = useState('');

  const hiddenFileInput = useRef(null);
  const [createDappsMutation] = useMutation(CREATE_DAPP);
  const [uploadFileMutation] = useMutation(PUT_OBJECT_PRESIGNED_URL_MUTATION);

  const [showImage, setshowImage] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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

  const styles = {
    multiValue: (base, state) => {
      return state.data.isFixed ? { ...base, opacity: '0.5' } : base;
    },
    multiValueLabel: (base, state) => {
      return state.data.isFixed
        ? { ...base, color: '#626262', paddingRight: 6 }
        : base;
    },
    multiValueRemove: (base, state) => {
      return state.data.isFixed ? { ...base, display: 'none' } : base;
    },
    option: (provided, state) => ({
      ...provided,
      fontSize: '14px',
    }),
  };

  const OptionComponent = ({ data, ...props }) => {
    //const Icon = data.icon;
    return (
      <components.Option {...props}>
        <span className="flex items-center space-x-4">
          <div className="flex-none">
            <div className="h-7 w-7 rounded-full">
              <img
                src={data.image}
                alt=""
                className="w-full h-full rounded-full"
              />
            </div>
          </div>
          <span className="flex-1">{data.label}</span>
        </span>
      </components.Option>
    );
  };

  const status = [
    {
      value: 1,
      label: 'Active',
    },
    {
      value: 0,
      label: 'InActive',
    },
  ];

  const options = [
    {
      value: 'Global',
      label: 'Global',
    },
    {
      value: 'Custom',
      label: 'Custom',
    },
  ];
  const handleButtonClick = ({ fileType }) => {
    setModalOpen(true);
    // console.log('View Button CLicked');

    if (fileType === 'image') {
      setshowImage(true);
    }
  };

  const closeForms = () => {
    setModalOpen(false);
  };
  const closeForm = () => {
    setIsModalOpen(false);
  };

  const rolesSelector = useCallback((state) => state.role);
  const { roles } = useSelector(rolesSelector);

  const Rolesoptions = roles.map((role) => ({
    value: role._id,
    label: role.title,
  }));

  const onSubmit = async (reqData) => {
    // console.log('create dapp reqdata', reqData);
    try {
      if (File) { // Changed 'file' to 'File' here
        const statusCode = await HandleUpload({
          url: preAssigenedUrl,
          file: File,
          type: File?.type.split('/')[1],
        });
        // console.log('Upload response code:', statusCode);
      }
      const { data: apiData, error } = await createDappsMutation({
        variables: {
          input: {
            title: reqData.title,
            description: reqData.description,
            dAppId: generateId(),
            type: reqData.type,
            logo: Key,
            weblink: reqData.weblink,
            roles: reqData.roles,
            status: reqData.status,
          },
        },
      });
  
      if (error) {
        console.log('error', error);
        throw new Error(error.graphQLErrors[0].message);
      }
      dispatch(addDApp(apiData.createDApp));
      reset();
      closeForm();
      toast.success('Dapp Added Successfully');
    } catch (error) {
      console.error('Error during submission:', error);
      toast.error('Error during submission');
    }
  };
  

  const onerror = (err) => {
    console.log('err->', err);
  };

  const handleOnChange = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (!file) {
      toast.warn('Please select file');
      return;
    }

    const { key, url } = await UploadGetPreSignedUrl({
      file,
      uploadFileMutation,
    });
    setFile(file);
    setKey(key);
    setPreAssigenedUrl(url);
  };

  return (
    <div>
      {isModalOpen ? (
        <Modal
          activeModal={isModalOpen}
          onClose={closeForm}
          title="Create dApp"
          className="max-w-xl pb-4 mt-[100px]"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onerror)}>
            <Textinput
              name="title"
              label="Title"
              type="text"
              register={register}
              placeholder="Title"
              error={errors?.title}
              autoComplete="off"
            />
            <Textarea
              name="description"
              label="description"
              placeholder="Write here..."
              type="text"
              register={register}
              error={errors?.description}
              autoComplete="off"
            />

            <div className="flex justify-center items-center w-full h-16 border-dashed border-2 my-4">
              <Button
                className="pointer"
                onClick={() => {
                  hiddenFileInput.current.click();
                }}
              >
                <Icon
                  className="h-6 w-6"
                  icon="heroicons-outline:arrow-up-on-square-stack"
                ></Icon>
              </Button>

              <input
                ref={hiddenFileInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleOnChange(event)}
              />
            </div>

            <Textinput
              name="weblink"
              label="Website Link"
              placeholder="ex:http://"
              type="text"
              register={register}
              error={errors?.websiteLink}
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
                    options={status}
                    value={status.find((c) => c.value === value)}
                    onChange={(val) => onChange(val.value)}
                    // styles={styles}
                    isMulti={false}
                    className="react-select"
                    classNamePrefix="select"
                    defaultValue={0}
                    id="icon_s"
                    placeholder={'Select Type'}
                  />
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
              name="type"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="mt-3">
                  <label className="form-label" htmlFor="icon_s">
                    Type
                  </label>
                  <Select
                    options={options}
                    value={options.find((c) => c.value === value)}
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
            {errors.assign && (
              <div className=" mt-2  text-danger-500 block text-sm">
                {errors.tags?.message || errors.tags?.label.message}
              </div>
            )}

            <Button
              type="submit"
              className="btn btn-dark block w-full text-center mt-4"
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
