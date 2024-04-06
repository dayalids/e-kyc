import React, { useRef } from 'react';
import Card from '@/components/ui/Card';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import Textinput from '@/components/ui/Textinput';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from 'graphql-hooks';
import { toast } from 'react-toastify';
import { PUT_OBJECT_PRESIGNED_URL_MUTATION } from '@/configs/graphql/mutations';
import UploadGetPreSignedUrl from '@/lib/upload';
import PdfViewerModal from '@/components/features/PDFViewer/PdfViewerModal';
import { Icon } from '@iconify/react';
import Button from '@/components/ui/Button';
import { GET_OBJECT_QUERY } from '@/configs/graphql/queries';
import Add from './Add'
const schema = yup
  .object({
    status: yup.string().required('status is Required'),
  })
  .required();

  const MouPage = ({ userData,Data }) => {
    const hiddenFileInput = useRef(null);
    const [readonly, setReadOnly] = useState(true);
    const [preAssigenedUrl, setPreAssigenedUrl] = useState();
    const [File, setFile] = useState('');
    const [pdfKey, setPdfKey] = useState(userData?.documentUrl?.key);
    const [uploadFileMutation] = useMutation(PUT_OBJECT_PRESIGNED_URL_MUTATION);
    const [s3BucketUrl, setS3BucketurlUrl] = useState();
    const { loading, data, error } = useQuery(GET_OBJECT_QUERY, {
      variables: { key: userData?.documentUrl?.key },
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
  
    const assigneeOptions = [  
      { value: '0', label: 'Inactive', color: 'red' },
      { value: '1', label: 'Active', color: 'green' },     
      { value: '3', label: 'MoU Raised', color: 'green' },
      { value: '4', label: 'MoU Pending', color: 'blue' },
    ];
  
    
  
    const viewPdfHandler = () => {
      if (s3BucketUrl) {
        toggleModal();
      }
    };
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openForm = () => {
      setIsModalOpen(true);
    };

  const status = 3 //remove this and add Data?.status once api ready

const identity=Data
    return (
      <div>
        <Add
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        userData={identity}
      />
        <form autoComplete="off">
          <Card className="bg-white rounded-none" bodyClass="p-0">
            <div className="md:flex justify-between items-center mb-6 p-6 border-b-2">
              <div>
                <h4 className="card-title">MoU Documents</h4>
              </div>
              <div className="">
                 {status === 3 && ( 
                   <Button
                    text={'Create Document'}
                    className="btn btn-dark text-white h-10 py-2"
                    onClick={() => {
                      openForm();
                    }}
                  />
                 )}
              </div>
            </div>
            <div className="px-6 lg:gap-x-36 gap-x-14 grid md:grid-cols-2 justify-items-center">
              <div className="w-full ">
                <div  >
                  <div className='m-2 items-center flex'>Status</div>
                  <span
                    className="rounded  p-2 my-2 "
                    style={{
                      backgroundColor: assigneeOptions.find((option) => option.value == 3)?.color,//remove hardcode values to Data?.status once api ready
                      color: 'white',  
                    }}
                  >
                    {assigneeOptions.find((option) => option.value == 3)?.label}
                  </span>
                </div>
              </div>
              <div className="d-flex w-full">
                <div>MoU Draft</div>
                <div
                  className={`pointer ${
                    readonly
                      ? 'flex items-center w-full h-12 dark:bg-slate-600 bg-slate-200 rounded my-3'
                      : ' bg-white flex items-center w-full border dark:border-none h-12 dark:bg-slate-900 rounded my-3'
                  }`}
                >
                  <span className=" rounded-md cursor-pointer overflow-hidden text-sm mr-auto ml-3">
                    {File ? File.name : userData?.documentUrl?.originalFileName}
                  </span>
                  <div className="flex mr-4 items-center">
                    <Icon
                      className="h-6 w-6 cursor-pointer text-slate-400"
                      icon="heroicons-outline:eye"
                      onClick={() => viewPdfHandler()}
                    />
                    
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </form>
  
        <PdfViewerModal
          modalOpen={modalOpen}
          pdfUrl={s3BucketUrl}
          toggleModal={toggleModal}
          title={File?.name || userData?.documentUrl?.originalFileName}
        />
      </div>
    );
  };
  
  export default MouPage;
  