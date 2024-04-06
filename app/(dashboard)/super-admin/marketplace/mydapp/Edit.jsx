import React from 'react';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Textarea from '@/components/ui/Textarea';
import { Controller, useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import Select from 'react-select';

const schema = yup
  .object({
    name: yup.string().required('Name is Required'),
    description: yup.string().required('description is Required'),
    permission: yup.string().required(),
    status: yup.number().required(),
  })
  .required();

const EditForm = ({ isUserModalOpen, setIsUserModalOpen, data }) => {
  const [selectedOpt, setOption] = useState();
  // console.log('data++++', data);

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
    reset(data);
    let datavalue = assigneeOptions.find(
      (option) => option.value === Number(data.status)
    );
    setOption(datavalue);
    // console.log('datavalue++++', datavalue, selectedOpt);
    // });
  }, [data]);

  // console.log("selectedOpt++", selectedOpt);
  // console.log(data);

  // const [inputValues, setInputValues] = useState({
  //   name: data.name,
  //   description: data.description,
  //   status: data.status,
  // });

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

  const assigneeOptionsPermission = [
    {
      value: 'Write',
      label: 'Write',
    },
    {
      value: 'Read',
      label: 'Read',
    },
    {
      value: 'Append',
      label: 'Append',
    },
  ];

  const handleSelectChange = (selectedOption) => {
    setOption(selectedOption);
  };

  const onSubmit = async (reqData) => {
    // console.log('Inside Edit Submit Button from Roles', reqData);
    // const [createAvenueTypes] = useMutation(CREATE_AVENUE_TYPES);
    // const { inputValues: apiData, error } = await createAvenueTypes({
    //   variables: {
    //     name: inputValues.name,
    //     description: inputValues.description,
    //     status: inputValues.status
    //   }
    // });
    // if (error) {
    //   console.log(error);
    //   throw new Error(error.graphQLErrors[0].message);

    // }
    // console.log('Modal Add:', apiData);
    // console.log(inputValues);
    closeForm();
    reset();
  };

  return (
    <div>
      {isUserModalOpen ? (
        <Modal
          activeModal={isUserModalOpen}
          onClose={closeForm}
          title="Edit Role"
          className="max-w-xl pb-4 mt-[100px]"
          // themeClass="bg-[#4CA1EF] dark:border-b dark:border-slate-700"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Textinput
              name="name"
              label="permission"
              placeholder="Enter Permission"
              type="text"
              disabled={true}
              register={register}
              error={errors?.name}
              autoComplete="off"
            />
            <Controller
              name="permission"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="mt-3">
                  <label className="form-label" htmlFor="icon_s">
                    Permission
                  </label>
                  <Select
                    options={assigneeOptionsPermission}
                    value={assigneeOptionsPermission.find(
                      (c) => c.value === value
                    )}
                    onChange={(val) => onChange(val.value)}
                    isMulti={false}
                    className="react-select"
                    classNamePrefix="select"
                    defaultValue={0}
                    id="icon_s"
                    placeholder={'Assign permission'}
                  />
                </div>
              )}
            />

            <Controller
              name="status"
              control={control}
              defaultValue={assigneeOptions.find(
                (option) => option.value === Number(data.status)
              )}
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
                </div>
              )}
            />
            <Textarea
              name="description"
              label="description"
              placeholder="Enter Description"
              type="text"
              register={register}
              error={errors?.description}
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
    </div>
  );
};

export default EditForm;
