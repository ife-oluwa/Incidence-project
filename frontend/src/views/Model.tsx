import React, { FC, useState, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { tokens } from "../theme";
import simpleRestProvider from 'ra-data-simple-rest';
import httpClient from '../admin/authUsers';
import { LineCanvas } from '@nivo/line';
import { Header } from '../components/Header';

interface Props {
    id: string;
    data: [{
        x: string;
        y: number;
    }]
}

interface Tooltip {
    active: boolean;
    payload: Array<number>;
    label: string;
}

export const Model: FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [dataProvider, setDataProvider] = useState<any>(null);
    const [metrics, setMetrics] = useState<Props[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');




    useEffect(() => {
        const fetchData = async () => {
            try {
                // Create a dataProvider object using simpleRestProvider
                const dataProvider = simpleRestProvider('api/v1', httpClient);
                setDataProvider(dataProvider);

                // Use the data provider to retrieve list of server data.
                const response = await dataProvider.getList('model-metrics', {
                    pagination: { page: 1, perPage: 10 },
                    sort: { field: 'date', order: 'ASC' },
                    filter: {}
                });

                setMetrics(response.data);

            } catch (error) {
                setError(String(error));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [])

    if (loading) {
        return (
            <Box m="20px">
                <Header title="Model metrics" subtitle="Model monitoring" />
                <div> Loading...</div>
            </Box>
        );
    }
    if (error) {
        return (
            <Box m="20px">
                <Header title="Model metrics" subtitle="Model monitoring" />
                <div>Error: {error}</div>
            </Box>
        )
    }



    const graphTheme = {
        "background": colors.primary[400],
        "text": {
            "fontSize": 11,
            "fill": "#333333",
            "outlineWidth": 0,
            "outlineColor": "transparent"
        },
        "axis": {
            "domain": {
                "line": {
                    "stroke": "#777777",
                    "strokeWidth": 1
                }
            },
            "legend": {
                "text": {
                    "fontSize": 12,
                    "fill": colors.gray[100],
                    "outlineWidth": 0,
                    "outlineColor": "white"
                }
            },
            "ticks": {
                "line": {
                    "stroke": "#777777",
                    "strokeWidth": 1
                },
                "text": {
                    "fontSize": 11,
                    "fill": colors.greenAccent[100],
                    "outlineWidth": 0,
                    "outlineColor": "transparent"
                }
            }
        },
        "grid": {
            "line": {
                "stroke": "transparent",
                "strokeWidth": 1
            }
        },
        "legends": {
            "title": {
                "text": {
                    "fontSize": 11,
                    "fill": "#333333",
                    "outlineWidth": 0,
                    "outlineColor": "transparent"
                }
            },
            "text": {
                "fontSize": 11,
                "fill": "#333333",
                "outlineWidth": 0,
                "outlineColor": "transparent"
            },
            "ticks": {
                "line": {},
                "text": {
                    "fontSize": 10,
                    "fill": "#333333",
                    "outlineWidth": 0,
                    "outlineColor": "transparent"
                }
            }
        },
        "annotations": {
            "text": {
                "fontSize": 13,
                "fill": "#333333",
                "outlineWidth": 2,
                "outlineColor": "#ffffff",
                "outlineOpacity": 1
            },
            "link": {
                "stroke": "#000000",
                "strokeWidth": 1,
                "outlineWidth": 2,
                "outlineColor": "#ffffff",
                "outlineOpacity": 1
            },
            "outline": {
                "stroke": "#000000",
                "strokeWidth": 2,
                "outlineWidth": 2,
                "outlineColor": "#ffffff",
                "outlineOpacity": 1
            },
            "symbol": {
                "fill": "#000000",
                "outlineWidth": 2,
                "outlineColor": "#ffffff",
                "outlineOpacity": 1
            }
        },
        "tooltip": {
            "container": {
                "background": colors.blueAccent[800],
                "fontSize": 12
            },
            "basic": {},
            "chip": {},
            "table": {},
            "tableCell": {},
            "tableCellValue": {}
        }
    }
    return (
        <>
            <Box m="20px">
                <Header title="Model metrics" subtitle="Model monitoring" />
                <Box
                    display='flex'
                    justifyContent="center"
                    marginTop="40px"
                    marginRight="550px">
                    <LineCanvas width={1500} height={700} data={metrics}
                        enablePoints={false}
                        theme={graphTheme}
                        margin={{
                            bottom: 60,
                            left: 80,
                            right: 20,
                            top: 20
                        }}
                        pointBorderColor={{
                            from: 'color',
                            modifiers: [
                                [
                                    'darker',
                                    0.3
                                ]
                            ]
                        }}
                        pointBorderWidth={1}
                        pointSize={16}
                        pointSymbol={function noRefCheck() { }}

                        axisBottom={{
                            format: '%b %d',
                            tickValues: 'every 2 days',
                            legend: 'Incidents (left) & predicted (right)',
                            legendOffset: -12
                        }}

                        xFormat="time:%Y-%m-%d"
                        xScale={{
                            format: '%Y-%m-%d',
                            precision: 'day',
                            type: 'time',
                            useUTC: false
                        }}
                        yScale={{
                            type: 'linear'
                        }} />
                </Box>
            </Box>
        </>

    )
};