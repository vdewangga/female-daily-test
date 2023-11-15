import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Typography } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import Input from "../components/Input";
import { usePostProductsMutation } from "../store/feature/service/productApiSlice";

const ModalInsert = ({ open, onClose }) => {
  const [openModal, setOpenModal] = React.useState(false);
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        product_name: yup.string().required(),
        memory: yup.string().required(),
      })
    ),
  });

  const [postProducts, { error }] = usePostProductsMutation();

  const onSubmit = async (data) => {
    try {
      await postProducts({ ...data }).unwrap();
      setOpenModal(true);
      onClose();
    } catch (error) {
      setOpenModal(true);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            width: "100vw",
            height: "100vh",
            justifyContent: "center",
          }}
        >
          <Paper
            style={{
              width: "400px",
              boxSizing: "border-box",
              minHeight: "320px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "32px",
            }}
          >
            <Typography
              variant="h2"
              style={{ fontSize: "24px", fontWeight: "bold" }}
            >
              New Product
            </Typography>

            <form
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "24px",
              }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                label="Product Name"
                name="product_name"
                control={control}
                error={errors["product_name"]}
              />
              <Input
                label="Memory"
                name="memory"
                control={control}
                error={errors["memory"]}
              />
              <Box style={{ display: "flex", columnGap: "10px" }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  type="submit"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Save
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      </Modal>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={openModal}
        onClose={handleClose}
        message={(error && error.data && error.data.message) || "Success!"}
      />
    </React.Fragment>
  );
};

export default ModalInsert;
