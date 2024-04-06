import React, { useCallback } from "react";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textarea from "@/components/ui/Textarea";
import { Controller, useForm } from "react-hook-form";
import Textinput from "@/components/ui/Textinput";
import { UPDATE_ROLE } from "@/configs/graphql/mutations";
import Select from "react-select";
import { useMutation } from "graphql-hooks";
import { updateRole } from "@/store/roleReducer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const schema = yup.object({
  title: yup.string().required("Name is Required"),
  description: yup.string().required("Description is Required"),
  abilities: yup
    .array()
    .of(yup.string().required())
    .required("Abilities is Required"),
});

const EditForm = ({ isUserModalOpen, setIsUserModalOpen, data }) => {
  const [updateRoleMutation] = useMutation(UPDATE_ROLE);
  const roleSelector = useCallback((state) => state.role, []);
  const { abilitiesOptions } = useSelector(roleSelector);
  const dispatch = useDispatch();

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

  useEffect(() => {
    // Fetch the data from your API
    // fetchDataFromAPI().then((apiData) => {
    // Update the form values with the data from the API
    // This assumes that your API data has a structure that matches your form field names.
    // });
    reset(data);
  }, [data]);

  const closeForm = () => {
    setIsUserModalOpen(false);
    reset();
  };

  const handleSelectChange = (selectedOption) => {
    setOption(selectedOption);
  };

  
  const onSubmit = async (reqData) => {
    try {
      const { data: mutationData } = await updateRoleMutation({
        variables: {
          _id: data._id,
          input: {
            title: reqData.title,
            description: reqData.description,
            abilities: reqData.abilities,
          },
        },
      });
      // console.log('Added Roles:', mutationData);
      dispatch(updateRole(mutationData.updateRole));
      closeForm();
      reset();
    } catch (error) {
      console.error('Error updating roles:', error);
    }
  };

  return (
    <div>
      {isUserModalOpen ? (
        <Modal
          activeModal={isUserModalOpen}
          onClose={closeForm}
          title="Edit Role"
          className="max-w-xl pb-4 mt-[100px]"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Textinput
                  {...field}
                  label="Title"
                  placeholder="Enter Title"
                  type="text"
                  register={register}
                  disabled={false}
                  autoComplete="off"
                  error={errors?.title}
                />
              )}
            />
            <Controller
              name="abilities"
              control={control}
              defaultValue={data?.abilities.map((ability) => ability._id)}
              render={({ field: { onChange, value, ref } }) => (
                <div className="my-3">
                  <label className="form-label" htmlFor="icon_s">
                    Abilities
                  </label>
                  <Select
                    ref={ref}
                    options={abilitiesOptions}
                    defaultValue={abilitiesOptions.filter((option) =>
                      value.includes(option.value)
                    )}
                    onChange={(vals) => onChange(vals.map((val) => val.value))}
                    isMulti={true}
                    className="react-select"
                    classNamePrefix="select"
                    id="icon_s"
                    placeholder={'Select Abilities'}
                  />
                </div>
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="description"
                  placeholder="Enter Description"
                  type="text"
                  autoComplete="off"
                  register={register}
                  error={errors.description}
                />
              )}
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
