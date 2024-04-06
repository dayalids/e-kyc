import React from 'react';
import Modal from '@/components/ui/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
import { UPDATE_KYB_STATUS } from '@/configs/graphql/mutations';
import { useMutation } from 'graphql-hooks';
import { useRouter } from 'next/navigation';
import Textarea from '@/components/ui/Textarea';

const schema = yup.object({
  comments: yup.string().required('Feedback is required'),
});

const Add = ({ userData, isModalOpen, setIsModalOpen, action }) => {
  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const router = useRouter();
  const [updateKybStatus] = useMutation(UPDATE_KYB_STATUS);
  const closeForm = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit = async (reqData) => {
    var status = 0;
    action === 'Reject'
      ? (status = 1)
      : action === 'Review'
      ? (status = 0)
      : '';

    try {
      const { data: mutationData, error } = await updateKybStatus({
        variables: {
          _id: userData?._id,
          input: {
            kybStatus: status,
            kybComments: [
              {
                comment: reqData.comments,
              },
            ],
          },
        },
      });

      if (error) throw new Error(error);
      toast.success('Updated KYB Status', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      router.back();
    } catch (error) {
      console.error('Error updating KybStatus:', error);
      toast.error('Something went wrong', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };
  const onError = (err) => {
    console.log('error from create node form->', err);
  };
  return (
    <div>
      {isModalOpen ? (
        <Modal
          activeModal={isModalOpen}
          onClose={closeForm}
          title="Feedback form"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit, onError)}>
            <div className="w-full h-[20vh]">
              <Textarea
                name="comments"
                label="comments"
                placeholder="Feedback for KYB Correction / Reject reason"
                type="text"
                register={register}
                error={errors?.commentss}
                autoComplete="off"
                className="w-full h-[15vh] indent-1"
              />
            </div>
            <Button
              text={'Submit'}
              type="submit"
              className="bg-black-500 text-white w-full py-2 my-4 "
            />
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

export default Add;
