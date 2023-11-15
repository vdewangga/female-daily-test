import { Box, Button, Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";
import { Delete, Edit, ExitToApp, Visibility } from "@material-ui/icons";
import Pagination from "@material-ui/lab/Pagination";
import Skeleton from "@material-ui/lab/Skeleton";
import wrapper from "next-redux-wrapper";
import Router from "next/router";
import React from "react";

import ModalDelete from "../components/ModalDelete";
import ModalEdit from "../components/ModalEdit";
import ModalInsert from "../components/ModalInsert";
import { createStore } from "../store";
import {
  usePostLogoutMutation,
  useGetProfileQuery,
} from "../store/feature/service/loginApiSlice";
import { useGetProductsQuery } from "../store/feature/service/productApiSlice";

const Product = () => {
  const [page, setPage] = React.useState(1);
  const [openModalInsert, setOpenModalInsert] = React.useState(false);
  const [openModalEdit, setOpenModalEdit] = React.useState(0);
  const [openModalDetail, setOpenModalDetail] = React.useState(0);
  const [openModalDelete, setOpenModalDelete] = React.useState(0);

  const { data, isFetching } = useGetProductsQuery({
    parms: {
      _page: page,
      _limit: 10,
    },
  });
  const [postLogout] = usePostLogoutMutation();
  const { data: userProfile, isFetching: loadingGetProfile } =
    useGetProfileQuery();

  const responseData = (data && data.data) || [];

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        boxSizing: "border-box",
        flexDirection: "column",
      }}
    >
      <Box
        style={{
          width: "700px",
          display: "flex",
          gap: "10px",
        }}
      >
        <Typography>
          {!loadingGetProfile ? userProfile[0].email : null}
        </Typography>
        <Button
          style={{
            width: "24px",
            minWidth: "24px",
            padding: 0,
          }}
          onClick={async () => {
            try {
              await postLogout().unwrwap();
              Router.replace("/login");
            } catch (error) {
              Router.replace("/login");
            }
          }}
        >
          <ExitToApp color="secondary" />
        </Button>
      </Box>
      <Box
        style={{
          width: "700px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          rowGap: "20px",
          height: "85vh",
        }}
      >
        <Button
          onClick={() => {
            setOpenModalInsert(true);
          }}
          variant="contained"
          color="primary"
          type="submit"
        >
          Create New Product
        </Button>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell align="right">Memory</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!isFetching ? (
                responseData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.product_name}
                    </TableCell>
                    <TableCell align="right">{row.memory}</TableCell>
                    <TableCell align="right">
                      <Box>
                        <Edit
                          onClick={() => {
                            setOpenModalEdit(row.id);
                          }}
                          color="primary"
                          style={{
                            cursor: "pointer",
                          }}
                        />
                        <Delete
                          onClick={() => {
                            setOpenModalDelete(row.id);
                          }}
                          style={{
                            cursor: "pointer",
                          }}
                          color="secondary"
                        />
                        <Visibility
                          onClick={() => {
                            setOpenModalDetail(row.id);
                          }}
                          style={{
                            cursor: "pointer",
                          }}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <React.Fragment>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Skeleton />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Skeleton />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Skeleton />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton />
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={Math.ceil((data && data.count / 10) || 0)}
          color="primary"
          onChange={(e, value) => setPage(value)}
        />
      </Box>
      <ModalInsert
        open={openModalInsert}
        onClose={() => setOpenModalInsert(false)}
      />
      <ModalEdit
        open={openModalEdit}
        onClose={() => setOpenModalEdit(0)}
        id={openModalEdit}
      />
      {openModalDetail ? (
        <ModalEdit
          open
          onClose={() => setOpenModalDetail(0)}
          id={openModalDetail}
          detail
        />
      ) : null}
      <ModalDelete
        open={openModalDelete}
        onClose={() => setOpenModalDelete(0)}
        id={openModalDelete}
      />
    </Box>
  );
};

export default wrapper(createStore, (state) => ({ state }))(Product);
