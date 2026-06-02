import os
from dotenv import load_dotenv
from flask import Flask
from pydantic import BaseModel
import yaml


load_dotenv()
LANDING_AI_API_KEY=os.getenv("LANDING_AI_API_KEY")



class ProcessRequest(BaseModel):
    process_name: str
    process_code: str
    name: str
    content: str
    id: str


def apa(request:ProcessRequest):
    
    with open("config.yaml", "r") as f:
        config = yaml.safe_load(f)
    parser_model=config["parser_model"]
    extractor_model=config["extractor_model"]
    print(parser_model)
    print(extractor_model)