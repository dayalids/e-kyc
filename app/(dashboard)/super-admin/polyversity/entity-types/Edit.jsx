// import React from "react";
// import { useState, useEffect } from "react";
// import Modal from "@/components/ui/Modal";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import Textarea from "@/components/ui/Textarea";
// import { Controller, useForm } from "react-hook-form";
// import Textinput from "@/components/ui/Textinput";
// import Select from "react-select";
// import { UPDATE_ENTITY_TYPE } from "@/configs/graphql/mutations";
// import Button from "@/components/ui/Button";

// const schema = yup
//   .object({
//     name: yup.string().required("Name is Required"),
//     description: yup.string().required("description is Required"),
//     abilityId: yup.string().required("Entity ID is Required"),
//     status: yup.number().required(),
//   })
//   .required();

// const EditForm = ({ isUserModalOpen, setIsUserModalOpen, data }) => {
//   const [selectedOpt, setOption] = useState();
//   console.log("data++++", data);

//   const {
//     register,
//     control,
//     reset,
//     formState: { errors },
//     handleSubmit,
//   } = useForm({
//     resolver: yupResolver(schema),
//     mode: "all",
//   });

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

//   // const [inputValues, setInputValues] = useState({ name: data.name, description: data.description, status: data.status });

//   const closeForm = () => {
//     setIsUserModalOpen(false);
//     reset();
//   };

//   const assigneeOptions = [
//     {
//       value: 1,
//       label: "Active",
//     },
//     {
//       value: 0,
//       label: "InActive",
//     },
//   ];

//   const handleSelectChange = (selectedOption) => {
//     setOption(selectedOption);
//   };

//   const onSubmit = async (reqData) => {
//     console.log("Inside Edit Submit Button from Aility", reqData);
//     const [updateEntityTypes] = useMutation(UPDATE_ENTITY_TYPE);
//     const { inputValues: apiData, error } = await updateEntityTypes({
//       variables: {
//         name: inputValues.name,
//         description: inputValues.description,
//         status: inputValues.status,
//       },
//     });
//     if (error) {
//       console.log(error);
//       throw new Error(error.graphQLErrors[0].message);
//     }
//     console.log("Modal Add:", apiData);
//     console.log(inputValues);
//     closeForm();
//     reset();
//   };

//   return (
//     <div>
//       {isUserModalOpen ? (
//         <Modal
//           activeModal={isUserModalOpen}
//           onClose={closeForm}
//           title="Edit Entity"
//           className="max-w-xl pb-4 "
//         >
//           <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
//             <Textinput
//               name="name"
//               label="name"
//               type="text"
//               placeholder="Enter Name"
//               register={register}
//               error={errors?.name}
//               autoComplete="off"
//             />
//             <Textinput
//               name="entityId"
//               label="Entity Id"
//               placeholder="Enter Entity Id"
//               type="text"
//               register={register}
//               error={errors?.abilityId}
//               autoComplete="off"
//             />

//             <Controller
//               name="Status"
//               control={control}
//               defaultValue={assigneeOptions.find(
//                 (option) => option.value === Number(data.status)
//               )}
//               render={({ field }) => (
//                 <div className="mt-3">
//                   <label className="form-label" htmlFor="icon_s">
//                     Status
//                   </label>
//                   <Select
//                     {...field}
//                     options={assigneeOptions}
//                     // styles={styles}
//                     isMulti={false}
//                     className="react-select"
//                     classNamePrefix="select"
//                     id="icon_s"
//                     // value={assigneeOptions.find(option => option.value === Number(data.status))}
//                     // onChange={(selectedOption) => {
//                     //   field.onChange(selectedOption); // Handle changes and update the form field value
//                     //   handleSelectChange(selectedOption); // Handle changes in your component state
//                     // }}
//                   />
//                 </div>
//               )}
//             />
//             <Textarea
//               name="description"
//               label="description"
//               placeholder="Enter Description"
//               type="text"
//               register={register}
//               error={errors?.description}
//               autoComplete="off"
//             />

//             <Button
//               type="submit"
//               className="btn btn-dark block w-full text-center mt-4"
//             >
//               Submit
//             </Button>
//           </form>
//         </Modal>
//       ) : null}
//     </div>
//   );
// };

// export default EditForm;
