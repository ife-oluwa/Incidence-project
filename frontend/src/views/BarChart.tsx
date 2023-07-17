import React, { FC, useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Box, Typography, useTheme, ThemeProvider } from '@mui/material';
import { tokens } from '../theme';
import simpleRestProvider from 'ra-data-simple-rest';
import httpClient from '../admin/authUsers';

interface Props {

}

export const BarChart: FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [dataProvider, setDataProvider] = useState<any>(null);
    const [data, setData] = useState<Props[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Create a dataProvider object using simpleRestProvider
                const dataProvider = simpleRestProvider('api/v1', httpClient);
                setDataProvider(dataProvider);

                // Use the data provider to retrieve list of server data.
                const response = await dataProvider.getList('predictions', {
                    pagination: { page: 1, perPage: 10 },
                    sort: { field: 'name', order: 'ASC' },
                    filter: {}
                });
                setData(response.data);
            } catch (error) {
                setError(String(error));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [])
    return (
        <div>
            BarChart
        </div>
    )
}