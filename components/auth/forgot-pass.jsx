import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RESET_PASSWORD } from "@/configs/graphql/mutations";
import * as yup from "yup";
import { useMutation } from "graphql-hooks";
import { toast } from "react-toastify";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
  })
  .required();

const ForgotPass = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [ResetPassword] = useMutation(RESET_PASSWORD);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log("forgot password:", data);
    try {
      const { data: apiData, error } = await ResetPassword({
        variables: {
          input: {
            email: data.email,
          },
        },
      });

      if (error) {
        console.error("API call error->:", error);
        setIsLoading(false);
        toast.error(error.graphQLErrors[0].message, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        console.log("success");
        setIsLoading(false);
        toast.success("Email sent successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      console.log("API Results->TOKEN->:", apiData.resetPassword.token);
    } catch (error) {
      setIsLoading(false);
      console.log("Api error");
    }
  };

  const onerror = (err) => {
    console.log(err);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <Textinput
        name="email"
        label="email"
        type="email"
        register={register}
        error={errors.email}
      />

      <button className="btn btn-dark block w-full text-center">
        Send recovery email
      </button>
    </form>
  );
};

export default ForgotPass;
