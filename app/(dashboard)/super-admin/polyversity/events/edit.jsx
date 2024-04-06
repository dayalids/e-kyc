import React from 'react';
import { useState, useEffect,useRef } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Textarea from '@/components/ui/Textarea';
import { Controller, useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import Select from 'react-select';
import { UPDATE_EVENT } from '@/configs/graphql/mutations';
import { useMutation } from 'graphql-hooks';
import { useDispatch } from 'react-redux';
import { updateEvents } from '@/store/eventsReducer';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import UploadGetPreSignedUrl, { HandleUpload } from '@/lib/upload';
import { PUT_OBJECT_PRESIGNED_URL_MUTATION } from '@/configs/graphql/mutations';
import Icon from '@/components/ui/Icon';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  reactCount: yup.number().required('React Count is required'),
  viewCount: yup.number().required('View Count is required'),
  owner: yup.string().required('Owner Name is required'),
  groupName: yup.string().required('Group Name is required'),
  url3D: yup.string().required('URL is required'),
  tags: yup.array().required('Tags are required'),
  releaseDate: yup.date().required('Date is required'),
});

const Edit = ({ isUserModalOpen, setIsUserModalOpen, data }) => {
  
  const [preAssigenedUrl, setPreAssigenedUrl] = useState();
  const [File, setFile] = useState('');
  const [Key, setKey] = useState('');
  const hiddenFileInput = useRef(null);
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
  const [updateEventMutation] = useMutation(UPDATE_EVENT);
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };


  const closeForm = () => {
    setIsUserModalOpen(false);
    reset();
  };

  const assigneeOptions = [
    {
      value: 'tag 1',
      label: 'Tag 1',
    },
    {
      value: 'tag 2',
      label: 'Tag 2',
    },
  ];

  const onSubmit = async (reqData) => {
    try {
      if (File) {
        const statusCode = await HandleUpload({
          url: preAssigenedUrl,
          file: File,
          type: File?.type.split('/')[1],
        });
      }
      const { data: mutationData } = await updateEventMutation({
        variables: {
          input: {
            _id: data._id,
            title: reqData.title,
            description: reqData.description,
            reactCount: reqData.reactCount,
            viewCount: reqData.viewCount,
            owner: reqData.owner,
            groupName: reqData.groupName,
            url3D: reqData.url3D,
            tags: reqData.tags,
            releaseDate:reqData.releaseDate,
            image:Key,
          },
        },
      });

      dispatch(updateEvents(mutationData?.updatePolyEvent));
      closeForm();
      reset();
      toast.success('Event Added Successfully');
    } catch (error) {
      console.error('Error updating Event:', error);
      toast.error('Something went wrong!');
    }
  };
  const onError = (errors) => {
    console.log('Form errors', errors);
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
      {isUserModalOpen ? (
        <Modal
          activeModal={isUserModalOpen}
          onClose={closeForm}
          title="Edit Event"
          className="max-w-xl pb-4 mt-[80px]"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onError)}>
            <Controller
              name="title"
              control={control}
              defaultValue={data?.title}
              render={({ field }) => (
                <Textinput
                  {...field}
                  label="Title"
                  placeholder="Enter Title"
                  type="text"
                  register={register}
                  error={errors?.title}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              defaultValue={data?.description}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Description"
                  placeholder="Enter Description"
                  type="text"
                  register={register}
                  error={errors?.description}
                />
              )}
            />

            <Controller
              name="reactCount"
              control={control}
              defaultValue={data?.reactCount}
              render={({ field }) => (
                <Textinput
                  {...field}
                  label="React Count"
                  placeholder="Enter React Count"
                  type="number"
                  register={register}
                  error={errors?.reactCount}
                />
              )}
            />
 <div className="d-flex">
              <div>Image</div>
              <div className="flex items-center w-full h-12  bg-white border-2 rounded my-3">
              <span className='mx-2'>{File ? File.name : data?.Image}</span>
                <Button
                  className="pointer ml-auto flex opacity-70 h-12  btn  text-black bg-slate-300  rounded "
                  onClick={() => {
                    hiddenFileInput.current.click();
                  }}
                  
                >
                  Upload Image
                </Button>

                <input
                  ref={hiddenFileInput}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => handleOnChange(event)}
                />
              </div>
            </div>
            <Controller
              name="viewCount"
              control={control}
              defaultValue={data?.viewCount}
              render={({ field }) => (
                <Textinput
                  {...field}
                  label="View Count"
                  placeholder="Enter View Count"
                  type="number"
                  register={register}
                  error={errors?.viewCount}
                />
              )}
            />

            <Controller
              name="owner"
              control={control}
              defaultValue={data?.owner}
              render={({ field }) => (
                <Textinput
                  {...field}
                  label="Owner Name"
                  placeholder="Enter Owner Name"
                  type="text"
                  register={register}
                  error={errors?.owner}
                />
              )}
            />

            <Controller
              name="groupName"
              control={control}
              defaultValue={data?.groupName}
              render={({ field }) => (
                <Textinput
                  {...field}
                  label="Group Name"
                  placeholder="Enter Group Name"
                  type="text"
                  register={register}
                  error={errors?.groupName}
                />
              )}
            />
            <div className="w-full my-2">
              <p className="text-sm">Release Date</p>
              <Controller
                name="releaseDate"
                control={control}
                defaultValue={data?.releaseDate}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    selected={selectedDate}
                    onChange={(date) => {
                      field.onChange(date);
                      handleDateChange(date);
                    }}
                    dateFormat="dd/MM/yyyy" 
                    placeholderText="Select Date"
                    className="my-2 p-2 border-2 w-full rounded"
                  />
                )}
              />

              {errors.releaseDate && (
                <p className="text-red-500 text-sm">
                  {errors.releaseDate.message}
                </p>
              )}
            </div>
            <Controller
              name="url3D"
              control={control}
              defaultValue={data?.url3D}
              render={({ field }) => (
                <Textinput
                  {...field}
                  label="URL"
                  placeholder="Enter URL"
                  type="text"
                  register={register}
                  error={errors?.url3D}
                />
              )}
            />

            <Controller
              name="tags"
              control={control}
              defaultValue={data?.tags}
              render={({ field: { onChange, value, ref } }) => (
                <div className="mt-3">
                  <label className="form-label" htmlFor="icon_s">
                    Tags
                  </label>
                  <Select
                    ref={ref}
                    options={assigneeOptions}
                    value={assigneeOptions.filter((option) =>
                      value?.includes(option.value)
                    )}
                    onChange={(vals) => onChange(vals.map((val) => val.value))}
                    isMulti={true}
                    className="react-select"
                    classNamePrefix="select"
                    id="icon_s"
                    placeholder={'Select Role'}
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
              className="btn btn-dark text-white block w-full text-center mt-4"
            >
              Submit
            </Button>
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

export default Edit;
