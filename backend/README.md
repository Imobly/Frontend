# Backend FastAPI

## Como rodar o backend

1. Ative o ambiente virtual Python (venv).
2. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
3. Rode o servidor FastAPI:
   ```bash
   uvicorn main:app --reload
   ```

O backend estará disponível em http://127.0.0.1:8000

## Funcionalidades/Requisitos
- API REST para propriedades, inquilinos, contratos, pagamentos e despesas
- Integração com frontend React via HTTP (fetch/axios)
- CORS liberado para desenvolvimento
- Estrutura pronta para expandir endpoints

## Observações
- Não é necessário Node.js para o backend, apenas Python/FastAPI
- O Node.js/Vite continua sendo usado apenas para o frontend
