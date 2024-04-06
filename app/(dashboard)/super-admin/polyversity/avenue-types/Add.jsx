import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textarea from "@/components/ui/Textarea";
import { Controller, useForm } from "react-hook-form";
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";
import { useMutation } from "graphql-hooks";
// import { CREATE_AVENUE_TYPES } from "@/configs/graphql/mutations";

const schema = yup.object({
  name: yup.string().required("Name is Required"),
  status: yup.number().required("Status is required"),
  description: yup.string().required("Description is Required"),
});

const Add = ({ isModalOpen, setIsModalOpen }) => {
//   const [createAvenueTypes] = useMutation(CREATE_AVENUE_TYPES);

  const [inputValues, setInputValues] = useState({
    name: "",
    description: "",
    status: 0,
  });

  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const closeForm = () => {
    setIsModalOpen(false);
  };

  const assigneeOptions = [
    {
      value: 1,
      label: "Active",
    },
    {
      value: 0,
      label: "InActive",
    },
  ];

  const onSubmit = async (data) => {
    // console.log("InputValues:", inputValues);

    // const { inputValues: apiData, error } = await createAvenueTypes({
    //   variables: {
    //     input: {
    //       name: inputValues.name,
    //       description: inputValues.description,
    //       status: Number(inputValues.status)
    //     },
    //   },
    // });
    // if (error) {
    //   console.log(error);
    //   throw new Error(error.graphQLErrors[0].message);
    // }
    closeForm();
    reset();
  };

  const handleFormatter = (e) => {
    const { name, value } = e.target;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: value,
    }));
  };

  return (
    <div>
      {isModalOpen ? (
        <Modal
          activeModal={isModalOpen}
          onClose={closeForm}
          title="Add Ability Group"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Textinput
              name="name"
              label="name"
              className="mb-3"
              type="text"
              placeholder="Enter Name"
              register={register}
              error={errors?.name}
              autoComplete="off"
              // onChange={handleFormatter}
            />

            <Textarea
              name="description"
              label="description"
              className="mb-3"
              type="text"
              placeholder="Enter Description"
              register={register}
              error={errors?.description}
              autoComplete="off"
              // onChange={handleFormatter}
            />

            <Controller
              name="Status"
              control={control}
              render={({ field }) => (
                <div className="mt-3 mb-8 pb-1 text-sm">
                  <label>
                    Status
                  </label>
                  <Select
                    {...field}
                    options={assigneeOptions}
                    isMulti={false}
                  />
                </div>
              )}
              // onChange={handleFormatter}
            />

            <button
              type="submit"
              className="btn btn-dark block w-full text-center mt-2"
              onClick={onSubmit}
            >
              Submit
            </button>
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

export default Add;