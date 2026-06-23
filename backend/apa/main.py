from fastapi import FastAPI
from apa_process import router as apa_router
from table import router as table_router

app=FastAPI()

app.include_router(apa_router)
app.include_router(table_router)