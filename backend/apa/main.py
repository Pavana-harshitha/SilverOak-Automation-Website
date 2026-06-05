import os
from dotenv import load_dotenv
from pydantic import BaseModel
import yaml
from fastapi import FastAPI
import base64
from pathlib import Path
from landingai_ade import LandingAIADE
import helper


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

    schema = """
    {
    "type": "object",
    "properties": {
        "policyholder_information": {
        "type": "object",
        "description": "Contains policy holder information",
        "properties": {
            "full_name": {
            "type": "string"
            },
            "contact_number": {
            "type": "string"
            },
            "street_address": {
            "type": "string"
            },
            "city": {
            "type": "string"
            },
            "state": {
            "type": "string"
            },
            "postal_code": {
            "type": "string"
            },
            "email_address": {
            "type": "string"
            }
        }
        },
        "request_type": {
        "type": "string",
        "description": "Action being requested by the policy holder",
        "enum": [
            "start",
            "add",
            "cancel",
            "update",
            "replace"
        ]
        },
        "covered_policy_information": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
            "policy_number": {
                "type": "string"
            },
            "vehicle": {
                "type": "boolean"
            },
            "property": {
                "type": "boolean"
            },
            "health": {
                "type": "boolean"
            },
            "life": {
                "type": "boolean"
            }
            }
        }
        },
        "bank_payment_information": {
        "type": "object",
        "properties": {
            "account_type": {
            "type": "string",
            "enum": [
                "checking",
                "savings"
            ]
            },
            "name_on_bank_account": {
            "type": "string"
            },
            "bank_name": {
            "type": "string"
            },
            "": {
            "type": "string"
            },
            "bank_routing_number": {
            "type": "number"
            },
            "last_4_digits_on_bank_account": {
            "type": "number"
            }
        }
        },
        "preferred_payment_date": {
        "type": "number"
        },
        "payment_frequency": {
        "type": "string",
        "enum": [
            "pay_in_full",
            "monthly",
            "quaterly",
            "twice_per_month"
        ]
        },
        "signature_details": {
        "type": "object",
        "properties": {
            "has_signature": {
            "type": "boolean"
            },
            "has_date": {
            "type": "boolean"
            }
        }
        },
        "card_payment_information": {
        "type": "object",
        "properties": {
            "card_type": {
            "type": "string",
            "enum": [
                "visa",
                "master_card",
                "discover",
                "amex"
            ]
            },
            "name_on_card": {
            "type": "string"
            },
            "billing_address": {
            "type": "string"
            },
            "expiration_date": {
            "type": "string",
            "format": "MM-YYYY"
            },
            "": {
            "type": "string"
            },
            "last_4_digits_of_card": {
            "type": "number"
            }
        }
        },
        "form_number": {
        "type": "string"
        },
        "form_name": {
        "type": "string"
        }
    }
    }
    """

    client = LandingAIADE(
    apikey=LANDING_AI_API_KEY,
    )

    # parse_response = client.parse(
    # document=Path(modified_file_name),
    # model=parser_model,
    # )

    # raw_extract_response = client.extract(
    # schema=schema,
    # markdown=parse_response.markdown.encode('utf-8'),
    # model=extractor_model
    # )

    # extraction = raw_extract_response.to_dict().get("extraction",{})
    # print(extraction)

    extraction = {'policyholder_information': {'full_name': 'Klaus Mikelson',
  'contact_number': '74937593954',
  'street_address': '1234 Bourbon St',
  'city': 'New Orleans',
  'state': 'LA',
  'postal_code': '70112',
  'email_address': None},
 'request_type': 'add',
 'covered_policy_information': [{'policy_number': '654789543',
   'vehicle': False,
   'property': True,
   'health': False,
   'life': False},
  {'policy_number': '65478954',
   'vehicle': True,
   'property': False,
   'health': True,
   'life': False},
  {'policy_number': '',
   'vehicle': False,
   'property': False,
   'health': False,
   'life': False},
  {'policy_number': '',
   'vehicle': False,
   'property': False,
   'health': False,
   'life': False}],
 'bank_payment_information': {'account_type': 'savings',
  'name_on_bank_account': 'Klaus Mikelson',
  'bank_name': 'New Orleans Original Bank',
  'bank_routing_number': 546485937,
  'last_4_digits_on_bank_account': 6383,
  'root': '546485937'},
 'preferred_payment_date': 15,
 'payment_frequency': 'twice_per_month',
 'signature_details': {'has_signature': True, 'has_date': True},
 'card_payment_information': {'card_type': 'visa',
  'name_on_card': None,
  'billing_address': None,
  'expiration_date': None,
  'last_4_digits_of_card': None,
  'root': None},
 'form_number': 'HLA-8912-0525',
 'form_name': 'Bank Account Automatic Payment Authorization Form'}
    

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

    
