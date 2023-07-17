import { Box, IconButton, useTheme } from '@mui/material';
import React from 'react';
import { FC } from 'react';
import { useContext } from "react";
import { ColorModeContext, tokens } from "../theme";
import { InputBase } from '@mui/material';
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils';
import { AppBar, TitlePortal, ToggleThemeButton } from 'react-admin';


export const Topbar: FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    const colorMode = useContext(ColorModeContext);
    const navigate = useNavigate();

    return (
        (<Box display="flex" justifyContent="space-between" p={2}>
            {/* SEARCH BAR */}
            <Box display="flex" borderRadius="3px" sx={{ backgroundColor: colors.primary[400] }}
            >
                <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
                <IconButton type="button" sx={{ p: 1 }}>
                    <SearchIcon />
                </IconButton>
            </Box>
            {/* ICONS */}
            <Box display="flex">
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === 'dark' ? (
                        <DarkModeOutlinedIcon />) : (<LightModeOutlinedIcon />)
                    }
                </IconButton>
                <IconButton>
                    <NotificationsOutlinedIcon />
                </IconButton>
                <IconButton>
                    <SettingsOutlinedIcon />
                </IconButton>
                <IconButton onClick={() => {
                    logout();
                    navigate('/');
                    return null
                }}>
                    <PowerSettingsNewIcon />
                </IconButton>
            </Box>
        </Box>)

    )
}