from fastapi import FastAPI
from app.api import router
from app.db.session import engine, Base

# create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(router, prefix="/api")
