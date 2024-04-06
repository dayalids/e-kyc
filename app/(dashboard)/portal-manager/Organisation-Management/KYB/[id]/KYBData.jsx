import React from 'react';
import Card from '@/components/ui/Card';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import Textinput from '@/components/ui/Textinput';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/Button';
import { useQuery, useMutation } from 'graphql-hooks';
import { useDispatch } from 'react-redux';
import { UPDATE_KYB_STATUS } from '@/configs/graphql/mutations';
import { toast } from 'react-toastify';
import { updateRegisteredEntityKycStatus } from '@/store/registeredEntityReducer';
import PdfViewerModal from '@/components/features/PDFViewer/PdfViewerModal';
import { Icon } from '@iconify/react';
import { GET_OBJECT_QUERY } from '@/configs/graphql/queries';
import { useRouter } from 'next/navigation';
import Add from './components/Add';
import Textarea from '@/components/ui/Textarea';

const schema = yup
  .object({
    kybData: yup.object({
      legalName: yup.string().required('Name is Required'),
      type: yup.string().required('Type is Required'),
      legalAddress: yup.string().required('Address is Required'),
      cinNumber: yup.string().required('Cin is Required'),
    }),
  })
  .required();

const KYBData = ({ userData }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState('');

  const openReviewForm = () => {
    setAction('Review');
    setIsModalOpen(true);
  };

  const openRejectForm = () => {
    setAction('Reject');
    setIsModalOpen(true);
  };

  const [updateKybStatus] = useMutation(UPDATE_KYB_STATUS);
  const [s3BucketUrl, setS3BucketurlUrl] = useState();

  const { loading, data, error } = useQuery(GET_OBJECT_QUERY, {
    variables: { key: userData?.kybData?.cinFile },
    onSuccess: (res) => {
      setS3BucketurlUrl(res.data.getObject.url);
    },
  });

  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen((prevState) => !prevState);
  };

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
  useEffect(() => {
    reset(userData);
  }, [userData]);

  const onSubmit = async ({ status, comment }) => {
    try {
      const { data: mutationData, error } = await updateKybStatus({
        variables: {
          _id: userData?._id,
          input: {
            kybStatus: status,
            kybComments: [
              {
                comment: comment,
              },
            ],
          },
        },
      });

      if (error) throw new Error(error);
      // console.log('kyb status', mutationData.updateKYBStatus);
      dispatch(updateRegisteredEntityKycStatus(mutationData?.updateKYBStatus));
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

  const viewPdfHandler = () => {
    if (s3BucketUrl) {
      toggleModal();
    }
  };

  const handleApprove = () => {
    const status = 2;
    const comment = 'Your KYB approved';
    onSubmit({ status, comment });
  };
  return (
    <div>
      <form autoComplete="off">
        <Card className="bg-white rounded-none" bodyClass="p-0">
          <div className="mb-8 p-6 border-b-2 w-full">
            <h6>Organisation Details</h6>
          </div>
          <div className="px-6 lg:gap-x-36 gap-x-14 grid md:grid-cols-2 justify-items-center">
            <div className="w-full ">
              <Textinput
                name="kybData.legalName"
                label="Legal Name of Organisation"
                placeholder="Enter Legal Number"
                type="text"
                register={register}
                error={errors?.kybData?.legalName}
                msgTooltip
                readonly
              />
            </div>
            <div className="w-full">
              <Textinput
                name="kybData.type"
                label="Type"
                placeholder="type"
                type="text"
                error={errors?.kybData?.type}
                register={register}
                msgTooltip
                readonly
              />
            </div>
            <div className="d-flex w-full">
              <div>Cin File</div>
              <div className="pointer flex items-center w-full h-12 dark:bg-slate-600 bg-slate-200 rounded my-3">
                <div className="px-2">
                  {userData?.kybData?.cinFile
                    ? userData?.kybData?.cinFile
                    : 'Not available'}
                </div>
                <div className="flex ml-auto items-center px-2">
                  <Icon
                    className="h-6 w-6 cursor-pointer text-slate-400"
                    icon="heroicons-outline:eye"
                    onClick={() => viewPdfHandler()}
                  />
                  {/* <input
                    ref={hiddenFileInput}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(event) => handleOnChange(event)}
                  /> */}
                </div>
              </div>
            </div>
            <div className="w-full">
              <Textarea
                name="kybData.legalAddress"
                label="Legal Address of Organisation"
                placeholder="address"
                type="text"
                register={register}
                error={errors?.kybData?.legalAddress}
                autoComplete="off"
                readonly
              />
            </div>
            <div className="w-full">
              <Textinput
                name="kybData.cinNumber"
                label="CIN Number"
                placeholder="Cin number"
                type="text"
                register={register}
                error={errors?.kybData?.cinNumber}
                autoComplete="off"
                readonly
              />
            </div>
            <div className="py-6 flex w-full justify-center md:justify-end">
              <div className="w-full flex justify-between   gap-x-2 lg:gap-x-12 ">
                <Button
                  text="Reject"
                  onClick={openRejectForm}
                  className="bg-danger-600 hover:bg-danger-700 text-white py-2 w-2/6"
                />
                <Button
                  text="Review"
                  onClick={openReviewForm}
                  className="bg-[#5356FF] hover:bg-[#1D24CA] text-white py-2 w-2/6"
                />

                <Button
                  text="Approve"
                  onClick={handleApprove}
                  className="btn bg-green-500 hover:bg-green-600 text-white py-2 w-2/6"
                />
              </div>
            </div>
          </div>
        </Card>
      </form>
      <Add
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        userData={userData}
        action={action}
      />

      <PdfViewerModal
        modalOpen={modalOpen}
        pdfUrl={s3BucketUrl}
        toggleModal={toggleModal}
        title={'PDF viewer'}
      />
    </div>
  );
};

export default KYBData;
