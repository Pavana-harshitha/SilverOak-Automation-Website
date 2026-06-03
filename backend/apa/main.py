import os
from dotenv import load_dotenv
from pydantic import BaseModel
import yaml
from fastapi import FastAPI

load_dotenv()
LANDING_AI_API_KEY=os.getenv("LANDING_AI_API_KEY")

app=FastAPI()

class ProcessRequest(BaseModel):
    process_name: str
    process_code: str
    name: str
    content: str
    id: str

@app.get('/test')
def test():
    return ({"message":"API is running"})


@app.post('/process')
def apa(request:ProcessRequest):    
    with open("config.yaml", "r") as f:
        config = yaml.safe_load(f)
    parser_model=config["parser_model"]
    extractor_model=config["extractor_model"]
    print(f"parser_model - {parser_model}")
    print(f"extractor_model - {extractor_model}")
