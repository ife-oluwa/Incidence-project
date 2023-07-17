from fastapi import APIRouter, Depends, Request, Response, encoders
import typing as t
import os

from app.db.session import get_db
from app.db.crud import (
    get_user,
    get_predictions,
    get_incidents,
    get_model_metrics,
    get_next_prediction
)
from app.db.schemas import Metrics, MultiSeries, Prediction
from app.core.auth import get_current_active_superuser, get_current_active_user


pred_router = r = APIRouter(

)


@r.get(
    "/predictions",
    response_model=t.List[MultiSeries],
    response_model_exclude_none=True
)
async def predictions_list(
    response: Response,
    current_user=Depends(get_current_active_superuser)
):
    """
    List all predictions and actual incidents
    """
    predictions = get_predictions()
    incidents = get_incidents()
    response.headers["Content-Range"] = f"0-9/{len(predictions)}"
    return [{
        'id': 'Predictions',
        'data': predictions
    },
        {
            'id': 'Incidents',
            'data': incidents
    }]


@r.get("/model-metrics", response_model=t.List[Metrics], response_model_exclude_none=True)
async def metrics_list(
    response: Response,
    current_user=Depends(get_current_active_user),
):
    """
    Get model metrics
    """
    errors = get_model_metrics()
    response.headers["Content-Range"] = f"0-9/{len(errors)}"
    return [
        {
            'id': 'Metrics',
            'data': errors
        }
    ]


@r.get("/monday", response_model=t.List[Prediction], response_model_exclude_none=True)
async def monday_pred(
    response: Response,
    current_user=Depends(get_current_active_user),
):

    """
    Get expected number of incidents for the next monday
    """
    pred = get_next_prediction()
    response.headers["Content-Range"] = f"0-9/{len(pred)}"
    return pred
