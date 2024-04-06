import React, { useCallback } from "react";

import Modal from "@/components/ui/Modal";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textarea from "@/components/ui/Textarea";

import { Controller, useForm } from "react-hook-form";
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";

import { useMutation } from "graphql-hooks";
import { ADD_ROLE } from "@/configs/graphql/mutations";
import Button from "@/components/ui/Button";
import { useSelector ,useDispatch} from "react-redux";
import { addRole } from "@/store/roleReducer";

const schema = yup.object({
  title: yup.string().required("Name is Required"),
  status: yup.number().required(),
  type: yup.string().required("Type is required"),
  description: yup.string().required("Description is Required"),
  roleId: yup.string().required("RoleId is Required"),
  abilities: yup
    .array()
    .of(yup.string().required())
    .required("Abilities is Required"),
});

const Add = ({ isModalOpen, setIsModalOpen }) => {
  const [addrole] = useMutation(ADD_ROLE);
  const roleSelector = useCallback((state) => state.role, []);
  const { dappOptions, abilitiesOptions } = useSelector(roleSelector);
  const userSelector = useCallback((state) => state.auth, []);
  const { user } = useSelector(userSelector);
  const dispatch = useDispatch();

  const {
    register,
    control,
    reset,
    clearErrors,
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

  const assigneeOptionsType = [
    {
      value: 'custom',
      label: 'Custom',
    },
    {
      value: 'global',
      label: 'Global',
    },
  ];

  const onSubmit = async (reqData) => {
    try {
      const { data: mutationData, error } = await addrole({
        variables: {
          input: {
            title: reqData.title,
            description: reqData.description,
            type: reqData.type,
            roleId: reqData.roleId,
            status: reqData.status,
            abilities: reqData.abilities,
          },
        },
      });
      dispatch(addRole(mutationData.createRole));
      closeForm();
      reset();
    } catch (error) {
      console.error("Error create New Role:", error);
    }
  };
  const onError = (err) => {
    console.log("Error from role add form->", err);
  };

  return (
    <div>
      {isModalOpen ? (
        <Modal
          activeModal={isModalOpen}
          onClose={closeForm}
          title="Add Roles"
          className="max-w-xl pb-4 mt-[100px]"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onError)}>
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
                  disabled={false} // Enable the input
                  autoComplete="off"
                  error={errors?.title}
                />
              )}
            />

            <Controller
              name="roleId"
              control={control}
              render={({ field }) => (
                <Textinput
                  {...field}
                  label="Role ID"
                  placeholder="Enter Role ID"
                  type="text"
                  register={register}
                  disabled={false} // Enable the input
                  autoComplete="off"
                  error={errors?.roleId}
                />
              )}
            />

            {/* <Controller
              name="dapps"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="my-3">
                  <label className="form-label" htmlFor="icon_s">
                    DAPP's
                  </label>
                  <Select
                    options={dappOptions}
                    value={dappOptions.filter((option) =>
                      value.includes(option.value)
                    )} // Add the value prop
                    onChange={(vals) => onChange(vals.map((val) => val.value))}
                    isMulti={true}
                    className="react-select"
                    classNamePrefix="select"
                    id="icon_s"
                    placeholder={"Select Dapp"}
                  />
                </div>
              )}
            /> */}
            <Controller
              name="abilities"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="my-3">
                  <label className="form-label" htmlFor="icon_s">
                    Abilities
                  </label>
                  <Select
                    options={abilitiesOptions}
                    // value={abilitiesOptions.filter((option) =>
                    //   value.includes(option.value)
                    // )}
                    value={assigneeOptions.find((c) => c.value === value)}
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
              name="status"
              control={control}
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
                    defaultValue={1}
                    id="icon_s"
                    placeholder={'Select Status'}
                  />
                </div>
              )}
            />

            <Controller
              name="type"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="mt-3">
                  <label className="form-label" htmlFor="icon_s">
                    Type
                  </label>
                  <Select
                    options={assigneeOptionsType}
                    value={assigneeOptionsType.find((c) => c.value === value)}
                    onChange={(val) => onChange(val.value)}
                    isMulti={false}
                    className="react-select"
                    classNamePrefix="select"
                    defaultValue={0}
                    id="icon_s"
                    placeholder={'Select Type'}
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
                  error={errors?.description}
                />
              )}
            />

            <Button
              type="submit"
              className="block btn btn-dark w-full text-white text-center mt-4"
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
