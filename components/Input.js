import { Box, TextField, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React from "react";
import { Controller } from "react-hook-form";

const Input = ({ control, name, label, error, disabled, loading }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={(field) => (
        <Box>
          {loading ? (
            <Skeleton variant="rect" height={56} />
          ) : (
            <TextField
              fullWidth
              label={label}
              variant="outlined"
              {...field}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={disabled}
            />
          )}
          {error ? (
            <Typography style={{ color: "red" }} component="span">
              {error && error.message}
            </Typography>
          ) : null}
        </Box>
      )}
    />
  );
};

export default Input;
