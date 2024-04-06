import React, { useState, useRef } from 'react';
import Modal from '@/components/ui/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import Select from 'react-select';
import { useMutation } from 'graphql-hooks';
import { CREATE_EVENT } from '@/configs/graphql/mutations';
import Button from '@/components/ui/Button';
import { addEvents } from '@/store/eventsReducer';
import Textarea from '@/components/ui/Textarea';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
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

const Add = ({ isModalOpen, setIsModalOpen, userData }) => {
  const [createEventMutation] = useMutation(CREATE_EVENT);
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);
  const [preAssigenedUrl, setPreAssigenedUrl] = useState();
  const [File, setFile] = useState('');
  const [Key, setKey] = useState('');
  const hiddenFileInput = useRef(null);
  const [uploadFileMutation] = useMutation(PUT_OBJECT_PRESIGNED_URL_MUTATION);
  const [showImage, setshowImage] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

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
    reset();
  };

  const assigneeOptions = [
    { value: 'tag1', label: 'Tag 1' },
    { value: 'tag2', label: 'Tag 2' },
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
      const { data: mutationData, error } = await createEventMutation({
        variables: {
          input: {
            title: reqData.title,
            description: reqData.description,
            tags: reqData.tags,
            reactCount: reqData.reactCount,
            viewCount: reqData.viewCount,
            owner: reqData.owner,
            groupName: reqData.groupName,
            url3D: reqData.url3D,
            releaseDate: reqData.releaseDate,
            image: Key,
          },
        },
      });
      dispatch(addEvents(mutationData?.createPolyEvent));
      closeForm();
      
      toast.success('Event Added Successfully');
    } catch (error) {
      console.error('Error adding Event:', error);
      toast.error('Something went wrong!');
    }
  };

  const onError = (error) => {
    console.log('error from Create Events->', error);
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
      {isModalOpen && (
        <Modal
          activeModal={isModalOpen}
          onClose={closeForm}
          title="Create Event"
          className="max-w-xl pb-4 mt-[80px]"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onError)}>
            <Textinput
              name="title"
              label="Title"
              type="text"
              placeholder="Enter Title"
              register={register}
              error={errors?.title}
              autoComplete="off"
              onClick={clearErrors}
            />
            <div className="d-flex">
              <div>Image</div>
              <div className="flex items-center w-full h-12  bg-white border-2 rounded my-3">
                <span className="mx-2">{File ? File.name:""}</span>
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
            <Textarea
              name="description"
              label="Description"
              type="text"
              placeholder="Enter Description"
              register={register}
              error={errors?.description}
              autoComplete="off"
              onClick={clearErrors}
            />

            <Controller
              name="reactCount"
              control={control}
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

            <Controller
              name="viewCount"
              control={control}
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
            <div className="w-full my-2">
              <p className="text-sm">Release Date</p>
              <Controller
                name="releaseDate"
                control={control}
                defaultValue={null}
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
                    showTimeSelect={false}
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
            <Textinput
              name="owner"
              label="Owner Name"
              type="text"
              placeholder="Enter Owner Name"
              register={register}
              error={errors?.owner}
              autoComplete="off"
              onClick={clearErrors}
            />
            <Textinput
              name="groupName"
              label="Group Name"
              type="text"
              placeholder="Enter Group Name"
              register={register}
              error={errors?.groupName}
              autoComplete="off"
              onClick={clearErrors}
            />

            <Textinput
              name="url3D"
              label="Url"
              type="text"
              placeholder="Enter url"
              register={register}
              error={errors?.url3D}
              autoComplete="off"
              onClick={clearErrors}
            />
            <Controller
              name="tags"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="mt-3">
                  <label className="form-label" htmlFor="icon_s">
                    Tags
                  </label>
                  <Select
                    options={assigneeOptions}
                    value={assigneeOptions.filter((option) =>
                      value?.includes(option.value)
                    )}
                    onChange={(vals) => onChange(vals.map((val) => val.value))}
                    isMulti={true}
                    className="react-select"
                    classNamePrefix="select"
                    defaultValue={value}
                    id="icon_s"
                    placeholder={'Select tags'}
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
              className="btn btn-dark text-white block w-full text-center mt-8 mb-4"
            >
              Submit
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Add;
