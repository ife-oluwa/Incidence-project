import logging
from typing import Dict, Tuple
import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS, PointSettings
import pandas as pd
from decouple import config
from datetime import datetime, date
import statsmodels.api as sm
from pandas.tseries.offsets import DateOffset

URL = config('URL', default='http://localhost:8086/')
TOKEN = config('TOKEN')
ORG = config('ORG')
BUCKET1 = config("BUCKET1")
BUCKET2 = config("BUCKET2")
BUCKET3 = config("BUCKET3")


def setup_model(data: pd.DataFrame):
    """Trains the timeseries model.
    Args:
        data: Training data of independent feature.
    Returns:
        Setup model.
    """
    # format dataframe
    data['date'] = pd.to_datetime(data['date'])
    data.set_index('date', inplace=True)
    data = data.asfreq('D')
    data['etat_failed'] = data['etat_failed'].fillna(0)
    data = data[['etat_failed']]

    # fit model
    model = sm.tsa.statespace.SARIMAX(data['etat_failed'], order=(
        1, 1, 1), seasonal_order=(1, 1, 1, 7))
    results = model.fit()
    return results


def evaluate_model(model, data: pd.DataFrame):
    """Calculates the Mean Average Error of the model.

    Args:
        regressor: Trained Model.
        data: Data containing the time series.
    """
    # format dataframe
    data['date'] = pd.to_datetime(data['date'])
    data.set_index('date', inplace=True)
    data = data.asfreq('D')
    data['etat_failed'] = data['etat_failed'].fillna(0)
    data = data[['etat_failed']]

    # Make test forecast
    data['forecast'] = model.predict(
        start=(len(data) - 7), end=len(data), dynamic=True)
    # Calculate Average Absolute Error
    data['Average Error'] = abs(data['etat_failed'] - data['forecast'])
    error = data['Average Error'].tail(7).mean()

    # Display error
    logger = logging.getLogger(__name__)
    logger.info(f'Model has a M.A.E of {error}')

    # Export error
    data = [[error, date.today()]]
    error_df = pd.DataFrame(data, columns=['error', 'date']).set_index('date')
    print(error_df)
    with influxdb_client.InfluxDBClient(url=URL, token=TOKEN, org=ORG) as client:
        point_settings = PointSettings(**{'type': 'errors'})
        point_settings.add_default_tag("server", "ingest-error-data-frame")

        write_api = client.write_api(
            write_options=SYNCHRONOUS, point_settings=point_settings
        )
        write_api.write(bucket=BUCKET3, record=error_df,
                        data_frame_measurement_name="error-df")
    print("Done")


def model_predict(model, data: pd.DataFrame):
    """Makes predictions on the next few days

    Args:
        regressor: Trained Model.
        data: Data containing the time series
    """
    # Format DataFrame
    data['date'] = pd.to_datetime(data['date'])
    data.set_index('date', inplace=True)
    data = data.asfreq('D')
    data['etat_failed'] = data['etat_failed'].fillna(0)

    # Make predictions
    future_dates = [data.index[-1] + DateOffset(days=x) for x in range(0, 8)]
    future_dates_df = pd.DataFrame(
        index=future_dates[1:], columns=data.columns)
    future_df = pd.concat([data, future_dates_df])
    future_df = future_df.reset_index()
    future_df['date'] = future_df['index']
    future_df = future_df[['date', 'etat_failed']]
    future_df.set_index('date', inplace=True)
    start, end = (len(future_df) - 7, len(future_df))
    future_df['forecast'] = model.predict(
        start=start, end=end, dynamic=True)

    # Append predictions bucket in influxdb
    next_week_pred = future_df[['forecast']].tail(7)
    print(next_week_pred)
    with influxdb_client.InfluxDBClient(url=URL, token=TOKEN, org=ORG) as client:
        point_settings = PointSettings(**{'type': 'predictions'})
        point_settings.add_default_tag(
            "server", "ingest-predictions-data-frame")

        write_api = client.write_api(
            write_options=SYNCHRONOUS, point_settings=point_settings
        )
        write_api.write(bucket=BUCKET2, record=next_week_pred,
                        data_frame_measurement_name="pred-df")
    print("Done")
