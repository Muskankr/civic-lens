"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { getIssues, type Issue } from "../../lib/api";

export default function DashboardPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  useEffect(() => {
    loadIssues();
  }, []);

  async function loadIssues() {
    try {
      setLoading(true);
      setError("");

      const data = await getIssues();
      setIssues(data);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to connect to CivicLens backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const totalReports = issues.length;

  const highPriority = issues.filter(
    (issue) => issue.priority === "HIGH"
  ).length;

  const activeReports = issues.filter(
    (issue) => issue.status === "OPEN"
  ).length;

  const issueGroups = useMemo(() => {
    const groups = new Set(
      issues
        .map((issue) => issue.report_group)
        .filter(Boolean)
    );

    return groups.size;
  }, [issues]);

  // --------------------------------------------------
  // Community impact groups
  // --------------------------------------------------

  const communityGroups = useMemo(() => {
    const groups = new Map<
      string,
      {
        group: string;
        issue: Issue;
        count: number;
      }
    >();

    for (const issue of issues) {
      const group = issue.report_group;

      if (!group) continue;

      if (!groups.has(group)) {
        groups.set(group, {
          group,
          issue,
          count: 0,
        });
      }

      const current = groups.get(group)!;

      current.count += 1;

      if (issue.priority === "HIGH") {
        current.issue = issue;
      }
    }

    return Array.from(groups.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [issues]);

  // --------------------------------------------------
  // Filtered reports
  // --------------------------------------------------

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesSearch =
        issue.description
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        issue.category
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (issue.location || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesPriority =
        priorityFilter === "ALL" ||
        issue.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [issues, search, priorityFilter]);

  // --------------------------------------------------
  // AI insights
  // --------------------------------------------------

  const aiInsight = useMemo(() => {
    if (issues.length === 0) {
      return "No reports available yet. Submit a civic issue to generate community insights.";
    }

    const highCount = issues.filter(
      (issue) => issue.priority === "HIGH"
    ).length;

    const categories = new Map<string, number>();

    for (const issue of issues) {
      categories.set(
        issue.category,
        (categories.get(issue.category) || 0) + 1
      );
    }

    const mostReported = Array.from(categories.entries()).sort(
      (a, b) => b[1] - a[1]
    )[0];

    if (highCount > 0 && mostReported) {
      return `${mostReported[0]} is currently the most reported civic category with ${mostReported[1]} report${
        mostReported[1] > 1 ? "s" : ""
      }. ${highCount} high-priority issue${
        highCount > 1 ? "s require" : " requires"
      } attention.`;
    }

    if (mostReported) {
      return `${mostReported[0]} is currently the most reported civic category with ${mostReported[1]} report${
        mostReported[1] > 1 ? "s" : ""
      }.`;
    }

    return "CivicLens is monitoring the submitted community reports.";
  }, [issues]);

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-64 rounded-lg bg-slate-200" />

            <div className="grid gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-32 rounded-2xl bg-slate-100"
                />
              ))}
            </div>

            <div className="h-72 rounded-2xl bg-slate-100" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* --------------------------------------------- */}
      {/* Navbar */}
      {/* --------------------------------------------- */}

      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            href="/"
            className="text-xl font-bold tracking-tight"
          >
            Civic<span className="text-indigo-600">Lens</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium"
            >
              Dashboard
            </Link>

            <Link
              href="/report"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Report Issue
            </Link>
          </div>

        </div>
      </nav>

      {/* --------------------------------------------- */}
      {/* Main */}
      {/* --------------------------------------------- */}

      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Header */}

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">

          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Civic Intelligence
            </p>

            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Community Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              AI-powered insights from citizen reports and
              related civic issues.
            </p>
          </div>

          <button
            onClick={loadIssues}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            ↻ Refresh
          </button>

        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* --------------------------------------------- */}
        {/* Stats */}
        {/* --------------------------------------------- */}

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            label="Total Reports"
            value={totalReports}
            description="Citizen submissions"
            icon="📋"
          />

          <StatCard
            label="High Priority"
            value={highPriority}
            description="Require attention"
            icon="🚨"
          />

          <StatCard
            label="Issue Groups"
            value={issueGroups}
            description="Related civic problems"
            icon="🧩"
          />

          <StatCard
            label="Active Reports"
            value={activeReports}
            description="Currently open"
            icon="🔎"
          />

        </section>

        {/* --------------------------------------------- */}
        {/* AI Insight */}
        {/* --------------------------------------------- */}

        <section className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">

          <div className="flex gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-xl text-white">
              ✦
            </div>

            <div>
              <p className="text-sm font-semibold text-indigo-700">
                CivicLens AI Insight
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-700">
                {aiInsight}
              </p>
            </div>

          </div>

        </section>

        {/* --------------------------------------------- */}
        {/* Community Impact */}
        {/* --------------------------------------------- */}

        <section className="mb-10">

          <div className="mb-5">
            <h2 className="text-xl font-bold">
              Community Impact
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Related reports are grouped to identify recurring
              civic problems.
            </p>
          </div>

          {communityGroups.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

              <div className="text-4xl">👥</div>

              <h3 className="mt-3 font-semibold">
                No related issue groups yet
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                Submit similar reports from the same location
                to see community impact here.
              </p>

            </div>

          ) : (

            <div className="grid gap-4 md:grid-cols-2">

              {communityGroups.map((group) => (

                <div
                  key={group.group}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
                        {getCategoryIcon(group.issue.category)}
                      </div>

                      <div>
                        <h3 className="font-semibold">
                          {group.issue.category}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {group.issue.location || "Location not provided"}
                        </p>
                      </div>

                    </div>

                    <PriorityBadge
                      priority={group.issue.priority}
                    />

                  </div>

                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
                    {group.issue.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                    <span className="text-sm font-semibold text-indigo-600">
                      👥 {group.count} citizen
                      {group.count !== 1 ? "s" : ""} reported this
                    </span>

                    <span className="text-xs text-slate-400">
                      Group {group.group}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* --------------------------------------------- */}
        {/* Report Queue */}
        {/* --------------------------------------------- */}

        <section>

          <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>
              <h2 className="text-xl font-bold">
                Issue Queue
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review and monitor submitted civic reports.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search reports..."
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-500"
              />

              <select
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(event.target.value)
                }
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none"
              >
                <option value="ALL">All priorities</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

            </div>

          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

            {filteredIssues.length === 0 ? (

              <div className="p-10 text-center">

                <div className="text-3xl">🔍</div>

                <p className="mt-3 font-medium">
                  No reports found
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>

              </div>

            ) : (

              <div className="divide-y divide-slate-100">

                {filteredIssues.map((issue) => (

                  <div
                    key={issue.id}
                    className="p-5 transition hover:bg-slate-50"
                  >

                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                            {issue.issue_code}
                          </span>

                          <span className="text-sm font-semibold">
                            {issue.category}
                          </span>

                          <PriorityBadge
                            priority={issue.priority}
                          />

                          {issue.similar_reports > 1 && (
                            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                              👥 {issue.similar_reports} related
                            </span>
                          )}

                        </div>

                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">
                          {issue.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">

                          <span>
                            📍 {issue.location || "Location not provided"}
                          </span>

                          <span>
                            🤖 {issue.analysis_method}
                          </span>

                          <span>
                            Confidence: {Math.round(issue.confidence)}%
                          </span>

                          <span>
                            {formatDate(issue.created_at)}
                          </span>

                        </div>

                      </div>

                      <div className="shrink-0">

                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                          {issue.status}
                        </span>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </section>

        {/* --------------------------------------------- */}
        {/* CTA */}
        {/* --------------------------------------------- */}

        <section className="mt-10 rounded-2xl bg-slate-900 p-7 text-white">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>
              <h2 className="text-xl font-bold">
                Spotted a civic problem?
              </h2>

              <p className="mt-1 text-sm text-slate-300">
                Report it and let CivicLens analyze its impact.
              </p>
            </div>

            <Link
              href="/report"
              className="inline-flex w-fit rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Report an Issue →
            </Link>

          </div>

        </section>

      </div>
    </main>
  );
}


// --------------------------------------------------
// Components
// --------------------------------------------------

function StatCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: number;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg">
          {icon}
        </div>

      </div>

      <p className="mt-5 text-3xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold">
        {label}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

    </div>
  );
}


function PriorityBadge({
  priority,
}: {
  priority: Issue["priority"];
}) {
  const classes = {
    HIGH: "bg-red-50 text-red-700",
    MEDIUM: "bg-amber-50 text-amber-700",
    LOW: "bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${classes[priority]}`}
    >
      {priority}
    </span>
  );
}


function getCategoryIcon(category: string) {
  const icons: Record<string, string> = {
    Roads: "🛣️",
    Electricity: "⚡",
    Water: "💧",
    Waste: "🗑️",
    Transport: "🚌",
    "Public Safety": "🛡️",
    Environment: "🌱",
  };

  return icons[category] || "🏙️";
}


function formatDate(date: string) {
  try {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return date;
  }
}