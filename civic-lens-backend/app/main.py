from uuid import uuid4

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import Issue
from .schemas import IssueCreate, IssueResponse
from .services.analyzer import analyze_issue
from .services.similarity import find_related_issue


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="CivicLens API",
    description="AI-powered civic issue analysis platform",
    version="1.0.0",
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# Health / Root
# ---------------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "CivicLens API is running",
        "status": "healthy",
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "CivicLens API",
    }


# ---------------------------------------------------------
# AI Analysis
# ---------------------------------------------------------

@app.post("/api/analyze")
def analyze_issue_endpoint(
    issue_data: IssueCreate,
):
    analysis = analyze_issue(
        issue_data.description,
        issue_data.category,
    )

    # Remove internal field before sending response
    analysis.pop("_analysis_method", None)

    return analysis


# ---------------------------------------------------------
# Create Issue
# ---------------------------------------------------------

@app.post(
    "/api/issues",
    response_model=IssueResponse,
)
def create_issue(
    issue_data: IssueCreate,
    db: Session = Depends(get_db),
):
    # -------------------------------------------------
    # 1. Analyze issue using Gemini + fallback
    # -------------------------------------------------

    analysis = analyze_issue(
        issue_data.description,
        issue_data.category,
    )

    analysis_method = analysis.pop(
        "_analysis_method",
        "FALLBACK",
    )

    # -------------------------------------------------
    # 2. Look for a related existing issue
    # -------------------------------------------------

    related_issue = find_related_issue(
        db=db,
        description=issue_data.description,
        location=issue_data.location,
        category=analysis["category"],
    )

    # -------------------------------------------------
    # 3. Determine report group
    # -------------------------------------------------

    if related_issue:
        report_group = related_issue.report_group

        if not report_group:
            report_group = (
                f"GRP-{uuid4().hex[:6].upper()}"
            )

            related_issue.report_group = report_group

        similar_reports = (
            db.query(Issue)
            .filter(
                Issue.report_group == report_group
            )
            .count()
            + 1
        )

    else:
        report_group = (
            f"GRP-{uuid4().hex[:6].upper()}"
        )

        similar_reports = 1

    # -------------------------------------------------
    # 4. Create new issue
    # -------------------------------------------------

    issue = Issue(
        issue_code=f"CL-{uuid4().hex[:6].upper()}",

        description=issue_data.description,

        location=issue_data.location,

        category=analysis["category"],

        priority=analysis["priority"],

        confidence=analysis["confidence"],

        impact=analysis["impact"],

        action=analysis["action"],

        analysis_method=analysis_method,

        report_group=report_group,

        similar_reports=similar_reports,

        status="OPEN",
    )

    db.add(issue)

    db.commit()

    db.refresh(issue)

    # -------------------------------------------------
    # 5. Update related reports with new count
    # -------------------------------------------------

    if related_issue:
        (
            db.query(Issue)
            .filter(
                Issue.report_group == report_group
            )
            .update(
                {
                    Issue.similar_reports: similar_reports
                },
                synchronize_session=False,
            )
        )

        db.commit()

        db.refresh(issue)

    return issue


# ---------------------------------------------------------
# Get All Issues
# ---------------------------------------------------------

@app.get(
    "/api/issues",
    response_model=list[IssueResponse],
)
def get_issues(
    db: Session = Depends(get_db),
):
    return (
        db.query(Issue)
        .order_by(Issue.created_at.desc())
        .all()
    )