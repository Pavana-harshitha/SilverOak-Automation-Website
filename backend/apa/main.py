from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from apa_process import router as apa_router
from table import router as table_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://silveroak-forms-automation.onrender.com",
        "http://localhost:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(apa_router)
app.include_router(table_router)