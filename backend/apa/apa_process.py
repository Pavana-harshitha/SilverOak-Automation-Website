import os,time,json
from dotenv import load_dotenv
from pydantic import BaseModel
import yaml
from fastapi import HTTPException,APIRouter
import base64
from pathlib import Path
from llama_cloud import LlamaCloud
import helper


load_dotenv()
LLAMA_AI_API_KEY = os.getenv("LLAMA_AI_API_KEY")

router=APIRouter(tags=["apa"])

class ProcessRequest(BaseModel):
    process_name: str
    process_code: str
    name: str
    content: str
    id: str

@router.get('/test')
def test():
    return ({"message":"API is running"})


@router.post('/process')
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
            schema = json.load(f)

        client = LlamaCloud(
        api_key=LLAMA_AI_API_KEY,
        )

        file_obj = client.files.create(file = modified_file_name, purpose = "extract")

        job = client.extract.create(
            file_input=file_obj.id,
            configuration={
                "data_schema": schema,
                "tier": "cost_effective",
                "extraction_target": "per_doc",
                "parse_tier": "cost_effective",
                "cite_sources": False,
                "confidence_scores": True
            },
        )

        while job.status not in ("COMPLETED", "FAILED", "CANCELLED"):
            time.sleep(2)
            job = client.extract.get(job.id)

        if job.status != "COMPLETED":
            raise RuntimeError(f"Extract job {job.id} ended in {job.status}: {job.error_message}")

        extraction = job.to_dict().get("extract_result",{})
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
    
