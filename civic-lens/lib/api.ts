const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export type IssueAnalysis = {
  category: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  confidence: number;
  impact: string;
  action: string;
};

export type Issue = {
  id: number;
  issue_code: string;
  description: string;
  location: string | null;
  category: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  confidence: number;
  impact: string;
  action: string;
  analysis_method: string;
  report_group: string | null;
  similar_reports: number;
  status: string;
  created_at: string;
};

export async function analyzeIssue(
  description: string,
  category: string = "Auto-detect"
): Promise<IssueAnalysis> {
  const response = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description,
      category,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze issue");
  }

  return response.json();
}

export async function createIssue(data: {
  description: string;
  location: string;
  category: string;
}): Promise<Issue> {
  const response = await fetch(`${API_URL}/api/issues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to submit issue");
  }

  return response.json();
}

export async function getIssues(): Promise<Issue[]> {
  const response = await fetch(`${API_URL}/api/issues`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch issues");
  }

  return response.json();
}