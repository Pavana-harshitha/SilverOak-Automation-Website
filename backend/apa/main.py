import os
from dotenv import load_dotenv
from pydantic import BaseModel
import yaml
from fastapi import FastAPI
import base64

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

    process_name = request.process_name
    process_code = request.process_code
    name = request.name
    content = request.content
    id = request.id
    print(f"process_name - {process_name}")
    print(f"process_code - {process_code}")
    print(f"name - {name}")
    print(f"id - {id}")

    modified_file_name = f"{id}_{name}"
    print(f"modified_file_name - {modified_file_name}")
    pdf_bytes = base64.b64decode(content)
    with open(modified_file_name, "wb") as pdf_file:
        pdf_file.write(pdf_bytes)

