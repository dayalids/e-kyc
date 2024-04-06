import React from "react";
import Select, { components } from "react-select";
import Modal from "@/components/ui/Modal";
import { useMutation } from "graphql-hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { CREATE_ABILITY } from "@/configs/graphql/mutations";
import * as yup from "yup";
import Textarea from "@/components/ui/Textarea";
import { Controller, useForm } from "react-hook-form";
import Textinput from "@/components/ui/Textinput";
import { useState, useRef } from "react";
import Icon from "@/components/ui/Icon";
import Image from "@/components/ui/Image";

const schema = yup
  .object({
    Title: yup.string().required("Title is Required"),
    Description: yup.string().required("Description is Required"),
    dapplists: yup.string().required("Dapp lists ID is Required"),
    status: yup.number().required(),
    Websitelink: yup.string().required("Website link is Required"),
  })
  .required();

const Add = ({ isModalOpen, setIsModalOpen }) => {
  const [createAbility] = useMutation(CREATE_ABILITY);

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
    mode: "all",
  });

  const styles = {
    multiValue: (base, state) => {
      return state.data.isFixed ? { ...base, opacity: "0.5" } : base;
    },
    multiValueLabel: (base, state) => {
      return state.data.isFixed
        ? { ...base, color: "#626262", paddingRight: 6 }
        : base;
    },
    multiValueRemove: (base, state) => {
      return state.data.isFixed ? { ...base, display: "none" } : base;
    },
    option: (provided, state) => ({
      ...provided,
      fontSize: "14px",
    }),
  };
  const OptionComponent = ({ data, ...props }) => {
    //const Icon = data.icon;

    return (
      <components.Option {...props}>
        <span className="flex items-center space-x-4">
          <div className="flex-none">
            <div className="h-7 w-7 rounded-full">
              <img
                src={data.image}
                alt=""
                className="w-full h-full rounded-full"
              />
            </div>
          </div>
          <span className="flex-1">{data.label}</span>
        </span>
      </components.Option>
    );
  };

  const status = [
    {
      value: 1,
      label: "Active",
    },
    {
      value: 0,
      label: "InActive",
    },
  ];

  const options = [
    {
      value: "team",
      label: "team",
    },
    {
      value: "low",
      label: "low",
    },
    {
      value: "medium",
      label: "medium",
    },
  ];
  const handleButtonClick = ({ fileType }) => {
    setModalOpen(true);
    // console.log("View Button CLicked");

    if (fileType === "image") {
      setshowImage(true);
    }
  };

  const closeForms = () => {
    setModalOpen(false);
  };
  const closeForm = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (data) => {
    // console.log("Inside Add from Submit Button from Dapp list", data.name);
    const { data: apiData, error } = await createAbility({
      variables: {
        input: {
          name: data.name,
          dapplists: data.abilityId,
          description: data.description,
          status: data.status,
        },
      },
    });
    if (error) {
      // console.log("error", error);
      throw new Error(error.graphQLErrors[0].message);
    }
    // console.log("apidata->", apiData);
    closeForm();
    reset();
  };
  const onerror = (err) => {
    console.log(err);
  };

  return (
    <div>
      {modalOpen ? (
        <Modal
          activeModal={modalOpen}
          onClose={closeForms}
          title="Logo"
          label="logo"
          labelClass="btn-outline-dark"
        >
          {showImage === true ? (
            <Image
              className="w-[100%] h-[100%]"
              src="https://media.threatpost.com/wp-content/uploads/sites/103/2019/09/26105755/fish-1.jpg"
            />
          ) : (
            <p>Logo photo</p>
          )}
        </Modal>
      ) : (
        ""
      )}
      {isModalOpen ? (
        <Modal
          activeModal={isModalOpen}
          onClose={closeForm}
          title="Dapp Lists"
          className="max-w-xl pb-3 "
          themeClass="bg-[#4CA1EF] dark:border-b dark:border-slate-700"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onerror)}>
            <Textinput
              name="Title"
              label="Title"
              type="text"
              register={register}
              placeholder="Title"
              error={errors?.name}
              autoComplete="off"
            />

            <Controller
              name="status"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="mt-2 mb-2">
                  <label className="form-label" htmlFor="icon_s">
                    Type
                  </label>
                  <Select
                    options={status}
                    value={status.find((c) => c.value === value)}
                    onChange={(val) => onChange(val.value)}
                    // styles={styles}
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
            <div className={errors.assign ? "has-error" : ""}>
              <CustomCard
                title={"Logo"}
                fileType={"image"}
                ViewTitle={"logo"}
                handleButtonClick={({ fileType = "image" }) =>
                  handleButtonClick({ fileType })
                }
              />
            </div>
            <div className="mt-3">
            <Textarea
              name="Website link"
              label="Website link"
              placeholder="Enter website link"
              type="link"
              register={register}
              error={errors?.Websitelink}
            />
            </div>
            <div  className="mt-3 mb-3">
            <label className="form-label " htmlFor="icon_s">
              Tag
            </label>
            <Controller
              name="Role"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={options}
                  styles={styles}
                  className="react-select"
                  classNamePrefix="select"
                  isMulti
                  id="icon_s"
                />
              )}
            />
            {errors.assign && (
              <div className=" mt-2  text-danger-500 block text-sm">
                {errors.tags?.message || errors.tags?.label.message}
              </div>
            )}
            </div>
            <div  className="">
            <Textarea
              name="description"
              label="description"
              placeholder="Enter description"
              type="text"
              register={register}
              error={errors?.Description}
              autoComplete="off"
            />
            </div>
            <button
              type="submit"
              className=" btn bg-[#4CA1EF] text-white  text-center block w-full mt-3 mb-2"
            >
              Submit
            </button>
          </form>
        </Modal>
      ) : null}
    </div>
  );
};
const CustomCard = ({ title,  handleButtonClick }) => {
  return (
   
      <div className="d-flex  mt-4">
        <h3 className="text-sm">{title}</h3>
        <div className=" flex mt-3 logo-area  ">
          <div className="mt-1">
            <FileUploader />
          </div>
          <div>
            <button className="pointer  mx-2" onClick={handleButtonClick}>
              <Icon className="h-8 w-8" icon="heroicons-outline:eye"></Icon>
            </button>
          </div>
        </div>
      </div>
    
  );
};

const FileUploader = () => {
  const hiddenFileInput = useRef(null);
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const size = event.target.files[0].size;
    size / (1024 * 1024) > 10 ? alert("size can't exceed 10 MB") : "";
    const fileUploaded = event.target.files[0];
    // console.log("name->", event.target.files[0].name);
    // console.log("type->", event.target.files[0].type);
    // console.log("size->", event.target.files[0].size);

    // console.log(fileUploaded);
  };
  return (
    <>
      <button className="pointer" onClick={handleClick}>
      <img className="h-[50px] w-[50px] pl-3 pr-3 p-2  ring-2 ring-gray-200 rounded-full " src="/assets/images/icon/upload-icon.jpeg" alt="" />
      </button>
      {/* <Button 
        text={"Submit"}
        className = "bg-primary-500 text-white w-full"
        onClick={handleClick}
      /> */}
      <input
        type="file"
        className="hidden"
        ref={hiddenFileInput}
        onChange={handleChange}
      />
    </>
  );
};

export default Add;
