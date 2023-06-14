import pandas as pd
import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS, PointSettings
import os
from datetime import datetime
from typing import Dict
from kedro_datasets.pandas import CSVDataSet


def file_exists(path: str) -> bool:
    return os.path.exists(path)


def preprocess_incidents(incidents: pd.DataFrame) -> pd.DataFrame:
    """Preprocesses the incidents data.

    Args:
        incidents: Raw Data.
    Returns:
        Preprocessed data, with `_time` converted to datetime and frequency set to daily.
    """
    incidents['_time'] = pd.to_datetime(incidents['_time'])
    return incidents


def preprocess_incidents(
    incidents: pd.DataFrame
) -> pd.DataFrame:
    """Extracts feature columns to create model input table.

    Args:
        incidents: Preprocessed data for incidents.
    Returns:
        Model input table.
    """
    incidents['etat_failed'] = incidents['etat_failed'].fillna(0)
    incidents = incidents[['_time', 'etat_failed']]
    return incidents
