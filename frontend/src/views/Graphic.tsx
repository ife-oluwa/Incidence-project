import React, { FC } from "react";
import { Graph } from "./Graph";
import { Header } from "../components/Header";
import { Box } from "@mui/material";

export const Graphic: FC = () => {
    return (
        <>
            <Box m="20px">
                <Header title="Model Predictions" subtitle="Last recorded incidents (left) & Predicted incidents (right)" />
                <Box
                    height="0px" mt="-80px" p="0 0px" ml='-20px'
                >
                    <Graph />
                </Box>
            </Box>
        </>
    )
}