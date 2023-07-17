import * as React from 'react';
import { ProSidebarProvider, Sidebar, Menu, MenuItem, SubMenu, } from 'react-pro-sidebar';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { tokens } from '../theme';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HistoryIcon from "@mui/icons-material/History";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import authProvider from '../admin/authProvider';

interface Props {
    title: string;
    to: string;
    selected: string;
    setSelected(selected: string): void;
    icon?: React.ReactNode;
}

const Item = ({ title, to, icon, selected, setSelected }: Props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


    return (
        <MenuItem
            active={selected === title}
            rootStyles={{
                '.ps-menu-button': {
                    backgroundColor: colors.primary[400],
                    color: "#868dfb !important",

                    '&:hover': {
                        color: "#6870fa !important",
                        backgroundColor: 'transparent !important',
                    },
                    '&:focus': {
                        color: "#6870fa !important",
                        backgroundColor: 'transparent !important'
                    },
                },
            }}
            onClick={() => setSelected(title)}
            icon={icon}
            component={< Link to={to} />}
        >

            <Typography variant='h4'>{title}</Typography>

        </MenuItem >
    );
};


const Sidenavbar: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [selected, setSelected] = React.useState('Dashboard');
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [user, SetUser] = React.useState('Admin');
    const [userName, SetUsername] = React.useState('');

    const permissions = authProvider.getPermissions().then((role) => {
        setIsAdmin(role === 'admin');
        SetUser(role)
    });

    const username = authProvider.getUsername().then((username) => {
        SetUsername(username);
    });

    return isAdmin ? (
        <ProSidebarProvider>
            <Sidebar defaultCollapsed={isCollapsed} rootStyles={{ display: 'flex', height: '100%', minHeight: '400px' }} backgroundColor={colors.primary[400]}>
                <Menu >
                    {/* LOGO AND MENU ICON */}
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                        rootStyles={{
                            margin: "10px 0 20px 0px",
                            '.ps-menu-button': {
                                backgroundColor: colors.primary[400],
                                color: "#868dfb !important",

                                '&:hover': {
                                    color: "#6870fa !important",
                                    backgroundColor: 'transparent !important',
                                },
                                '&:focus': {
                                    color: "#6870fa !important",
                                    backgroundColor: 'transparent !important'
                                },

                            }
                        }}
                    >
                        {!isCollapsed && (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                ml="10px"
                            >
                                <Box display="flex" alignItems="center">
                                    <AlternateEmailIcon fontSize="large" />
                                    <Box display="flex" gap="3px">
                                        <Typography
                                            variant="h1"
                                            color={colors.gray[100]}
                                            fontWeight="bold"
                                        >
                                            Adeo
                                        </Typography>
                                    </Box>
                                </Box>
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <MenuOutlinedIcon />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {!isCollapsed && (
                        <Box
                            mb="25px"
                            ml="50px"
                            display="flex"
                            justifyContent="space-between"
                        >
                            <Box textAlign="center">
                                <Typography
                                    variant="h2"
                                    color={colors.gray[100]}
                                    fontWeight="bold"
                                    sx={{ m: "10px 0 0 0" }}
                                >
                                    {userName}
                                </Typography>
                                <Typography variant="h3" color={colors.greenAccent[500]}>
                                    {user[0].toUpperCase() + user.slice(1)}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                        <Item
                            title="Dasboard"
                            to={"/"}
                            icon={<HomeOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Predictions"
                            to={'/line'}
                            icon={<HistoryIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        {/* <Typography
                            variant="h4"
                            color={colors.gray[100]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Users
                        </Typography> */}
                        <Item
                            title="Manage Users"
                            to="/users"
                            icon={<PeopleOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Line Chart"
                            to="/model"
                            icon={<TimelineOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        {/* <Item
                            title="Bar Chart"
                            to="/bar"
                            icon={<BarChartOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        /> */}

                        <Item
                            title="Calendar"
                            to="/calendar"
                            icon={<CalendarTodayOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </Box>
                </Menu>
            </Sidebar>
        </ProSidebarProvider>
    ) : (
        <ProSidebarProvider>
            <Sidebar defaultCollapsed={isCollapsed} rootStyles={{ display: 'flex', height: '100%', minHeight: '400px' }} backgroundColor={colors.primary[400]}>
                <Menu >
                    {/* LOGO AND MENU ICON */}
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                        rootStyles={{
                            margin: "10px 0 20px 0px",
                            '.ps-menu-button': {
                                backgroundColor: colors.primary[400],
                                color: "#868dfb !important",

                                '&:hover': {
                                    color: "#6870fa !important",
                                    backgroundColor: 'transparent !important',
                                },
                                '&:focus': {
                                    color: "#6870fa !important",
                                    backgroundColor: 'transparent !important'
                                },

                            }
                        }}
                    >
                        {!isCollapsed && (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                ml="10px"
                            >
                                <Box display="flex" alignItems="center">
                                    <AlternateEmailIcon fontSize="large" />
                                    <Box display="flex" gap="3px">
                                        <Typography
                                            variant="h1"
                                            color={colors.gray[100]}
                                            fontWeight="bold"
                                        >
                                            Adeo
                                        </Typography>
                                    </Box>
                                </Box>
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <MenuOutlinedIcon />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {!isCollapsed && (
                        <Box
                            mb="25px"
                            ml="50px"
                            display="flex"
                            justifyContent="space-between"
                        >
                            <Box textAlign="center">
                                <Typography
                                    variant="h2"
                                    color={colors.gray[100]}
                                    fontWeight="bold"
                                    sx={{ m: "10px 0 0 0" }}
                                >
                                    {userName}
                                </Typography>
                                <Typography variant="h3" color={colors.greenAccent[500]}>
                                    {user[0].toUpperCase() + user.slice(1)}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                        <Item
                            title="Dashboard"
                            to={"/"}
                            icon={<HomeOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Predictions"
                            to={'/line'} //TODO: change this route.
                            icon={<HistoryIcon />} //TODO: change this icon.
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Item
                            title="Line Chart"
                            to="/model"
                            icon={<TimelineOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        {/* <Item
                            title="Bar Chart"
                            to="/bar"
                            icon={<BarChartOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        /> */}

                        <Item
                            title="Calendar"
                            to="/calendar"
                            icon={<CalendarTodayOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </Box>
                </Menu>
            </Sidebar>
        </ProSidebarProvider>
    );
};


export default Sidenavbar;