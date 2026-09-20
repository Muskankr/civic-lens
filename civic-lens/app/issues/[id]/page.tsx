"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getIssues, type Issue } from "@/lib/api";

export default function IssueDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadIssue() {
      try {
        const issues = await getIssues();

        const foundIssue = issues.find(
          (item) => item.id === Number(params.id)
        );

        if (!foundIssue) {
          setError("Issue not found.");
          return;
        }

        setIssue(foundIssue);
      } catch {
        setError("Failed to load issue details.");
      } finally {
        setLoading(false);
      }
    }

    loadIssue();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="mt-6 h-64 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      </main>
    );
  }

  if (error || !issue) {
    return (
      <main className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <div className="text-5xl">🔎</div>

          <h1 className="mt-5 text-2xl font-bold">
            {error || "Issue not found"}
          </h1>

          <button
            onClick={() => router.back()}
            className="mt-6 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            ← Go Back
          </button>
        </div>
      </main>
    );
  }

  const priorityClasses = {
    HIGH: "bg-red-100 text-red-700 border-red-200",
    MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
    LOW: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <button
            onClick={() => router.push("/")}
            className="text-xl font-bold tracking-tight"
          >
            CivicLens <span className="text-gray-500">🔎</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Dashboard
            </button>

            <button
              onClick={() => router.push("/report")}
              className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Report Issue
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <button
          onClick={() => router.back()}
          className="mb-6 text-sm font-medium text-gray-600 transition hover:text-black"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
              {issue.issue_code}
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold ${
                priorityClasses[issue.priority]
              }`}
            >
              {issue.priority} PRIORITY
            </span>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {issue.status}
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
            Civic Issue Details
          </h1>

          <p className="mt-2 text-gray-500">
            AI-analyzed community report and impact information.
          </p>
        </div>

        {/* Main Issue */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Report Description
            </p>

            <p className="mt-3 text-lg leading-8 text-gray-800">
              {issue.description}
            </p>

            <div className="mt-6 border-t border-gray-100 pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Location
              </p>

              <p className="mt-2 text-gray-700">
                📍 {issue.location || "Location not provided"}
              </p>
            </div>
          </div>

          {/* Priority */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Priority
            </p>

            <p className="mt-3 text-3xl font-bold">{issue.priority}</p>

            <p className="mt-4 text-sm text-gray-500">
              AI confidence
            </p>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-black"
                style={{
                  width: `${Math.min(
                    Math.max(issue.confidence, 0),
                    100
                  )}%`,
                }}
              />
            </div>

            <p className="mt-2 text-sm font-semibold text-gray-700">
              {issue.confidence}% confidence
            </p>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>

              <div>
                <h2 className="font-bold">AI Analysis</h2>
                <p className="text-xs text-gray-500">
                  {issue.analysis_method === "AI"
                    ? "Analyzed using Gemini AI"
                    : "Analyzed using fallback intelligence"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Category
              </p>

              <p className="mt-2 font-semibold">{issue.category}</p>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Recommended Action
              </p>

              <p className="mt-2 leading-7 text-gray-700">
                {issue.action}
              </p>
            </div>
          </div>

          {/* Impact */}
          <div className="rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>

              <div>
                <h2 className="font-bold">Community Impact</h2>
                <p className="text-xs text-gray-500">
                  Why this issue matters
                </p>
              </div>
            </div>

            <p className="mt-6 leading-7 text-gray-700">
              {issue.impact}
            </p>

            <div className="mt-6 rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-semibold">
                👥 {issue.similar_reports} related reports
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Similar community reports detected by CivicLens.
              </p>
            </div>
          </div>
        </div>

        {/* Report Group */}
        {issue.report_group && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Issue Group
            </p>

            <div className="mt-2 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold">{issue.report_group}</p>

                <p className="mt-1 text-sm text-gray-500">
                  This report is connected to other similar civic complaints.
                </p>
              </div>

              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600">
                {issue.similar_reports} related
              </span>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-gray-200 pt-5 text-xs text-gray-400">
          <span>
            Reported:{" "}
            {new Date(issue.created_at).toLocaleString()}
          </span>

          <span>
            CivicLens Issue #{issue.id}
          </span>
        </div>
      </section>
    </main>
  );
}
