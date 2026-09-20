"use client";

import Link from "next/link";
import { useState } from "react";
import {
  analyzeIssue as analyzeIssueAPI,
  createIssue,
  type IssueAnalysis,
} from "../../lib/api";

const categories = [
  "Auto-detect",
  "Roads",
  "Electricity",
  "Water",
  "Waste",
  "Transport",
  "Public Safety",
  "Environment",
];

export default function ReportPage() {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Auto-detect");

  const [analysis, setAnalysis] = useState<IssueAnalysis | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------
  // ANALYZE ISSUE
  // -----------------------------
  const handleAnalyze = async () => {
    if (!description.trim()) return;

    setIsAnalyzing(true);
    setAnalysis(null);
    setSubmitted(false);
    setError("");

    try {
      const result = await analyzeIssueAPI(
        description,
        category
      );

      setAnalysis(result);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to connect to CivicLens backend. Make sure FastAPI is running on port 8000."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // -----------------------------
  // SUBMIT ISSUE
  // -----------------------------
  const handleSubmit = async () => {
    if (!analysis) return;

    setIsSubmitting(true);
    setError("");

    try {
      await createIssue({
        description,
        location,
        category,
      });

      setSubmitted(true);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to submit the issue. Make sure the CivicLens backend is running."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // -----------------------------
  // RESET FORM
  // -----------------------------
  const resetForm = () => {
    setDescription("");
    setLocation("");
    setCategory("Auto-detect");
    setAnalysis(null);
    setSubmitted(false);
    setError("");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-bold text-white">
              C
            </div>

            <div>
              <p className="font-bold">CivicLens</p>

              <p className="text-xs text-slate-500">
                AI for better communities
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="text-sm font-semibold text-slate-600 hover:text-slate-950"
          >
            View Dashboard →
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-2xl">
            📝
          </div>

          <h1 className="text-4xl font-bold tracking-tight">
            Report a Civic Issue
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Describe what is happening. CivicLens will analyze the report,
            identify its category and estimate its priority.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex gap-3">
              <span className="text-lg">⚠️</span>

              <div>
                <p className="font-semibold text-red-800">
                  Something went wrong
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {submitted ? (
          /* Success State */
          <div className="rounded-3xl border border-green-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
              ✓
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Issue submitted successfully
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-slate-600">
              Your report has been saved to the CivicLens issue database.
              You can track it from the dashboard.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-700"
              >
                Open Dashboard
              </Link>

              <button
                onClick={resetForm}
                className="rounded-xl border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-50"
              >
                Report Another Issue
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
            {/* ========================= */}
            {/* FORM */}
            {/* ========================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="mb-7">
                <h2 className="text-xl font-bold">
                  Tell us about the problem
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  More details help CivicLens produce a better analysis.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  What is happening?
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Example: There is a large pothole near the college gate. It is dangerous for bikes at night..."
                  rows={7}
                  className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />

                <p className="mt-2 text-right text-xs text-slate-400">
                  {description.length} characters
                </p>
              </div>

              {/* Location */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold">
                  Location
                </label>

                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Example: College Gate, Sector 14"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              {/* Category */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={!description.trim() || isAnalyzing}
                className="mt-8 w-full rounded-2xl bg-slate-900 px-6 py-4 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAnalyzing
                  ? "Analyzing Issue..."
                  : "Analyze Issue →"}
              </button>
            </section>

            {/* ========================= */}
            {/* ANALYSIS */}
            {/* ========================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              {/* Empty State */}
              {!analysis && !isAnalyzing && (
                <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                    🤖
                  </div>

                  <h2 className="mt-5 text-xl font-bold">
                    AI analysis will appear here
                  </h2>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Describe your issue and click “Analyze Issue” to see its
                    category, priority, impact and recommended action.
                  </p>
                </div>
              )}

              {/* Loading */}
              {isAnalyzing && (
                <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-slate-900 text-2xl">
                    🤖
                  </div>

                  <h2 className="mt-5 text-xl font-bold">
                    Analyzing your report...
                  </h2>

                  <div className="mt-5 w-48 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-2 w-2/3 animate-pulse rounded-full bg-slate-900" />
                  </div>

                  <p className="mt-3 text-sm text-slate-500">
                    Detecting category and priority
                  </p>
                </div>
              )}

              {/* Analysis Result */}
              {analysis && !isAnalyzing && (
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        AI Analysis
                      </p>

                      <h2 className="mt-1 text-2xl font-bold">
                        Issue detected
                      </h2>
                    </div>

                    <div className="rounded-xl bg-green-50 px-3 py-2 text-xs font-bold text-green-700">
                      {analysis.confidence}% confidence
                    </div>
                  </div>

                  {/* Category */}
                  <div className="mt-7">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Category
                    </p>

                    <div className="mt-2 rounded-2xl bg-slate-50 px-5 py-4 font-semibold">
                      {analysis.category}
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Priority
                    </p>

                    <div
                      className={`mt-2 rounded-2xl px-5 py-4 font-bold ${
                        analysis.priority === "HIGH"
                          ? "bg-red-50 text-red-700"
                          : analysis.priority === "MEDIUM"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-green-50 text-green-700"
                      }`}
                    >
                      {analysis.priority}
                    </div>
                  </div>

                  {/* Impact */}
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Community Impact
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {analysis.impact}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="mt-5 rounded-2xl border border-slate-200 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Recommended Action
                    </p>

                    <p className="mt-2 text-sm font-semibold leading-6">
                      {analysis.action}
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="mt-6 w-full rounded-2xl bg-slate-900 px-6 py-4 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Submitting Issue..."
                      : "Submit Issue →"}
                  </button>
                </div>
              )}
            </section>
          </div>
        )}

        {/* Example */}
        {!submitted && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Try an example
            </p>

            <button
              onClick={() =>
                setDescription(
                  "There is a large pothole near the college gate. It is dangerous for bikes at night and could cause accidents."
                )
              }
              className="mt-2 text-left text-sm font-medium text-slate-700 hover:text-slate-950"
            >
              “There is a large pothole near the college gate...”
            </button>
          </div>
        )}
      </div>
    </main>
  );
}