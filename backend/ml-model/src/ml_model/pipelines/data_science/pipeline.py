from kedro.pipeline import Pipeline, node, pipeline

from .nodes import setup_model, evaluate_model, model_predict


def create_pipeline(**kwargs) -> Pipeline:
    return pipeline(
        [
            node(
                func=setup_model,
                inputs=["incidents"],
                outputs="regressor",
                name="model_setup_node",
            ),
            node(
                func=evaluate_model,
                inputs=['regressor', 'incidents'],
                outputs=None,
                name='evaluate_model_node',
            ),
            node(
                func=model_predict,
                inputs=["regressor", "incidents"],
                outputs=None,
                name='prediction_node',
            )
        ]
    )
