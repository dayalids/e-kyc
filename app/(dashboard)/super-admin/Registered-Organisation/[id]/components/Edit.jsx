import React from "react";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";

const schema = yup
  .object({
    name: yup.string().required("Name is Required"),
    email: yup.string().email("Invalid email").required("Email is Required"),
    mobile: yup
      .number("Enter Valid Phone Number")
      .required("Mobile No. is Required"),
  })
  .required();
const Edit = ({ isUserModalOpen, setIsUserModalOpen }) => {
  const [selectedOpt, setOption] = useState();
  //   console.log("data++++", data);

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

  //   useEffect(() => {
  //     // Fetch the data from your API
  //     // fetchDataFromAPI().then((apiData) => {
  //     // Update the form values with the data from the API
  //     // This assumes that your API data has a structure that matches your form field names.
  //     reset(data);
  //     let datavalue = assigneeOptions.find(
  //       (option) => option.value === Number(data.status)
  //     );
  //     setOption(datavalue);
  //     console.log("datavalue++++", datavalue, selectedOpt);
  //     // });
  //   }, [data]);

  //   console.log("selectedOpt++", selectedOpt);

  const closeForm = () => {
    setIsUserModalOpen(false);
    reset();
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

  const handleSelectChange = (selectedOption) => {
    setOption(selectedOption);
  };

  const onSubmit = async (reqData) => {
    // console.log("Inside edit Submit Button from evenue-type", reqData);
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
          title="Edit Student Details"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Textinput
              name="name"
              label="name"
              type="text"
              placeholder=""
              register={register}
              error={errors?.name}
              autoComplete="off"
            />

            <Textinput
              name="email"
              label="Email ID"
              placeholder=""
              type="text"
              register={register}
              error={errors?.description}
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
              name="status"
              control={control}
              //   defaultValue={assigneeOptions.find(
              //     (option) => option.value === Number(data.status)
              //   )}
              // remove comment when api is available
              render={({ field: { onChange, value } }) => (
                <div className="mt-3 mb-8 pb-1 text-sm">
                  <label>Status</label>
                  <Select
                    options={assigneeOptions}
                    value={assigneeOptions.find((c) => c.value === value)}
                    onChange={(val) => onChange(val.value)}
                    isMulti={false}
                  />
                </div>
              )}
            />
            <Button
              text={"Submit"}
              type="submit"
              className="bg-black-500 text-white w-full py-2 mb-8"
            />
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

export default Edit;
