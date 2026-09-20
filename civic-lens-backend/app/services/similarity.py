from sqlalchemy.orm import Session

from ..models import Issue


def normalize_text(text: str) -> set[str]:
    """
    Convert text into a simple set of useful words.
    """

    stop_words = {
        "the",
        "a",
        "an",
        "is",
        "are",
        "there",
        "near",
        "at",
        "in",
        "on",
        "and",
        "of",
        "to",
        "for",
        "with",
        "has",
        "have",
        "this",
        "that",
    }

    words = set()

    for word in text.lower().split():
        cleaned = "".join(
            char for char in word
            if char.isalnum()
        )

        if cleaned and cleaned not in stop_words:
            words.add(cleaned)

    return words


def calculate_similarity(
    description_1: str,
    description_2: str,
) -> float:
    """
    Calculate simple word-overlap similarity.
    """

    words_1 = normalize_text(description_1)
    words_2 = normalize_text(description_2)

    if not words_1 or not words_2:
        return 0.0

    intersection = words_1.intersection(words_2)
    union = words_1.union(words_2)

    return len(intersection) / len(union)


def find_related_issue(
    db: Session,
    description: str,
    location: str,
    category: str,
):
    """
    Find the most similar existing issue.

    We compare:
    - category
    - location
    - description
    """

    issues = (
        db.query(Issue)
        .filter(Issue.category == category)
        .order_by(Issue.created_at.desc())
        .limit(50)
        .all()
    )

    best_issue = None
    best_score = 0.0

    current_location = location.lower().strip()

    for issue in issues:

        score = calculate_similarity(
            description,
            issue.description,
        )

        existing_location = (
            issue.location.lower().strip()
            if issue.location
            else ""
        )

        # Same location gives a strong boost.
        if (
            current_location
            and existing_location
            and current_location == existing_location
        ):
            score += 0.35

        # Cap score at 1.
        score = min(score, 1.0)

        if score > best_score:
            best_score = score
            best_issue = issue

    # 0.35 is enough for our hackathon prototype.
    if best_issue and best_score >= 0.35:
        return best_issue

    return None