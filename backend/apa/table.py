import os
from dotenv import load_dotenv
from pydantic import BaseModel
from supabase import create_client
from typing import Literal,Dict,Any
from datetime import datetime, timezone
from fastapi import HTTPException,APIRouter


load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
supabase_client = create_client(SUPABASE_URL,SUPABASE_SERVICE_KEY)

router=APIRouter(tags=["table"])

class CreateRequest(BaseModel):
    name: str
    process_name: str
    process_code: str

class UpdateRequest(BaseModel):
    status: Literal["Pending", "Success", "Failure"]
    response: Dict[str, Any] | None = None
    error: str | None = None


@router.get('/records')
def get_records():
    response = supabase_client.table("autopay_bank_card_forms").select("*").order("created_at",desc=True).execute()
    return response.data

@router.get('/records/(record_id)')
def get_record(record_id):
    response = supabase_client.table("autopay_bank_card_forms").select("*").eq("id",record_id).execute()
    return response.data[0]

@router.post('/record')
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
    

@router.patch('/record/(record_id)')
def update_record(record_id,request:UpdateRequest):
    try:
        record = {
            "status" : request.status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        if request.response is not None:
            record["response"] = request.response
        if request.error is not None:
            record["error"] = request.error
        
        response = supabase_client.table("autopay_bank_card_forms").update(record).eq("id",record_id).execute()
        return {"message":"Record updated",
                "record":response.data[0]}    

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500,detail=str(e))
    