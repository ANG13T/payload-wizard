import os


def rerun():
    import subprocess

    if os.name == "nt":
        subprocess.run(["python", "main.py"])
    else:
        subprocess.run(["python3", "main.py"])
