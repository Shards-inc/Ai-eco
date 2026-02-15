from pydantic import BaseModel
from typing import List, Optional

class QueryRequest(BaseModel):
    prompt: string
    context_id: Optional[string] = None

class QueryResponse(BaseModel):
    id: string
    answer: string
    sources: List[string]