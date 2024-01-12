from openai import OpenAI
import os
from rich.console import Console
from os.path import join, dirname
from dotenv import load_dotenv
from modules.menu import *

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

SECRET_KEY = os.environ.get("API_KEY")

openai = OpenAI(
    api_key=SECRET_KEY
)
console = Console()

try:
    run_menu(openai)

except KeyboardInterrupt:
    os.system("clear")
