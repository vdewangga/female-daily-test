import { Box, Button, Typography } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import React from "react";
import { useForm } from "react-hook-form";

import {
  useDeleteProductMutation,
  useGetDetailProductsQuery,
} from "../store/feature/service/productApiSlice";

const ModalDelete = ({ open, onClose, id }) => {
  const { handleSubmit, reset } = useForm({});

  const [deleteProduct, { error }] = useDeleteProductMutation();
  const { data, isFetching } = useGetDetailProductsQuery({ id });
  const [openModal, setOpenModal] = React.useState(false);

  React.useEffect(() => {
    if (data && data.data && data.data.length > 0 && !isFetching) {
      reset({
        ...data.data[0],
      });
    }
  }, [JSON.stringify(data)]);

  const onSubmit = async (data) => {
    try {
      await deleteProduct({ id }).unwrap();
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
              minHeight: "140px",
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
              Delete Product
            </Typography>

            <form
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "24px",
              }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Typography component="p" style={{ textAlign: "center" }}>
                Are you sure want to delete{" "}
                {data && data.data && data.data[0] && data.data[0].product_name}{" "}
                ?
              </Typography>
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
                  Delete
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

export default ModalDelete;
