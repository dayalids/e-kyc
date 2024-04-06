import React, { useCallback } from "react";
import Modal from "@/components/ui/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textarea from "@/components/ui/Textarea";
import { Controller, useForm } from "react-hook-form";
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";

import { useMutation, useQuery } from "graphql-hooks";
import { CREATE_POLY_GEN_PLAZA } from "@/configs/graphql/mutations";
import Button from "@/components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { LIST_ALL_POLY_FLOWERS_ID } from "@/configs/graphql/queries";
import { setFlowersId } from "@/store/flowerReducer";
import { addGenPlaza } from "@/store/genPlazaReducer";

const schema = yup.object({
  title: yup.string().required("Title is Required"),
  status: yup.number().required("Status is Required"),
  description: yup.string().required("Description is Required"),
  flowerId: yup.string().required("Flower Id is Required"),
  genPlazaId: yup.string().required("Genesis Id is Required"),
});

const Add = ({ isModalOpen, setIsModalOpen }) => {
  const [addGenPlazaMutation] = useMutation(CREATE_POLY_GEN_PLAZA);
  const dispatch = useDispatch();

	const {
		register,
		control,
		reset,
		formState: { errors },
		handleSubmit
	} = useForm({
		resolver: yupResolver(schema),
		mode: 'all'
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

  const { error, loading, data } = useQuery(LIST_ALL_POLY_FLOWERS_ID, {
    onSuccess: (res) => {
      dispatch(setFlowersId(res.data.getAllPolyFlowers));
    },
  }
  );

  const flowerSelector = useCallback((state) => state.flower, []);
  const { flowersId } = useSelector(flowerSelector);

  var assigneeOptionsFlower = flowersId.map((flower) => {
    return {
      value: flower._id,
      label: flower.flowerId,
    };
  });
  
  const onSubmit = async (reqData) => {
    // console.log(reqData);
    try {
      const { data: mutationData } = await addGenPlazaMutation({
        variables: {
          input: {
            title: reqData.title,
            description: reqData.description,
            genPlazaId: reqData.genPlazaId,
            flower: reqData.flowerId,
            status: reqData.status,
          },
        },
      });
      // console.log("Added flower:", mutationData);
      dispatch(addGenPlaza(mutationData.createPolyGenPlaza));
      closeForm();
      reset();
    } catch (error) {
      console.error('Error create Gen plaza:', error);
    }
  };
  const onError = (err) => {
    console.log("Error from gen Plaza->", err);
  };

  return (
    <div>
      {isModalOpen ? (
        <Modal
          activeModal={isModalOpen}
          onClose={closeForm}
          title="Add Genesis Plaza"
          className="max-w-xl pb-4 mt-[100px]"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onError)}>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <Textinput
                  {...field}
                  label="Title"
                  placeholder="Enter Gen plaza Title"
                  type="text"
                  register={register}
                  disabled={false} // Enable the input
                  autoComplete="off"
                  error={errors.title}
                />
              )}
            />
            <Controller
              name="genPlazaId"
              control={control}
              rules={{ required: "Genesis ID is required" }}
              render={({ field }) => (
                <Textinput
                  {...field}
                  label="Gen Plaza ID"
                  placeholder="Enter Genesis plaza ID"
                  type="text"
                  register={register}
                  disabled={false} // Enable the input
                  autoComplete="off"
                  error={errors.genPlazaId}
                />
              )}
            />
            <Controller
              name="flowerId"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="mt-3">
                  <label className="form-label" htmlFor="icon_s">
                    Flower ID
                  </label>
                  <Select
                    options={assigneeOptionsFlower}
                    value={assigneeOptionsFlower.find((c) => c.value === value)}
                    onChange={(val) => onChange(val.value)}
                    isMulti={false}
                    className="react-select"
                    classNamePrefix="select"
                    defaultValue={0}
                    id="icon_s"
                    placeholder={"Select Flower"}
                  />
                  {errors.status && (
                    <p className="text-red-500">{errors.status.message}</p>
                  )}
                  {/* Display error message */}
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
                    defaultValue={0}
                    id="icon_s"
                    placeholder={"Select Status"}
                  />
                  {errors.status && (
                    <p className="text-red-500">{errors.status.message}</p>
                  )}
                  {/* Display error message */}
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
							type='submit'
							className='block text-white w-full text-center mt-4  btn btn-dark'>
							Submit
						</Button>
					</form>
				</Modal>
			) : null}
		</div>
	);
};

export default Add;
