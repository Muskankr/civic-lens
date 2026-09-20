"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getIssues, type Issue } from "../lib/api";

const features = [
  {
    icon: "📝",
    title: "Report Easily",
    description:
      "Describe a civic issue in seconds with its location and category.",
  },
  {
    icon: "🤖",
    title: "AI Analysis",
    description:
      "Gemini AI identifies the issue category, urgency, confidence and recommended action.",
  },
  {
    icon: "👥",
    title: "Community Intelligence",
    description:
      "Related reports are grouped to reveal recurring problems affecting the community.",
  },
  {
    icon: "📊",
    title: "Track Insights",
    description:
      "Explore priorities, active reports and community impact through one dashboard.",
  },
];

const categories = [
  "🚧 Roads",
  "💡 Electricity",
  "💧 Water",
  "🗑️ Waste",
  "🚦 Transport",
  "🛡️ Public Safety",
  "🌱 Environment",
];

export default function Home() {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    async function loadIssues() {
      try {
        const data = await getIssues();
        setIssues(data);
      } catch (error) {
        console.error("Unable to load CivicLens statistics:", error);
      }
    }

    loadIssues();
  }, []);

  const totalReports = issues.length;

  const highPriority = issues.filter(
    (issue) => issue.priority === "HIGH"
  ).length;

  const activeReports = issues.filter(
    (issue) => issue.status === "OPEN"
  ).length;

  const issueGroups = new Set(
    issues
      .map((issue) => issue.report_group)
      .filter(Boolean)
  ).size;

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link href="/" className="flex items-center gap-2">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-xl text-white">
              C
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                CivicLens
              </h1>

              <p className="text-xs text-slate-500">
                AI for better communities
              </p>
            </div>

          </Link>

          <div className="hidden items-center gap-8 md:flex">

            <Link
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              How it works
            </Link>

            <Link
              href="#issues"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Issues
            </Link>

            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Dashboard
            </Link>

            <Link
              href="/report"
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Report an Issue
            </Link>

          </div>

        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">

        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(79,70,229,0.10),_transparent_35%)]" />

        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">

          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">

              <span className="h-2 w-2 rounded-full bg-green-500" />

              AI-powered civic intelligence

            </div>

            <h2 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-slate-950 md:text-6xl">

              Turn everyday problems into{" "}

              <span className="text-indigo-600">
                actionable change.
              </span>

            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              CivicLens helps communities report civic problems, understand
              their impact, identify urgent issues and discover recurring
              problems through AI-powered analysis.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <Link
                href="/report"
                className="rounded-xl bg-slate-900 px-6 py-3.5 text-center font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-700"
              >
                Report a Problem →
              </Link>

              <Link
                href="/dashboard"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-center font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                Explore Dashboard
              </Link>

            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              <span>✓ AI classification</span>
              <span>✓ Priority detection</span>
              <span>✓ Related reports</span>
              <span>✓ Community impact</span>
            </div>

          </div>

          {/* AI Preview */}
          <div className="relative">

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-2xl shadow-slate-200/60">

              <div className="rounded-2xl border border-slate-200 bg-white p-6">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      CivicLens AI
                    </p>

                    <h3 className="mt-1 text-xl font-bold">
                      Issue analyzed
                    </h3>
                  </div>

                  <div className="rounded-xl bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
                    AI Analysis
                  </div>

                </div>

                <div className="mt-6 rounded-2xl bg-slate-50 p-5">

                  <p className="text-sm leading-6 text-slate-600">
                    “A large pothole has appeared near the college gate
                    and is creating a safety risk for two-wheelers.”
                  </p>

                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">

                  <div className="rounded-xl border border-slate-200 p-4">

                    <p className="text-xs text-slate-500">
                      Category
                    </p>

                    <p className="mt-1 font-semibold">
                      🚧 Roads
                    </p>

                  </div>

                  <div className="rounded-xl border border-red-100 bg-red-50 p-4">

                    <p className="text-xs text-red-500">
                      Priority
                    </p>

                    <p className="mt-1 font-semibold text-red-700">
                      HIGH
                    </p>

                  </div>

                </div>

                <div className="mt-4 rounded-xl border border-slate-200 p-4">

                  <p className="text-xs text-slate-500">
                    Recommended Action
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    Road inspection and necessary repair

                  </p>

                </div>

              </div>

            </div>

            <div className="absolute -bottom-5 -left-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl">

              <p className="text-xs text-slate-500">
                Community intelligence
              </p>

              <p className="text-xl font-bold">
                Similar reports grouped
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Live Stats */}
      <section className="border-y border-slate-200 bg-slate-50">

        <div className="mx-auto grid max-w-7xl grid-cols-2 px-6 py-10 md:grid-cols-4">

          <Stat
            value={totalReports}
            label="Reports Submitted"
          />

          <Stat
            value={highPriority}
            label="High Priority"
          />

          <Stat
            value={issueGroups}
            label="Issue Groups"
          />

          <Stat
            value={activeReports}
            label="Active Reports"
          />

        </div>

      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-6 py-24"
      >

        <div className="max-w-2xl">

          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            Simple workflow
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            From report to civic intelligence.
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            CivicLens transforms unstructured citizen reports into
            structured, prioritized and actionable information.
          </p>

        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {features.map((feature, index) => (

            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                  {feature.icon}
                </div>

                <span className="text-sm font-semibold text-slate-400">
                  0{index + 1}
                </span>

              </div>

              <h3 className="mt-6 text-xl font-bold">
                {feature.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {feature.description}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* Categories */}
      <section
        id="issues"
        className="bg-slate-950 px-6 py-24 text-white"
      >

        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              One platform
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              Built for real-world problems.
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              From damaged roads to water leakage, CivicLens organizes
              everyday civic problems into a clear priority queue.
            </p>

          </div>

          <div className="mt-10 flex flex-wrap gap-3">

            {categories.map((category) => (

              <div
                key={category}
                className="rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-200"
              >
                {category}
              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="px-6 py-24">

        <div className="mx-auto max-w-5xl rounded-3xl bg-slate-100 px-8 py-14 text-center md:px-16">

          <h2 className="text-4xl font-bold tracking-tight">
            See a problem? Make it visible.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Report an issue and let CivicLens transform it into
            structured, actionable information.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/report"
              className="rounded-xl bg-slate-900 px-7 py-3.5 font-semibold text-white transition hover:bg-slate-700"
            >
              Report an Issue →
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-800 transition hover:bg-white"
            >
              View Community Impact
            </Link>

          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-8">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-slate-500 md:flex-row">

          <p>
            © 2026 CivicLens AI
          </p>

          <p>
            Tech for a Better Tomorrow
          </p>

        </div>

      </footer>

    </main>
  );
}


// --------------------------------------------------
// Stat Component
// --------------------------------------------------

function Stat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="border-slate-200 px-5 py-4 text-center md:border-r last:border-r-0">

      <p className="text-3xl font-bold tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {label}
      </p>

    </div>
  );
}