# Alterações no Schema: Tenant-Contract Relationship

**Data:** 20 de Novembro de 2025
**Migração:** `migrations/20251120_tenants_add_contract_id.sql`

## Resumo das Alterações

Redesenhamos o relacionamento entre inquilinos e contratos para um modelo **tenant-centric** (centrado no inquilino).

### Alterações na Tabela `tenants`

**Adicionado:**
- ✅ Coluna `contract_id` (INTEGER, nullable)
- ✅ Foreign Key: `contract_id` → `contracts.id` (ON DELETE SET NULL)
- ✅ Índice: `idx_tenants_contract_id`
- ✅ Relacionamento: `tenant.contract` (contrato ativo)

### Alterações na Tabela `contracts`

**Removido:**
- ❌ Coluna `document_url` (TEXT)

---

## Modelo de Dados

### Antes (Contract-Centric)

```python
# Buscar contrato ativo de um inquilino
contract = db.query(Contract).filter(
    Contract.tenant_id == tenant_id,
    Contract.status == "active"
).first()

# Documentos do contrato
contract_doc = contract.document_url  # URL única
```

### Depois (Tenant-Centric)

```python
# Buscar contrato ativo de um inquilino
tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
contract = tenant.contract  # Acesso direto ao contrato ativo

# Documentos do inquilino (incluindo documentos de contrato)
tenant_docs = tenant.documents  # Array JSONB
```

---

## Schema das Models

### `tenants/models.py`

```python
class Tenant(Base):
    __tablename__ = "tenants"
    
    # ... outros campos
    contract_id = Column(Integer, ForeignKey("contracts.id"), nullable=True)
    
    # Relacionamentos
    contract = relationship(
        "Contract",
        foreign_keys=[contract_id],
        uselist=False,
        viewonly=True
    )
    
    contracts = relationship(
        "Contract",
        foreign_keys="Contract.tenant_id",
        back_populates="tenant"
    )
```

### `contracts/models.py`

```python
class Contract(Base):
    __tablename__ = "contracts"
    
    # Campos mantidos (14 no total):
    id, user_id, title, property_id, tenant_id,
    start_date, end_date, rent, deposit,
    interest_rate, fine_rate, status,
    created_at, updated_at
    
    # Campo removido:
    # document_url ❌
```

---

## Schema das APIs

### `tenants/schemas.py`

```python
class TenantBase(BaseModel):
    name: str
    email: str
    phone: str
    document_type: TenantDocumentType
    document_number: str
    documents: Optional[List[Dict[str, Any]]] = []
    contract_id: Optional[int] = None  # ✅ NOVO

class TenantUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    contract_id: Optional[int] = None  # ✅ NOVO
```

### `contracts/schemas.py`

```python
class ContractBase(BaseModel):
    title: str
    property_id: int
    tenant_id: int
    start_date: date
    end_date: date
    rent: Decimal
    deposit: Optional[Decimal] = None
    interest_rate: Optional[Decimal] = None
    fine_rate: Optional[Decimal] = None
    status: ContractStatus = ContractStatus.ACTIVE
    # document_url removido ❌

class ContractUpdate(BaseModel):
    title: Optional[str] = None
    # ... outros campos opcionais
    # document_url removido ❌
```

---

## Benefícios

### 1. **Controle Centralizado**
- Gerenciar propriedades e contratos através do inquilino
- `tenant.contract_id` aponta para o contrato ativo
- `tenant.contracts` lista todos os contratos históricos

### 2. **Documentos Unificados**
- Documentos de contrato agora armazenados em `tenant.documents`
- Tipo de documento: `"contrato"` ou `"contract"`
- Centraliza documentação do inquilino em um único lugar

### 3. **Integridade Referencial**
- FK com `ON DELETE SET NULL`: inquilino sobrevive à exclusão do contrato
- Índice melhora performance de consultas por contrato
- Relacionamentos bidirecionais mantidos

---

## Migração de Dados

```sql
-- Migração automática de contratos ativos
UPDATE tenants t
SET contract_id = c.id
FROM contracts c
WHERE c.tenant_id = t.id
  AND c.status = 'active';

-- Resultado: UPDATE 0
-- (Nenhum contrato ativo no banco neste momento)
```

---

## Exemplos de Uso

### Frontend: Criar Inquilino com Contrato

```typescript
// POST /api/v1/tenants/
const newTenant = {
  name: "João Silva",
  email: "joao@email.com",
  phone: "11999999999",
  document_type: "cpf",
  document_number: "12345678900",
  contract_id: null  // Criar sem contrato inicialmente
};

// Depois de criar o contrato
// PUT /api/v1/tenants/{tenant_id}
const updateTenant = {
  contract_id: contractId  // Associar contrato ativo
};
```

### Backend: Consultar Dados do Contrato Ativo

```python
# router.py
@router.get("/tenants/{tenant_id}/active-contract")
def get_active_contract(
    tenant_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    tenant = db.query(Tenant).filter(
        Tenant.id == tenant_id,
        Tenant.user_id == user_id
    ).first()
    
    if not tenant:
        raise HTTPException(404, "Tenant not found")
    
    if not tenant.contract:
        raise HTTPException(404, "No active contract")
    
    return tenant.contract
```

### Backend: Listar Contratos Históricos

```python
@router.get("/tenants/{tenant_id}/contracts")
def get_tenant_contracts(
    tenant_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    tenant = db.query(Tenant).filter(
        Tenant.id == tenant_id,
        Tenant.user_id == user_id
    ).first()
    
    if not tenant:
        raise HTTPException(404, "Tenant not found")
    
    # Retorna todos os contratos (ativos, expirados, cancelados)
    return tenant.contracts
```

---

## Compatibilidade

### Backward Compatibility

✅ **Mantido:**
- Todos os endpoints de `contracts` continuam funcionando
- Relacionamento `contract.tenant` preservado
- Consultas por `tenant_id` em contratos ainda funcionam

⚠️ **Alterado:**
- Campo `document_url` não existe mais em contratos
- Use `tenant.documents` para armazenar documentos de contrato
- Frontend deve migrar para usar `tenant.documents` array

### Breaking Changes

❌ **Removido:**
```python
# ANTES (não funciona mais):
contract.document_url  # AttributeError

# DEPOIS (usar):
tenant = contract.tenant
contract_docs = [
    doc for doc in tenant.documents 
    if doc.get("type") == "contrato"
]
```

---

## Checklist de Atualização Frontend

- [ ] Atualizar interface de criação de inquilino com campo `contract_id`
- [ ] Atualizar interface de edição de inquilino para permitir alterar `contract_id`
- [ ] Migrar upload de documentos de contrato para `POST /tenants/{id}/upload-documents?document_type=contrato`
- [ ] Remover referências a `contract.document_url`
- [ ] Usar `tenant.documents.filter(type="contrato")` para documentos de contrato
- [ ] Testar associação de contrato ativo com inquilino
- [ ] Testar listagem de contratos históricos através do inquilino

---

## Rollback

Caso precise reverter as alterações:

```sql
-- Remover contract_id de tenants
ALTER TABLE tenants DROP COLUMN contract_id;

-- Re-adicionar document_url em contracts
ALTER TABLE contracts ADD COLUMN document_url TEXT;
```

⚠️ **Atenção:** Rollback causará perda de dados em `tenant.contract_id` e não recuperará `contract.document_url` removidos.

---

## Status

✅ Migração aplicada com sucesso  
✅ Backend reiniciado e funcionando  
✅ Models e schemas atualizados  
✅ Índices criados  
✅ Foreign keys configuradas  

⏳ Pendente: Testes com dados reais  
⏳ Pendente: Atualização da documentação da API  

---

# Alterações no Schema: Propriedades → Referência ao Inquilino

**Data:** 27 de Novembro de 2025  
**Migração:** `migrations/20251127_properties_add_tenant_id.sql`

## Resumo

Substituímos o campo livre `tenant` (texto) da tabela `properties` por `tenant_id` (FK opcional para `tenants.id`). Assim, cada imóvel pode referenciar explicitamente o inquilino atual.

## Alterações na Tabela `properties`

**Adicionado:**
- ✅ Coluna `tenant_id` (INTEGER, nullable, index)
- ✅ Foreign Key: `tenant_id` → `tenants.id` (ON DELETE SET NULL)
- ✅ Índice: `idx_properties_tenant_id`

**Removido:**
- ❌ Coluna `tenant` (TEXT)

### Modelo (`properties/models.py`)

```python
class Property(Base):
    __tablename__ = "properties"
    # ... campos existentes
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="SET NULL"), nullable=True, index=True)
    tenant = relationship("Tenant", foreign_keys=[tenant_id])
```

### Schemas (`properties/schemas.py`)

```python
class PropertyBase(BaseModel):
    # ...
    tenant_id: Optional[int] = None  # ✅ substitui 'tenant: Optional[str]'

class PropertyUpdate(BaseModel):
    # ...
    tenant_id: Optional[int] = None  # ✅ substitui 'tenant: Optional[str]'
```

## Migração SQL

```sql
BEGIN;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_properties_tenant_id ON properties(tenant_id);
ALTER TABLE properties
    ADD CONSTRAINT fk_properties_tenant_id
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL;
-- Remover coluna antiga caso exista
ALTER TABLE properties DROP COLUMN IF EXISTS tenant;
COMMIT;
```

## Impacto na API

- Responses e payloads de `Properties` passam a expor `tenant_id` (int) em vez de `tenant` (string).
- Nenhuma mudança de endpoint foi necessária; apenas os campos dos objetos.
- O relacionamento principal de ocupação ainda é derivado por `contracts.tenant_id`, mas `properties.tenant_id` permite um acesso direto ao inquilino atual.

## Checklist Frontend

- [ ] Ajustar tipos e modelos para usar `tenant_id?: number`.
- [ ] Atualizar telas de criação/edição de imóvel para permitir (opcional) definir `tenant_id`.
- [ ] Remover exibição ou edição direta de `tenant` (texto) no contexto do imóvel.

## Observações

- Se havia dados no campo `tenant` (texto), não há migração automática para `tenant_id` por ausência de mapeamento direto. Caso necessário, efetuar associação manual com base em regras de negócio.
