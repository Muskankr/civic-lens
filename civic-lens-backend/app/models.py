from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String, Text

from .database import Base


class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)

    issue_code = Column(String(50), unique=True, index=True)

    description = Column(Text, nullable=False)

    location = Column(String(255), nullable=True)

    category = Column(String(100), nullable=False)

    priority = Column(String(20), nullable=False)

    confidence = Column(Float, nullable=False)

    impact = Column(Text, nullable=False)

    action = Column(Text, nullable=False)

    status = Column(String(30), default="OPEN")

    # How the issue was analyzed
    analysis_method = Column(
        String(20),
        default="AI",
        nullable=False,
    )

    report_group = Column(
    String(50),
    nullable=True,
    index=True,
    )

    similar_reports = Column(
        Integer,
    default=0,
    nullable=False,
)

    status = Column(String(30), default="OPEN")


    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )