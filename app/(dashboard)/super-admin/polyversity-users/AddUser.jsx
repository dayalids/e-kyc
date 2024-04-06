import React from "react";

import Modal from "@/components/ui/Modal";
import { useMutation } from "graphql-hooks";
import { ADD_POlY_USER } from "@/configs/graphql/mutations";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";
import Button from "@/components/ui/Button";

const schema = yup.object({
  firstname: yup.string().required("Name is Required"),
  lastname: yup.string().required("Ability group Id is required"),
  email: yup.string().email().required("Enter email"),
  role: yup.number().required("Status is required"),
  description: yup.string().required("Description is Required"),
});

const Add = ({ isModalOpen, setIsModalOpen }) => {
  const [createAbilityGroup] = useMutation(ADD_POlY_USER);

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
      value: "Super-Admin",
      label: "Super-Admin",
    },
    {
      value: "Developer-user",
      label: "Developer-user",
    },
    {
      value: "Maintainer",
      label: "Maintainer",
    },
    {
      value: "Recruiter",
      label: "Recuriter",
    },
  ];

  const onSubmit = async (data) => {
    // console.log("working");
    // console.log(data);
    const { inputValues: apiData, error } = await createAbilityGroup({
      variables: {
        input: {
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          role: data.Status.value,
          description: data.description,
        },
      },
    });
    if (error) {
      console.log("error", error);
      throw new Error(error.graphQLErrors[0].message);
    }
    closeForm();
    reset();
  };

  return (
    <div>
      {isModalOpen ? (
        <Modal
          activeModal={isModalOpen}
          onClose={closeForm}
          title="Add Poly User"
          className="max-w-xl pb-4 mt-[100px]"
          themeClass="bg-[#4CA1EF] dark:border-b dark:border-slate-700"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Textinput
              name="firstname"
              label="First Name"
              type="text"
              placeholder="Enter first name"
              register={register}
              error={errors?.firstname}
              autoComplete="off"
            />
            <Textinput
              name="lastname"
              label="Last Name"
              type="text"
              placeholder="Enter last name"
              register={register}
              error={errors?.lastname}
              autoComplete="off"
            />
            <Textinput
              name="email"
              label="Email"
              type="text"
              placeholder="Enter Email"
              register={register}
              error={errors?.email}
              autoComplete="off"
            />

            <Controller
              name="Role"
              control={control}
              render={({ field }) => (
                <div className="mt-3">
                  <label className="form-label" htmlFor="icon_s">
                    Role
                  </label>
                  <Select
                    {...field}
                    options={assigneeOptions}
                    isMulti={false}
                    className="react-select"
                    classNamePrefix="select"
                    id="icon_s"
                  />
                </div>
              )}
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
