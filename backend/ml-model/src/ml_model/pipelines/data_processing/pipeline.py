# from kedro.pipeline import Pipeline, node, pipeline

# from .nodes import create_model_input_table, preprocess_incidents


# def create_pipeline(**kwargs) -> Pipeline:
#     return pipeline(
#         [
#             node(
#                 func=preprocess_incidents,
#                 inputs="incidents",
#                 outputs="preprocessed_incidents",
#                 name="preprocessed_incidents_node",
#             ),
#             node(
#                 func=create_model_input_table,
#                 inputs="preprocessed_incidents",
#                 outputs="model_input_table",
#                 name="create_model_input_table_node",
#             ),
#         ]
#     )
