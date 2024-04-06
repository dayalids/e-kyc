import React, { useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import Textinput from '@/components/ui/Textinput';
import { useMutation } from 'graphql-hooks';
import { INVITE_ADMIN_USER } from '@/configs/graphql/mutations';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  ceoemail: yup
    .string()
    .email('Invalid email address')
    .required('Email is Required'),
  signatoryname: yup.string().required('Name is Required'),
  signatorydesignation: yup.string().required('Designation is Required'),
  signatoryemail: yup
    .string()
    .email('Invalid email address')
    .required('Email is Required'),
});

const Add = ({ isModalOpen, setIsModalOpen, userData }) => {
  const [inviteUser] = useMutation(INVITE_ADMIN_USER);

  const {
    register,
    reset,
    clearErrors,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (isModalOpen) {
      reset(userData); // Reset form fields when the modal is opened
    }
  }, [isModalOpen, userData, reset]);

  const closeForm = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (formData) => {
    try {
      const { data: mutationData, error } = await inviteUser({
        variables: {
          input: {
            ceoemail: formData.ceoemail,
            signatoryemail: formData.signatoryemail,
            signatoryname: formData.signatoryname,
            signatorydesignation: formData.signatorydesignation,
          },
        },
      });
      if (error) {
        throw new Error(error);
      }
      toast.success('Details sent successfully');
      closeForm();
      reset();
    } catch (error) {
      console.log('Something went wrong in sending details ', error);
      toast.error('Something went wrong!');
    }
  };

  return (
    <div>
      {isModalOpen && (
        <Modal
          activeModal={isModalOpen}
          onClose={closeForm}
          title="MoU Document Details"
          className="max-w-xl  mt-[100px]"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Textinput
              name="ceoemail"
              label="CEO Email"
              type="text"
              placeholder="Enter Email"
              register={register}
              error={errors?.ceoemail}
              onClick={() => clearErrors()}
            />
            <Textinput
              name="signatoryname"
              label="Signatory Authority Name"
              type="text"
              defaultValue={userData?.signatoryAuthority?.name || ''}
              placeholder="Enter name"
              register={register}
              error={errors?.signatoryname}
              onClick={() => clearErrors()}
            />
             <Textinput
              name="signatorydesignation"
              label="Signatory Authority Designation"
              type="text"
              defaultValue={userData?.signatoryAuthority?.designation || ''}
              placeholder="Enter Designation"
              register={register}
              error={errors?.signatorydesignation}
              onClick={() => clearErrors()}
            />
            <Textinput
              name="signatoryemail"
              label="Signatory Authority Email"
              type="text"
              placeholder="Enter Email"
              defaultValue={userData?.signatoryAuthority?.email || ''}
              register={register}
              error={errors?.signatoryemail}
              onClick={() => clearErrors()}
            />
            <Button
              type="submit"
              className="btn btn-dark text-white block w-full text-center mt-8 mb-2"
            >
              Submit
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Add;
