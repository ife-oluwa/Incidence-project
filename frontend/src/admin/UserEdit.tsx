import { Header } from "../components/Header";
import { Box, Button, TextField, ThemeProvider, Typography, useTheme } from "@mui/material";
import { Formik, Field } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import { tokens } from "../theme";

interface Props {
    id: number;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    first_name?: string;
    last_name?: string;
}

const passwordRegEx = /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/;

const userSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("Invalid email").required("required"),
    password: yup
        .string()
        .matches(passwordRegEx, "Password is not valid.")
        .required("required"),
});




export const UserEdit = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string>('');
    const { id } = useParams();
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const navigate = useNavigate();



    const upDateUser = async (userId: string, values: typeof initialValues) => {
        const token = localStorage.getItem('token');
        const formData = {
            first_name: values.firstName,
            last_name: values.lastName,
            password: values.password,
            email: values.email,
            is_active: values.is_active,
            is_superuser: values.is_superuser
        }
        const response = await fetch(`http://localhost:3000/api/v1/users/${userId}`,
            {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            }
        );
    }

    const deleteUser = (userId: string) => {
        const token = localStorage.getItem('token');
        console.log(userId)
        if (confirm('Are you sure you want to delete this user?') == true) {
            fetch(`http://localhost:3000/api/v1/users/${String(userId)}`,
                {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            )
                .then(response => alert("User Deleted successfully"))
                .catch(error => alert("User not deleted. Error: " + error.message))
        }
    };

    const handleDelete = () => {
        deleteUser(String(id));
        navigate('/users')
    };

    const handleFormSubmit = (values: typeof initialValues) => {
        upDateUser(String(id), values)
    };


    const getUserData = async (userId: string) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const data = await response.json();
        return data;
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUserData(String(id))
                setUser(data);
            } catch (error) {
                setError(String(error));
                throw new Error('Failed to get user data')
            }
        };
        fetchUser()
    }, [id])

    const initialValues = {
        firstName: user ? user.first_name : "",
        lastName: user ? user.last_name : "",
        email: user ? user.email : "",
        password: "",
        is_active: user && user.hasOwnProperty('is_active') ? user.is_active : true,
        is_superuser: user && user.hasOwnProperty('is_superuser') ? user.is_superuser : false,
    };

    return (
        <>
            {user && <Box m="20px">
                <Box>
                    <Header title="Edit User" subtitle="Update a User Profile." />
                    <Box display="flex" justifyContent="end" paddingBottom="10px" alignItems='flex-end'>
                        <ThemeProvider theme={theme}>
                            <Button variant='contained' color="error" onClick={handleDelete}>
                                <DeleteIcon />
                                DELETE USER
                            </Button>
                        </ThemeProvider>
                    </Box>
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
                                            SUBMIT
                                        </Button>
                                    </Box>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Box>
            </Box>}

        </>

    );
};

