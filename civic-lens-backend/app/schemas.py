from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class IssueCreate(BaseModel):
    description: str
    location: str = ""
    category: str = "Auto-detect"


class IssueResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    issue_code: str
    description: str
    location: str | None
    category: str
    priority: Literal["HIGH", "MEDIUM", "LOW"]
    confidence: float
    impact: str
    action: str
    analysis_method: str
    report_group: str | None
    similar_reports: int
    status: str
    created_at: datetime