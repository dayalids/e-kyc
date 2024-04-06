import React from 'react';
import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Textinput from '@/components/ui/Textinput';
import { useForm } from 'react-hook-form';
import StudentAmbassador from './components/StudentAmbassador';
import { useQuery } from 'graphql-hooks';
import {} from '@/configs/graphql/queries';
import SkeletionTable from '@/components/skeleton/Table';

const schema = yup
  .object({
    blockchainChapter: yup.object({
      chapterName: yup.string().required('Chapter Name is required'),
      chairDetails: yup.object({
        name: yup.string().required('Chair name is Required'),
        designation: yup.string().required('Designation is Required'),
        email: yup
          .string()
          .email('Invalid email')
          .required('Email is Required'),
        mobile: yup.string().required('Mobile No. is Required'),
      }),
    }),
  })
  .required();

const BlockchainChapter = ({ entityData }) => {
  const [readonly, setReadOnly] = useState(true);
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
    reset(entityData);
  }, [entityData]);

  return (
    <div>
      <form autoComplete="off">
        <Card className="bg-white rounded-none" bodyClass="p-0">
          <div className="p-6 lg:gap-x-36 gap-x-14 grid md:grid-cols-2 justify-items-center outline-none">
            <div className="w-full">
              <Textinput
                name="blockchainChapter.chapterName"
                label="Chapter Name"
                placeholder="Chapter Name"
                type="text"
                register={register}
                autoComplete="off"
                readonly={readonly}
              />
            </div>
          </div>
          <div className="mb-8 p-6 border-b-2 w-full">
            <h6>Chair Details</h6>
          </div>
          <div className="px-6 lg:gap-x-36 gap-x-14 grid md:grid-cols-2 justify-items-center outline-none">
            <div className="w-full">
              <Textinput
                name="blockchainChapter.chairDetails.name"
                label="Chair Name"
                placeholder="Chair Name"
                type="text"
                register={register}
                autoComplete="off"
                readonly={readonly}
              />
            </div>
            <div className="w-full">
              <Textinput
                name="blockchainChapter.chairDetails.designation"
                label="Designation"
                placeholder="Designation"
                type="text"
                register={register}
                autoComplete="off"
                readonly={readonly}
              />
            </div>
            <div className="w-full">
              <Textinput
                name="blockchainChapter.chairDetails.email"
                label="Email"
                placeholder="Email"
                type="text"
                register={register}
                autoComplete="off"
                readonly={readonly}
              />
            </div>
            <div className="w-full">
              <Textinput
                name="blockchainChapter.chairDetails.mobile"
                label="Mobile"
                placeholder="Mobile"
                type="text"
                register={register}
                autoComplete="off"
                readonly={readonly}
              />
            </div>
          </div>
        </Card>

        <StudentAmbassador entityData={entityData} />
      </form>
    </div>
  );
};

export default BlockchainChapter;
