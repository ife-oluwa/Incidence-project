from app import tasks

def test_example_task():
    task_output = tasks.example_task("Hello World")
    assert task_output == "test task returns Hello World"

def test_create_task():
    task_output = tasks.create_task(a=2, b=3, c=5)
    assert task_output == 8