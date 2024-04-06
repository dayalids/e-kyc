 "use client"
import React, { useEffect, useRef, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import { useMutation, useQuery } from 'graphql-hooks';
import Button from '@/components/ui/Button';
import { useDispatch } from 'react-redux';
import { Icon } from '@iconify/react';
import ImageViewerModal from '@/components/features/IMAGEviewer/ImageViewerModal';
import { GET_OBJECT_QUERY } from '@/configs/graphql/queries';

import {
  PUT_OBJECT_PRESIGNED_URL_MUTATION,
  CREATE_ENTITY_DOCUMENT,
} from '@/configs/graphql/mutations';

import { toast } from 'react-toastify';
import UploadGetPreSignedUrl, { HandleUpload } from '@/lib/upload';
import ImageChooser from '@/components/ui/ImageChooser';

const schema = yup
  .object({
    name: yup.string().required('OrganisationName is Required'),
    signatoryAuthority: yup.object({
      name: yup.string().required('Name is Required'),
      designation: yup.string().required('Designation is required'),
      email: yup
        .string()
        .required('Email is required')
        .email('Invalid email format'),
    }),
  })
  .required();

const Add = ({ isModalOpen, setIsModalOpen, data: userData }) => {
  const dispatch = useDispatch();
  const [createEntityDocument] = useMutation(CREATE_ENTITY_DOCUMENT);
  const [uploadFileMutation] = useMutation(PUT_OBJECT_PRESIGNED_URL_MUTATION);
  const [upload, setUpload] = useState(false);
  const hiddenFileInput = useRef(null);
  const [readonly, setReadOnly] = useState(false);
 
  const [preAssigenedUrl, setPreAssigenedUrl] = useState();
  const [File, setFile] = useState();
  const [Key, setKey] = useState(userData?.logo);
  const [s3BucketUrl, setS3BucketurlUrl] = useState();
 
  const { loading, data, error } = useQuery(GET_OBJECT_QUERY, {
    variables: { key: userData?.logo },
    onSuccess: (res) => {
      setS3BucketurlUrl(res.data.getObject.url);
    },
    skip: !userData?.logo,
  });
 
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
  useEffect(() => {
    reset(userData);
  }, [userData]);
 
  const closeForm = () => {
    setIsModalOpen(false);
  };
 
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
 
  const openModal = () => {
    if (File) {
      const url = URL.createObjectURL(File);
      setImageUrl(url);
      setShowModal(true);
    } else {
      setImageUrl(s3BucketUrl);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleCropedImage = (cropedImage) => {
    setFile(cropedImage);
    handleUpload(cropedImage);
  };

  const handleUpload = async (cropedImage) => {
    if (cropedImage) {
      const { key, url } = await UploadGetPreSignedUrl({
        file: cropedImage,
        uploadFileMutation,
      });
      setKey(key);
      setPreAssigenedUrl(url);
    } else {
      toast.warn('Please upload a png/jpg file.');
    }
  };

  const handleFileClick = () => {
    openCropModal();
  };
  const userId = localStorage.getItem('userId');
  const onSubmit = async (reqData) => {
    try {
      if (File) {
        const statusCode = await HandleUpload({
          url: preAssigenedUrl,
          file: File,
          type: File?.type.split('/')[1],
        });
        console.log('Upload response code:', statusCode);
        if (statusCode !== 200) throw new Error();
      }

      const { data: mutationData, error } = await createEntityDocument({
        variables: {
          input: {
            entityID: userData?._id,
            userID: userId,
            entityName: reqData.name,
            signatoryAuthority: reqData.signatoryAuthority,
            logo: Key,
          },
        },
      });

      if (error) {
        throw new Error(error);
      }
      toast.success('MOU Raised Sucessfully');
      closeForm();
      reset();
    } catch (error) {
      console.error('Caught an exception:', error);
      toast.error('something went wrong');
    }
  };
 
  const onError = (err) => {
    console.log('error from role add form->', err);
  };

  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const openCropModal = () => {
    setIsCropModalOpen(true);
  };
  const closeCropModal = () => {
    setIsCropModalOpen(false);
  };

  return showModal ? (
    <ImageViewerModal
      imageUrl={imageUrl}
      onClose={closeModal}
      title="Logo Preview"
    />
  ) : upload ? (
    <div className="z-10">
      <ImageChooser setCropedImage={handleCropedImage} />
    </div>
  ) : (
    <div>
      {isCropModalOpen ? (
        <Modal
          activeModal={isCropModalOpen}
          onClose={closeCropModal}
          title="Upload Logo"
          className="max-w-xl pb-4 mt-[100px] z-40"
        >
          <div className=" ">
            <ImageChooser setCropedImage={handleCropedImage} />
          </div>
        </Modal>
      ) : isModalOpen ? (
        <Modal
          activeModal={isModalOpen}
          onClose={closeForm}
          title="Raise MOU Request"
          className="max-w-xl pb-4 mt-[100px]"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onError)}>
            <Textinput
              name="name"
              label="Organisation Name"
              type="text"
              placeholder="Enter Organisation Name"
              register={register}
              error={errors?.name}
              autoComplete="off"
            />
            <Textinput
              name="signatoryAuthority.name"
              label="Signatory Authority Name"
              type="text"
              placeholder="Enter Signatory Authority Name"
              register={register}
              error={errors?.signatoryAuthority?.name}
              autoComplete="off"
            />
 
            <Textinput
              name="signatoryAuthority.designation"
              label="Designation of Signatory Authority"
              type="text"
              placeholder="Enter Designation of Signatory Authority"
              register={register}
              error={errors?.signatoryAuthority?.designation}
              autoComplete="off"
            />
            <div className="d-flex w-full">
              <div>Partner Official Logo (650x650 Pixels)</div>
              <div
                className={`pointer ${
                  readonly
                    ? 'flex items-center w-full h-12 dark:bg-slate-600 bg-slate-200 rounded my-3'
                    : 'bg-white flex items-center w-full border dark:border-none h-12 dark:bg-slate-900 rounded my-3 '
                }`}
              >
                <span className=" rounded-md cursor-pointer overflow-hidden text-sm px-2">
                  {File ? File?.name : userData?.logo}
                </span>
                <div className="flex ml-auto items-center">
                  <Icon
                    className="h-6 w-6 cursor-pointer text-slate-400"
                    icon="heroicons-outline:eye"
                    onClick={openModal}
                  />
                  {/* <input
                    ref={hiddenFileInput}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    // onChange={handleChange}
                  /> */}
                </div>
                <div className="flex ml-2">
                  <Button
                    className={`pointer ${
                      readonly
                        ? 'opacity-70 h-12  btn  cursor-not-allowed text-black bg-slate-300 dark:bg-slate-700 dark:text-slate-100  rounded'
                        : ' bg-slate-200 h-12 w-auto dark:bg-slate-700 '
                    }`}
                    onClick={handleFileClick}
                    disabled={readonly}
                  >
                    Browse
                  </Button>
                </div>
              </div>
            </div>
 
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
 