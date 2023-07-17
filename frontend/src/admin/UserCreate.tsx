import { Header } from "../components/Header";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from '../theme'
import { Formik, Field } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { FC, useState, useEffect } from "react";



const passwordRegEx = /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/;



const userSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("Invalid email").required("required"),
    password: yup
        .string()
        .matches(passwordRegEx, "Password is not valid.")
        .required("required"),
    active: yup.boolean(),
    admin: yup.boolean(),
});

export const UserCreate = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        is_active: true,
        is_superuser: false,
    };

    const createUser = async (values: typeof initialValues) => {
        const token = localStorage.getItem("token");
        const formData = {
            first_name: values.firstName,
            last_name: values.lastName,
            password: values.password,
            email: values.email,
            is_active: values.is_active,
            is_superuser: values.is_superuser
        }

        const response = await fetch('http://localhost:3000/api/v1/users',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            }
        );
        alert("User Created")
    }

    const handleFormSubmit = (values: typeof initialValues) => {
        createUser(values);
    };

    return (
        <Box m="20px">
            <Box>
                <Header title="Add User" subtitle="Create a New User Profile." />
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={userSchema}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                }}
                            >
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="First Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstName}
                                    name="firstName"
                                    error={!!touched.firstName && !!errors.firstName}
                                    helperText={touched.firstName && errors.firstName}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Last Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.lastName}
                                    name="lastName"
                                    error={!!touched.lastName && !!errors.lastName}
                                    helperText={touched.lastName && errors.lastName}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    name="email"
                                    error={!!touched.email && !!errors.email}
                                    helperText={touched.email && errors.email}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.password}
                                    name="password"
                                    error={!!touched.password && !!errors.password}
                                    helperText={touched.password && errors.password}
                                    sx={{ gridColumn: "span 2" }}
                                />

                            </Box>
                            <Box mt="20px" display='flex' justifyContent="space-between">
                                <Box display='flex'
                                    justifyContent="flex-start"
                                    alignItems="center"
                                >
                                    <Typography variant="h5" color={colors.greenAccent[400]}>
                                        Active User
                                    </Typography>
                                    &nbsp;
                                    <Field type="checkbox" name="is_active" />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Typography variant="h5" color={colors.greenAccent[400]}>
                                        Admin User
                                    </Typography>
                                    &nbsp;
                                    <Field type="checkbox" name="is_superuser" />
                                </Box>
                                <Box display="flex" justifyContent="end" mt="20px">
                                    <Button type="submit" color="secondary" variant="contained">
                                        CREATE NEW USER
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </Box >
    );
};

