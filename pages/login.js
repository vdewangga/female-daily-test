import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import wrapper from "next-redux-wrapper";
import Router from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import Input from "../components/Input";
import { createStore } from "../store";
import { usePostLoginMutation } from "../store/feature/service/loginApiSlice";

const Login = () => {
  const [postLogin, { error, isLoading }] = usePostLoginMutation();
  const [open, setOpen] = React.useState(false);
  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().required(),
      })
    ),
  });

  const onSubmit = async (data) => {
    try {
      await postLogin({ ...data }).unwrap();
      Router.push("/product");
    } catch (error) {
      // show toast
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          style={{
            display: "flex",
            height: "100vh",
            width: "100vw",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "16px",
              width: "360px",
            }}
          >
            <Input
              label="Email"
              name="email"
              control={control}
              error={errors["email"]}
            />
            <Button
              disabled={isLoading}
              variant="contained"
              color="primary"
              type="submit"
            >
              Login
            </Button>
          </Box>
        </Box>
      </form>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={open}
        onClose={handleClose}
        message={error && error.data && error.data.message}
      />
    </React.Fragment>
  );
};

export default wrapper(createStore, (state) => ({ state }))(Login);
