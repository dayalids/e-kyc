import React from 'react';
import { useState, useEffect, useRef } from 'react';
import Card from '@/components/ui/Card';
 import Textinput from '@/components/ui/Textinput';
  import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Icon } from '@iconify/react';
 import { useMutation, useQuery } from 'graphql-hooks';
import { useForm } from 'react-hook-form';
 import { toast } from 'react-toastify';
import { PUT_OBJECT_PRESIGNED_URL_MUTATION } from '@/configs/graphql/mutations';
import UploadGetPreSignedUrl   from '@/lib/upload';
import ImageViewerModal from '@/components/features/IMAGEviewer/ImageViewerModal';
import { GET_OBJECT_QUERY } from '@/configs/graphql/queries';
 

const schema = yup
  .object({
    name: yup.string().required('Name is Required'),
    type: yup.string().optional(),
    regNumber: yup.string(),
    website: yup.string().required('Website is Required'),
    address: yup.object({
      city: yup.string().required('City is Required'),
      state: yup.string().required('State is Required'),
      pincode: yup.number().required('Pincode is Required'),
      // country: yup.string().required('Country is Required'),
      street: yup.string().required('Street is Required'),
    }),
    systemAdminDetails: yup.object({
      firstName: yup.string().required('First Name is Required'),
      lastName: yup.string().required('Last Name is Required'),
      email: yup.string().email('Invalid email').required('Email is Required'),
      mobile: yup.string().required('Mobile No. is Required'),
    }),
  })
  .required();

const BasicDetails = ({ userData }) => {
    const [readonly, setReadOnly] = useState(true);
   const hiddenFileInput = useRef(null);

   const [File, setFile] = useState('');
   const [uploadFileMutation] = useMutation(PUT_OBJECT_PRESIGNED_URL_MUTATION);

  const [s3BucketUrl, setS3BucketurlUrl] = useState();

  const { loading, data, error } = useQuery(GET_OBJECT_QUERY, {
    variables: { key: userData?.logo },
    onSuccess: (res) => {
      setS3BucketurlUrl(res.data.getObject.url);
    },
  });
 
    
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
    // Fetch the data from your API
    // fetchDataFromAPI().then((apiData) => {
    // Update the form values with the data from the API
    // This assumes that your API data has a structure that matches your form field names.
    reset(userData);
  }, [userData]);

    

 
  const handleChange = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const { key, url } = await UploadGetPreSignedUrl({
        file,
        uploadFileMutation,
      });
      setKey(key);
      setPreAssigenedUrl(url);
    }  
  };

  const allowEdit = () => {
    setReadOnly(!readonly);
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
  const handleFileClick = () => {
    if (!readonly) {
      hiddenFileInput.current.click();
    } else {
      toast.info('Click "Edit" to upload files.');
    }
  };

  return showModal ? (
    <ImageViewerModal
      imageUrl={imageUrl}
      onClose={closeModal}
      title="Logo Preview"
    />
  ) : (
    <div className="pb-6">
      <form autoComplete="off"  >
        <Card className="bg-white rounded-none" bodyClass="p-0">
          <div className="mb-8 p-6 border-b-2 w-full">
            <h6>Organisation Details</h6>
          </div>
          <div className="p-6 lg:gap-x-36 gap-x-14 grid md:grid-cols-2 justify-items-center">
            <div className="w-full">
              <Textinput
                name="name"
                label="Name of Organisation"
                placeholder="Enter Name"
                type="text"
                register={register}
                 readonly={readonly}
              />
            </div>
            <div className="w-full ">
            <Textinput
                name="type"
                label="Organisation Type"
                placeholder="Organisation Type"
                defaultValue={userData.type ? userData.type : ''}
                type="text"
                register={register}
                 readonly={readonly}
              />
            </div>
            <div className="w-full">
              <Textinput
                name="regNumber"
                label="Registration Number(PRN/CRN)"
                placeholder="Enter Registration Number"
                type="text"
                readonly={readonly}
                 register={register}
              />
            </div>
            <div className="w-full">
              <Textinput
                name="website"
                label="Website"
                placeholder="Website"
                type="text"
                register={register}
                  autoComplete="off"
                readonly={readonly}
              />
            </div>
            <div className="d-flex w-full">
              <div>Logo</div>
              <div
                className={`pointer ${
                  readonly
                    ? 'flex items-center w-full h-12 dark:bg-slate-600 bg-slate-200 rounded my-3'
                    : 'bg-white flex items-center w-full border dark:border-none h-12 dark:bg-slate-900 rounded my-3 '
                }`}
              >
                <span className=" rounded-md cursor-pointer overflow-hidden text-sm mr-auto ml-3">
                  {File ? File.name : userData?.logo}
                </span>
                <div className="flex mr-3 items-center">
                  <Icon
                    className="h-6 w-6 cursor-pointer text-slate-400"
                    icon="heroicons-outline:eye"
                    onClick={openModal}
                  />
                  <input
                    ref={hiddenFileInput}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleChange}
                  />
                </div>
                
              </div>
            </div>
          </div>
          <div>
            <div className="mb-8 p-6  border-b-2 w-full">
              <h6> Address Details </h6>
            </div>
            <div className="p-6 lg:gap-x-36 gap-x-14 grid md:grid-cols-2 justify-items-center ">
              <div className="w-full">
                <Textinput
                  name="address.state"
                  label="State"
                  placeholder="Enter state"
                  type="text"
                  register={register}
                   readonly={readonly}
                />
              </div>
              <div className="w-full">
                <Textinput
                  name="address.city"
                  label="City"
                  placeholder="Enter City"
                  type="text"
                  register={register}
                   readonly={readonly}
                />
              </div>
              <div className="w-full">
                <Textinput
                  name="address.street"
                  label="Street"
                  placeholder="Enter Street"
                  type="text"
                  register={register}
                   readonly={readonly}
                />
              </div>
              <div className="w-full">
                <Textinput
                  name="address.pincode"
                  label="Pincode"
                  placeholder="Enter Area PinCode"
                  type="text"
                  register={register}
                   readonly={readonly}
                />
              </div>
            </div>
          </div>

          <div className="mb-8 p-6 border-b-2 w-full">
            <h6>Admin's Details</h6>
          </div>
          <div className="p-6 lg:gap-x-36 gap-x-14 grid md:grid-cols-2 justify-items-center outline-none">
            <div className="w-full">
              <Textinput
                name="systemAdminDetails.firstName"
                label="First Name"
                placeholder="Enter First Name"
                type="text"
                register={register}
                error={errors?.systemAdminDetails?.firstName}
                autoComplete="off"
                readonly={readonly}
                msgTooltip
              />
            </div>
            <div className="w-full">
              <Textinput
                name="systemAdminDetails.lastName"
                label="Last Name"
                placeholder="Enter Last Name"
                type="text"
                register={register}
                 autoComplete="off"
                readonly={readonly}
                msgTooltip
              />
            </div>
            <div className="w-full">
              <Textinput
                name="systemAdminDetails.mobile"
                label="Mobile"
                placeholder="Enter Contact Number"
                type="text"
                register={register}
                 autoComplete="off"
                readonly={readonly}
                msgTooltip
              />
            </div>
            <div className="w-full">
              <Textinput
                name="systemAdminDetails.email"
                label="Email"
                placeholder="Enter Email"
                type="text"
                register={register}
                 autoComplete="off"
                readonly={readonly}
                msgTooltip
              />
            </div>
          </div>
 
        </Card>
      </form>
    </div>
  );
};

export default BasicDetails;
