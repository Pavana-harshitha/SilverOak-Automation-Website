import os
from dotenv import load_dotenv
from pydantic import BaseModel
import yaml
from fastapi import FastAPI,HTTPException
import base64
from pathlib import Path
from landingai_ade import LandingAIADE
import helper
from supabase import create_client


load_dotenv()
LANDING_AI_API_KEY = os.getenv("LANDING_AI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
supabase_client = create_client(SUPABASE_URL,SUPABASE_SERVICE_KEY)

app=FastAPI()

class CreateRequest(BaseModel):
    name: str
    process_name: str
    process_code: str

class ProcessRequest(BaseModel):
    process_name: str
    process_code: str
    name: str
    content: str
    id: str


@app.get('/test')
def test():
    return ({"message":"API is running"})


@app.post('/record')
def create_record(request:CreateRequest):
    try:
        record = {
                "filename":request.name,
                "process_name":request.process_name,
                "process_code":request.process_code
                }
        
        response = supabase_client.table("autopay_bank_card_forms").insert(record).execute()
        return {"message":"Record created",
                "record":response.data[0]}
    
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500,detail=str(e))
    


@app.post('/process')
def apa(request:ProcessRequest):  
    modified_file_name = None
    try:  
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
        modified_file_name = Path(modified_file_name)
        pdf_bytes = base64.b64decode(content)
        with open(modified_file_name, "wb") as pdf_file:
            pdf_file.write(pdf_bytes)

        with open("schema.json", "r") as f:
            schema = f.read()

        client = LandingAIADE(
        apikey=LANDING_AI_API_KEY,
        )

        parse_response = client.parse(
        document=modified_file_name,
        model=parser_model,
        )

        raw_extract_response = client.extract(
        schema=schema,
        markdown=parse_response.markdown.encode('utf-8'),
        model=extractor_model
        )

        extraction = raw_extract_response.to_dict().get("extraction",{})
        print(extraction)


        full_name = contact_number = street_address = city = state = postal_code = email_address = None
        
        request_type = None
        
        policy_number = None
        vehicle = property = health = life = "N"

        account_type = name_on_bank_account = bank_name = bank_routing_number = last_4_digits_on_bank_account = None
        card_type = name_on_card = billing_address = expiration_date = last_4_digits_of_card = None
        preferred_payment_date = None
        payment_frequency = None

        has_signature = has_date = "N"

        form_number = form_name = None

        full_name = extraction["policyholder_information"]["full_name"]
        contact_number = extraction["policyholder_information"]["contact_number"]
        street_address = extraction["policyholder_information"]["street_address"]
        city = extraction["policyholder_information"]["city"]
        state = extraction["policyholder_information"]["state"]
        postal_code = extraction["policyholder_information"]["postal_code"]
        email_address = extraction["policyholder_information"]["email_address"]
        
        request_type = extraction["request_type"]

        policy_number = helper.process_policy_table(extraction["covered_policy_information"],"policy_number")
        vehicle = helper.process_policy_table(extraction["covered_policy_information"],"vehicle") 
        property = helper.process_policy_table(extraction["covered_policy_information"],"property") 
        health = helper.process_policy_table(extraction["covered_policy_information"],"health") 
        life = helper.process_policy_table(extraction["covered_policy_information"],"life") 

        account_type = extraction["bank_payment_information"]["account_type"]
        name_on_bank_account = extraction["bank_payment_information"]["name_on_bank_account"]
        bank_name = extraction["bank_payment_information"]["bank_name"]
        bank_routing_number = extraction["bank_payment_information"]["bank_routing_number"]
        last_4_digits_on_bank_account = extraction["bank_payment_information"]["last_4_digits_on_bank_account"]

        card_type = extraction["card_payment_information"]["card_type"]
        name_on_card = extraction["card_payment_information"]["name_on_card"]
        billing_address = extraction["card_payment_information"]["billing_address"]
        expiration_date = extraction["card_payment_information"]["expiration_date"]
        last_4_digits_of_card = extraction["card_payment_information"]["last_4_digits_of_card"]

        preferred_payment_date = extraction["preferred_payment_date"] 
        payment_frequency = extraction["payment_frequency"] 

        has_signature = extraction["signature_details"]["has_signature"] 
        has_date = extraction["signature_details"]["has_date"] 

        form_number = extraction["form_number"] 
        form_name = extraction["form_name"] 
        
        request.content=""

        response = {
            "document_responses":{
                "request":request.model_dump(),
                "results":{
                    "full_name" : str(full_name),
                    "contact_number" : str(contact_number), 
                    "street_address" : str(street_address), 
                    "city" : str(city), 
                    "state" : str(state), 
                    "postal_code" : str(postal_code), 
                    "email_address" : str(email_address),

                    "request_type": str(request_type),  

                    "policy_number": str(policy_number), 
                    "vehicle": str(vehicle), 
                    "property": str(property), 
                    "health": str(health), 
                    "life": str(life), 

                    "account_type": str(account_type), 
                    "name_on_bank_account": str(name_on_bank_account), 
                    "bank_name": str(bank_name), 
                    "bank_routing_number": str(bank_routing_number), 
                    "last_4_digits_on_bank_account": str(last_4_digits_on_bank_account), 

                    "card_type": str(card_type), 
                    "name_on_card": str(name_on_card), 
                    "billing_address": str(billing_address), 
                    "expiration_date": str(expiration_date), 
                    "last_4_digits_of_card": str(last_4_digits_of_card), 

                    "preferred_payment_date": str(preferred_payment_date), 
                    "payment_frequency": str(payment_frequency), 

                    "has_signature": str(has_signature), 
                    "has_date": str(has_date), 

                    "form_number": str(form_number), 
                    "form_name": str(form_name)
                }
            }
            }
        print(f"Response = {response}")
        return response
    
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500,detail=str(e))
    
    finally:
        if modified_file_name and modified_file_name.exists():
            modified_file_name.unlink()
    
