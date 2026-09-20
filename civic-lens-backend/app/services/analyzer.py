import os
from typing import Literal

from dotenv import load_dotenv

try:
    from google import genai
except ImportError:
    genai = None


load_dotenv()


Priority = Literal["HIGH", "MEDIUM", "LOW"]

ALLOWED_CATEGORIES = [
    "Roads",
    "Electricity",
    "Water",
    "Waste",
    "Transport",
    "Public Safety",
    "Environment",
    "General Civic Issue",
]


def rule_based_analysis(
    description: str,
    selected_category: str = "Auto-detect",
):
    """
    Reliable fallback analyzer.

    If Gemini is unavailable, CivicLens still works
    using this rule-based analysis.
    """

    text = description.lower()

    category = "General Civic Issue"
    priority: Priority = "MEDIUM"

    impact = "May affect the daily experience of the local community."

    action = (
        "Review the issue and assign it to the appropriate department."
    )

    if (
        "pothole" in text
        or "road" in text
        or "street" in text
        or "road damage" in text
    ):
        category = "Roads"

        action = (
            "Road inspection and necessary repair should be scheduled."
        )

        if any(
            word in text
            for word in ["accident", "danger", "unsafe", "large"]
        ):
            priority = "HIGH"
            impact = (
                "Potential safety risk for pedestrians and vehicles."
            )
        else:
            priority = "MEDIUM"
            impact = (
                "May affect traffic flow and road safety."
            )

    elif any(
        word in text
        for word in ["water", "leak", "pipeline", "drain"]
    ):
        category = "Water"

        action = (
            "Inspect the water infrastructure and repair the affected section."
        )

        if any(
            word in text
            for word in ["flood", "major", "contaminated"]
        ):
            priority = "HIGH"
            impact = (
                "May create health, sanitation or infrastructure risks."
            )
        else:
            priority = "MEDIUM"
            impact = (
                "May cause water loss and inconvenience to residents."
            )

    elif any(
        word in text
        for word in [
            "light",
            "electricity",
            "electric",
            "power",
            "wire",
        ]
    ):
        category = "Electricity"

        action = (
            "Inspect the electrical infrastructure and restore service."
        )

        if any(
            word in text
            for word in ["spark", "wire", "danger", "fire"]
        ):
            priority = "HIGH"
            impact = (
                "Potential electrical and public safety hazard."
            )
        else:
            priority = "MEDIUM"
            impact = (
                "May reduce safety and accessibility in the affected area."
            )

    elif any(
        word in text
        for word in ["garbage", "waste", "trash", "dump"]
    ):
        category = "Waste"

        action = (
            "Schedule waste collection and inspect the affected area."
        )

        if any(
            word in text
            for word in ["large", "days", "week"]
        ):
            priority = "HIGH"
            impact = (
                "May create sanitation and environmental concerns."
            )
        else:
            priority = "MEDIUM"
            impact = (
                "May affect cleanliness and local environmental conditions."
            )

    elif any(
        word in text
        for word in ["traffic", "signal", "bus", "transport"]
    ):
        category = "Transport"

        action = (
            "Inspect the transport infrastructure and coordinate corrective action."
        )

        if any(
            word in text
            for word in [
                "accident",
                "broken signal",
                "danger",
            ]
        ):
            priority = "HIGH"
            impact = (
                "Potential risk to road users and traffic movement."
            )
        else:
            priority = "MEDIUM"
            impact = (
                "May cause inconvenience and traffic disruption."
            )

    elif any(
        word in text
        for word in [
            "park",
            "tree",
            "pollution",
            "environment",
        ]
    ):
        category = "Environment"

        priority = "MEDIUM"

        impact = (
            "May negatively affect the local environment and community."
        )

        action = (
            "Inspect the environmental issue and coordinate appropriate action."
        )

    elif any(
        word in text
        for word in [
            "crime",
            "unsafe",
            "threat",
            "violence",
            "security",
        ]
    ):
        category = "Public Safety"

        priority = "HIGH"

        impact = (
            "May pose a public safety concern for people in the affected area."
        )

        action = (
            "Notify the appropriate public safety authority and inspect the affected area."
        )

    if selected_category != "Auto-detect":
        category = selected_category

    confidence = 94 if category != "General Civic Issue" else 71

    return {
        "category": category,
        "priority": priority,
        "confidence": confidence,
        "impact": impact,
        "action": action,
        "_analysis_method": "FALLBACK",
    }


def ai_analysis(
    description: str,
    selected_category: str = "Auto-detect",
):
    """
    Analyze a civic issue using Gemini structured output.
    """

    if genai is None:
        raise RuntimeError("google-genai is not installed.")

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured.")

    model = os.getenv(
        "GEMINI_MODEL",
        "gemini-2.5-flash-lite",
    )

    client = genai.Client(api_key=api_key)

    category_instruction = (
        "Automatically determine the most appropriate category."
        if selected_category == "Auto-detect"
        else f'The user selected "{selected_category}". Use this category.'
    )

    prompt = f"""
You are CivicLens AI, an assistant that analyzes civic problems
reported by citizens.

Analyze the following civic issue.

Issue description:
{description}

User-selected category:
{selected_category}

Category instruction:
{category_instruction}

Allowed categories:
{", ".join(ALLOWED_CATEGORIES)}

Your job:

1. Identify the most appropriate civic category.
2. Determine priority:
   - HIGH = immediate or significant safety, health, infrastructure,
     environmental, or traffic risk.
   - MEDIUM = meaningful community inconvenience or moderate risk.
   - LOW = minor issue with limited immediate impact.
3. Give a confidence score from 0 to 100.
4. Explain the likely community impact in one concise sentence.
5. Recommend a practical action for the appropriate civic department.

Important:
- Do not invent facts that are not present in the report.
- Keep the response concise.
- Return only the requested structured fields.
"""

    response = client.models.generate_content(
        model=model,
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": {
                "type": "object",
                "properties": {
                    "category": {
                        "type": "string",
                        "enum": ALLOWED_CATEGORIES,
                    },
                    "priority": {
                        "type": "string",
                        "enum": ["HIGH", "MEDIUM", "LOW"],
                    },
                    "confidence": {
                        "type": "integer",
                        "minimum": 0,
                        "maximum": 100,
                    },
                    "impact": {
                        "type": "string",
                    },
                    "action": {
                        "type": "string",
                    },
                },
                "required": [
                    "category",
                    "priority",
                    "confidence",
                    "impact",
                    "action",
                ],
            },
        },
    )

    if not response.text:
        raise RuntimeError("Gemini returned an empty response.")

    import json

    result = json.loads(response.text)

    # Validate category
    if result["category"] not in ALLOWED_CATEGORIES:
        result["category"] = "General Civic Issue"

    # Respect manually selected category
    if selected_category != "Auto-detect":
        result["category"] = selected_category

    # Validate priority
    if result["priority"] not in ["HIGH", "MEDIUM", "LOW"]:
        result["priority"] = "MEDIUM"

    # Keep confidence safe
    result["confidence"] = max(
        0,
        min(100, int(result["confidence"])),
    )

    result["_analysis_method"] = "AI"
    return result


def analyze_issue(
    description: str,
    selected_category: str = "Auto-detect",
):
    """
    Main CivicLens analyzer.

    Tries Gemini first.
    If Gemini fails for any reason, automatically falls
    back to the reliable rule-based analyzer.
    """

    try:
        return ai_analysis(
            description,
            selected_category,
        )

    except Exception as error:
        print(
            f"[CivicLens] AI analysis unavailable: {error}"
        )
        print(
            "[CivicLens] Using rule-based fallback."
        )

        return rule_based_analysis(
            description,
            selected_category,
        )