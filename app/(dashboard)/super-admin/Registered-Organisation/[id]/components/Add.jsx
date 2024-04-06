import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textarea from "@/components/ui/Textarea";
// import Select from "@/components/ui/Select";
import { Controller, useForm } from "react-hook-form";
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";
import { useMutation } from "graphql-hooks";
import { CREATE_AVENUE_TYPES } from "@/configs/graphql/mutations";
import Button from "@/components/ui/Button";

const schema = yup.object({
  name: yup.string().required("Name is Required"),
  email: yup.string().email("Invalid email").required("Email is Required"),
  mobile: yup.number("Enter Valid Phone Number").required("Mobile No. is Required"),
});

const Add = ({ isModalOpen, setIsModalOpen }) => {
//   const [createAvenueTypes] = useMutation(CREATE_AVENUE_TYPES);

//   const [inputValues, setInputValues] = useState({
//     name: "",
//     description: "",
//     status: 0,
//   });

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
    // console.log("Data:", data);

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

  return (
    <div>
      {isModalOpen ? (
        <Modal
          activeModal={isModalOpen}
          onClose={closeForm}
          title="Add Student Ambassador"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Textinput
              name="name"
              label="Name"
              type="text"
              placeholder=""
              register={register}
              error={errors?.name}
              autoComplete="off"
            />

            <Textinput
              name="email"
              label="Email ID"
              type="text"
              placeholder=""
              register={register}
              error={errors?.email}
              autoComplete="off"
            />      

            <Textinput
              name="mobile"
              label="Mobile No."
              type="text"
              placeholder=""
              register={register}
              error={errors?.mobile}
              autoComplete="off"
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
            />
            <Button
              text={"Submit"}
              type="submit"
              className = "bg-black-500 text-white w-full py-2 mb-8"
            />
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

export default Add;
