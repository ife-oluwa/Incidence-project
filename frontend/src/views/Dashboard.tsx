import { Header } from "../components/Header";
import { Box, Button, useTheme } from "@mui/material";
import { tokens } from "../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DnsIcon from '@mui/icons-material/Dns';
import { Graph } from "./Graph";
import simpleRestProvider from 'ra-data-simple-rest';
import httpClient from '../admin/authUsers';
import StatBox from "../components/StatBox";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import React, { useState, useEffect } from "react";


export const Dashboard: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [mon_x, setMon_x] = useState<string>('');
    const [mon_y, setMon_y] = useState<number>(0);
    const [dataProvider, setDataProvider] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [users, setUsers] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Create a dataProvider object using simpleProvider
                const dataProvider = simpleRestProvider('api/v1', httpClient);
                setDataProvider(dataProvider);

                // Use the data provider to retrieve list of server data.
                const response = await dataProvider.getList('monday', {
                    pagination: { page: 1, perPage: 10 },
                    sort: { field: 'x', order: 'ASC' },
                    filter: {}
                });

                setMon_x(response.data[0].x);
                setMon_y(response.data[0].y);
            } catch (error) {
                setError(String(error));
            } finally {
                setLoading(false)
            }
        };
        fetchData();
    }, [])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Create a dataProvider object using simpleProvider
                const dataProvider = simpleRestProvider('api/v1', httpClient);
                setDataProvider(dataProvider);

                // Use the data provider to retrieve list of server data.
                const response = await dataProvider.getList('users', {
                    pagination: { page: 1, perPage: 10 },
                    sort: { field: 'x', order: 'ASC' },
                    filter: {}
                });

                setUsers(response.data.length);
            } catch (error) {
                setError(String(error));
            } finally {
                setLoading(false)
            }
        };
        fetchUsers();
    }, [])


    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Dashboard" subtitle="Welcome to the Dashboard." />

                <Box>
                    <Button
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.gray[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                        }}
                    >
                        <DownloadOutlinedIcon sx={{ mr: "10px" }} />
                        Download Reports
                    </Button>
                </Box>
            </Box>
            {/* Grids and Charts */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="140px"
                gap="20px"
            >
                {/* Row 1 */}
                <Box sx={{
                    bgcolor: colors.primary[400],
                    gridColumn: 'span 3',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}

                >
                    <StatBox
                        title={mon_y.toString()}
                        subtitle="This Monday"
                        increase={mon_x}
                        icon={
                            <DnsIcon
                                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                            />
                        }
                    />
                </Box>
                <Box
                    sx={{
                        gridColumn: "span 3",
                        backgroundColor: colors.primary[400],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <StatBox
                        title={users.toString()}
                        subtitle="Users"
                        icon={
                            <PersonOutlineIcon
                                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                            />
                        }
                    />
                </Box>
                {/* Row 2 */}
                <Box
                    height="0px" mt="-100px" p="0 0px" ml='-20px'
                    display="flex"
                    sx={{
                        gridColumn: "span 8",
                        gridRow: "span 2",
                        backgroundColor: colors.primary[400],
                    }}
                >
                    <Graph />
                </Box>

            </Box>
        </Box>
    )
};
