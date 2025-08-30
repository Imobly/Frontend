from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "FastAPI backend rodando!"}

# Aqui você pode adicionar rotas para properties, tenants, contracts, payments, expenses
# Exemplo:
# @app.get("/properties")
# def get_properties():
#     return []
