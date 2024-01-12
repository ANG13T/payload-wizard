from time import sleep
from modules.dorking import *
from modules.option import generate_option
from rich.console import Console
from rich.panel import Panel
from modules.menu import rerun, generate_option
import os
import re

console = Console()


def initiate_dorking(openai):
    value = console.input(
        "Enter [bold blue]Google Dorking Query Functionality[/]: ")

    prompt = "Create a Google Dork Query List of 5-10 Queries that would best encapusulate the following functionality: " + value

    model = "gpt-3.5-turbo"

    completion = openai.chat.completions.create(
        model=model,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    print(completion.choices[0].message)
    dorks = list_dorks(completion.choices[0].message.content)

    if len(dorks) < 5:
        print("ERROR! This query caused a failure")
    else:
        list_options(dorks)


def print_gpt_output(output):
    console.print(Panel(output, title="Memory: Store",
                  title_align="left", border_style="grey50"))


def list_dorks(message):
    # copies the selected dork to clipboard
    # the end includes a cancel button
    answers = message.split("\n")
    print_gpt_output(answers)
    return list_dorks


def list_options():
    options = []
    options.push("Run Again")
    options.push("Back to Home")

    option = generate_option(options)

    if option == None:
        return

    print(option)

    if option == 0:
        print("Back to Home")

    print(len(options))
