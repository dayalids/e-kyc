import React from "react";

import Modal from "@/components/ui/Modal";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textarea from "@/components/ui/Textarea";
import { Controller, useForm } from "react-hook-form";
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";

import { useMutation } from "graphql-hooks";

import { CREATE_ANNOUNCEMENT } from "@/configs/graphql/mutations";
import Button from "@/components/ui/Button";
const schema = yup
  .object({
    title: yup.string().required("Title is Required"),
    status: yup.number().required(),
    description: yup.string().required("Description is Required"),
  })
  .required();

const Add = ({ isModalOpen, setIsModalOpen }) => {
  const [addAnnouncement] = useMutation(CREATE_ANNOUNCEMENT);

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
  const options = [
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
    // console.log("Inside Add from Submit Button from announcement ->", data);

    const { inputValues: apiData, error } = await addAnnouncement({
      variables: {
        input: {
          title: data.title,
          description: data.description,
          status: data.status,
        },
      },
    });

    if (error) {
      // console.log("error", error);
      throw new Error(error.graphQLErrors[0].message);
    }
    closeForm();
    reset();
  };
  const onerror = (err) => {
    console.log(err);
  };

  return (
    <div>
      {isModalOpen ? (
        <Modal
          activeModal={isModalOpen}
          onClose={closeForm}
          title="Add Announcement"
          className="max-w-xl pb-4 mt-[100px]"
          themeClass="bg-[#4CA1EF] dark:border-b dark:border-slate-700"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onerror)}>
            <Textinput
              name="title"
              label="Title"
              type="text"
              placeholder="Enter Title"
              register={register}
              error={errors?.title}
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
                    options={options}
                    value={options.find((c) => c.value === value)}
                    onChange={(val) => onChange(val.value)}
                    isMulti={false}
                    className="react-select"
                    classNamePrefix="select"
                    defaultValue={0}
                    id="icon_s"
                    placeholder={"Select Status"}
                  />
                </div>
              )}
            />
            <Textarea
              name="description"
              label="description"
              type="text"
              placeholder="description"
              register={register}
              error={errors?.description}
              autoComplete="off"
            />
            <Button
              type="submit"
              className="btn bg-[#4CA1EF] block w-full text-center mt-4"
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
