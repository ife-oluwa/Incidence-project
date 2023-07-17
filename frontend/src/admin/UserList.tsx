import React, { FC, useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Box, IconButton, Typography, useTheme, Button, ThemeProvider } from '@mui/material';
import { tokens } from '../theme';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import simpleRestProvider from 'ra-data-simple-rest';
import { Link, useNavigate } from "react-router-dom";
import httpClient from "./authUsers";



interface Props {
    id: number;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    first_name?: string;
    last_name?: string;
}

export const UserList: FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [dataProvider, setDataProvider] = useState<any>(null);
    const [users, setUsers] = useState<Props[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();


    const deleteUser = (userId: string) => {
        const token = localStorage.getItem('token');
        console.log('Clicked')
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



    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Create a dataProvider object using simplerestProvider
                const dataProvider = simpleRestProvider('api/v1', httpClient);
                setDataProvider(dataProvider);

                // Use the dataprovider to retrieve list of users.
                const response = await dataProvider.getList('users', {
                    pagination: { page: 1, perPage: 10 },
                    sort: { field: 'first_name', order: 'ASC' },
                    filter: {}
                });
                setUsers(response.data);
                ;
            } catch (error) {
                setError(String(error));
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);


    const columns = [
        { field: "first_name", headerName: "First Name", flex: 1, cellClassName: "name-column--cell" },
        { field: "last_name", headerName: "Last Name", flex: 1, cellClassName: "name-column--cell" },
        { field: "email", headerName: "Email", flex: 1 },
        {
            field: "is_superuser", headerName: "Access Level", flex: 1, renderCell: ({ row: { is_superuser } }: { row: { is_superuser: boolean } }) => {
                return (
                    <Box
                        width="30%"
                        m="20 auto"
                        p="5px"
                        display='flex'
                        justifyContent="center"
                        bgcolor={
                            is_superuser === true
                                ? colors.greenAccent[600]
                                : colors.greenAccent[700]
                        }
                        borderRadius="4px">
                        {is_superuser === true && <AdminPanelSettingsOutlinedIcon />}
                        {is_superuser === false && <LockOpenOutlinedIcon />}
                        <Typography color={colors.gray[100]} sx={{ ml: "5px" }}>
                            {is_superuser ? "Admin" : "User"}
                        </Typography>
                    </Box >
                )
            }
        },
        {
            field: "Edit", flex: 1, renderCell: (params: any) => {
                return (
                    <Box
                        width="5%"
                        m="10 auto"
                        p="5px"
                        display='flex'
                        justifyContent="center"
                        bgcolor={colors.primary[400]}
                        borderRadius="4px"
                        sx={{
                            backgroundColor: 'transparent !important',
                            ':hover': {
                                color: colors.greenAccent[400],
                                backgroundColor: colors.gray[100]
                            }
                        }}>
                        <Link to={`/users/${params.id}`}>
                            <IconButton>
                                <EditIcon />
                            </IconButton>
                        </Link>
                    </Box >
                )
            }
        }
    ];

    if (loading) {
        return (
            <Box m='20px'>
                <Header title="Users" subtitle="Manage users" />
                <div>Loading...</div>
            </Box>
        )
    }
    if (error) {
        return (
            <Box m='20px'>
                <Header title="Users" subtitle="Manage users" />
                <div>Error: {error}</div>
            </Box>
        )
    }


    return (
        <Box m="20px">
            <Header title="Users" subtitle="Manage users" />
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none"
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none"
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300]
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700]
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400]
                    },
                    '& .MuiDataGrid-footerContainer': {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.gray[100]} !important`
                    },
                    '& .MuiCheckbox-root': {
                        color: `${colors.greenAccent[200]} !important`
                    }
                }}
            >
                <Box display="flex" justifyContent="end" >
                    <ThemeProvider theme={theme}>
                        <Button variant="contained" color="secondary" type="submit" onClick={() => navigate('/add-user')}>
                            ADD USER
                        </Button>
                    </ThemeProvider>
                </Box>
                <DataGrid
                    rows={users}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                />
            </Box>
        </Box>
    )
}