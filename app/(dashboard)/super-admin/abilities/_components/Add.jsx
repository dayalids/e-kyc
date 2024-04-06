import React from 'react';
import Modal from '@/components/ui/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Textarea from '@/components/ui/Textarea';
import { Controller, useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import Select from 'react-select';

import { useMutation } from 'graphql-hooks';
import { CREATE_ABILITY } from "@/configs/graphql/mutations";
import Button from "@/components/ui/Button";
import useDarkmode from "@/hooks/useDarkMode";
import { addAbility } from "@/store/abilityReducer";
import { useDispatch } from "react-redux";

const schema = yup.object({
  title: yup.string().required("Title is Required"),
  status: yup.number().required("Status is Required"),
  description: yup.string().required("Description is Required"),
  abilityGroup: yup.string(),
  abilityId: yup.string(),
});

const Add = ({ isModalOpen, setIsModalOpen }) => {
  const [addAbilityMutation] = useMutation(CREATE_ABILITY);
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

	const assigneeOptionsAg = [
		{
			value: 'OTH',
			label: 'Other Abilities'
		},
		{
			value: 'GEN',
			label: 'General Abilities'
		},
		{
			value: 'COM',
			label: 'Communication'
		},
		{
			value: 'null',
			label: 'Other'
		}
	];

	const onSubmit = async reqData => {
		try {
			// console.log('data from role add form->', reqData);
			const { data: mutationData } = await addAbilityMutation({
				variables: {
					_id: reqData._id,
					input: {
						title: reqData.title,
						description: reqData.description,
						abilityGroup: reqData.abilityGroup,
						abilityId: reqData.abilityId,
						status: reqData.status
					}
				}
			});

    //   console.log("Updated Ability:", mutationData.createAbility);
      dispatch(addAbility(mutationData.createAbility));
      closeForm();
      reset();
    } catch (error) {
      console.error("Error adding Ablity:", error);
    }
  };
  const onError = (err) => {
    console.log("error from ablity add form->", err);
  };

	return (
		<div>
			{isModalOpen ? (
				<Modal
					activeModal={isModalOpen}
					onClose={closeForm}
					title='Add Ability'
					className='max-w-xl pb-4 mt-[100px]'
					// themeClass='bg-slate-700 dark:bg-slate-700 dark:border-black dark:border-slate-700'
				>
					<form
						autoComplete='off'
						onSubmit={handleSubmit(onSubmit, onError)}>
						<Controller
							name='title'
							control={control}
							rules={{ required: 'Title is required' }}
							render={({ field }) => (
								<Textinput
									{...field}
									label='Title'
									placeholder='Enter Ability Title'
									type='text'
									register={register}
									disabled={false} // Enable the input
									autoComplete='off'
									error={errors.title}
								/>
							)}
						/>
						<Controller
							name='abilityGroup'
							control={control}
							render={({ field: { onChange, value } }) => (
								<div className='mt-3'>
									<label className='form-label' htmlFor='icon_s'>
										Ability Group
									</label>
									<Select
										options={assigneeOptionsAg}
										value={assigneeOptionsAg.find(
											c => c.value === value
										)}
										onChange={val => onChange(val.value)}
										isMulti={false}
										className='react-select'
										classNamePrefix='select'
										id='icon_s'
										placeholder={'Select Ability Group'}
									/>
									{errors.status && (
										<p className='text-red-500'>
											{errors.status.message}
										</p>
									)}
									{/* Display error message */}
								</div>
							)}
						/>
						<Controller
							name='abilityId'
							control={control}
							render={({ field }) => (
								<Textinput
									{...field}
									label='Ability ID'
									placeholder='Enter Ability ID'
									type='text'
									register={register}
									disabled={false} // Enable the input
									autoComplete='off'
									error={errors.abilityId}
								/>
							)}
						/>
						<Controller
							name='status'
							control={control}
							render={({ field: { onChange, value } }) => (
								<div className='mt-3'>
									<label className='form-label' htmlFor='icon_s'>
										Status
									</label>
									<Select
										options={assigneeOptions}
										value={assigneeOptions.find(
											c => c.value === value
										)}
										onChange={val => onChange(val.value)}
										isMulti={false}
										className='react-select'
										classNamePrefix='select'
										defaultValue={0}
										id='icon_s'
										placeholder={'Select Status'}
									/>
									{errors.status && (
										<p className='text-red-500'>
											{errors.status.message}
										</p>
									)}
									{/* Display error message */}
								</div>
							)}
						/>
						<Controller
							name='description'
							control={control}
							render={({ field }) => (
								<Textarea
									{...field}
									label='description'
									placeholder='Enter Description'
									type='text'
									autoComplete='off'
									register={register}
									error={errors.description}
								/>
							)}
						/>

            <Button
              type="submit"
              className="block text-white w-full text-center mt-4  btn btn-dark"
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
