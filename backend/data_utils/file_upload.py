import pandas as pd
import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS, PointSettings
import pandas as pd
from dotenv import load_dotenv
import os
from datetime import datetime
import requests
import sys

action = sys.argv[1]


def is_empty(path):
    return os.listdir(path) == []


class DB:
    def __init__(self):
        load_dotenv('../.env')
        self.TOKEN = os.getenv('TOKEN')
        self.ORG = os.getenv('ORG')
        self.BUCKET1 = os.getenv('BUCKET1')
        self.URL = os.getenv('URL')
        self.CSV_LOCATION = os.getenv('CSV_LOCATION')

    def upload_data(self):

        response = requests.get(self.URL + '/ping')
        if not is_empty(self.CSV_LOCATION) and response.status_code == 200:
            df = pd.read_csv(
                './incidents.csv').set_index('date_exploitation')

            with influxdb_client.InfluxDBClient(url=self.URL, token=self.TOKEN, org=self.ORG) as client:
                point_settings = PointSettings(**{'type': 'incidents'})
                point_settings.add_default_tag("server", "ingest-data-frame")

                write_api = client.write_api(
                    write_options=SYNCHRONOUS, point_settings=point_settings
                )
                write_api.write(bucket=self.BUCKET1, record=df,
                                data_frame_measurement_name="server-df")
            print("Done")
        else:
            raise Exception("Unknown error: %s" % response.status_code)

    def download_data(self) -> pd.DataFrame:

        response = requests.get(self.URL + '/ping')
        if response.status_code == 200:
            with influxdb_client.InfluxDBClient(url=self.URL, token=self.TOKEN, org=self.ORG) as client:
                query = f'from(bucket:"{self.BUCKET1}")'\
                        '|> range(start: 0, stop: now())'\
                        '|> filter(fn: (r) => r._measurement == "server-df")'\
                        '|> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")'
                result_df = client.query_api().query_data_frame(query=query)
                result_df = result_df[['_time', 'etat_failed']]
                result_df['date'] = result_df['_time'].apply(lambda x: datetime.strftime(
                    x, "%Y-%m-%d"))
                result_df = result_df[['date', 'etat_failed']]
                result_df.to_csv(
                    '../ml-model/data/01_raw/incidents.csv')


if __name__ == '__main__':
    data_handle = DB()
    if action == 'upload':
        data_handle.upload_data()
    elif action == 'download':
        data_handle.download_data()
    else:
        raise Exception('Unknown action')
