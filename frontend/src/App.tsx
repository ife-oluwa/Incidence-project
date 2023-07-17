import React, { FC } from 'react';
import Pages from './Pages';
import { Login } from './views'
import { Routes, Route, redirect } from 'react-router-dom';

const App: FC = () => {
    return (<Pages />)
};

export default App;