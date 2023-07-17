import React, { FC, useEffect } from 'react';
import { Routes, Route, useNavigate, redirect } from 'react-router-dom';
import { Model, Login, SignUp, Dashboard, Graphic, BarChart, Calendar } from './views';
import { isAuthenticated, logout } from './utils/auth';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Topbar } from "./components/Topbar";
import Sidenavbar from './components/Sidenavbar';
import { UserList, UserCreate, UserEdit } from './admin';

const Pages: FC = () => {
    const navigate = useNavigate();
    const [theme, colorMode] = useMode();
    const authToken = localStorage.getItem('token');


    return authToken ? (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="app">
                    {authToken && <Sidenavbar />}
                    <main className="content">
                        {authToken && <Topbar />}
                        <Routes>
                            <Route path="/users" Component={UserList} />
                            <Route path="/users/:id" Component={UserEdit} />
                            <Route path="/add-user" Component={UserCreate} />
                            <Route path='/' Component={Dashboard} />
                            <Route path='/signup' Component={SignUp} />
                            <Route path='/model' Component={Model} />
                            <Route path='/logout' loader={() => {
                                logout();
                                navigate('/');
                                return null;
                            }} />
                            <Route path='/users' Component={UserList} />
                            <Route path='/login' Component={Login} />
                            <Route path='/bar' Component={BarChart} />
                            <Route path='/line' Component={Graphic} />
                            <Route path='/calendar' Component={Calendar} />
                        </Routes>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>

    ) : (
        <Routes>
            <Route path="/" Component={Login} />
        </Routes>
    )
};


export default Pages;