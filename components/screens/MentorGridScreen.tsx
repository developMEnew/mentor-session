"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getJson } from "@/lib/client-api";
import { useToast } from "../ToastProvider";
import { MentorCard } from "../ui/MentorCard";

interface Mentor {
  id: string;
  fullName: string;
  batch: string | null;
  academicInterests: string[];
  technicalInterests: string[];
  profilePhotoUrl: string | null;
  capacity: number;
  allocatedCount: number;
}

export function MentorGridScreen() {
  const { showToast } = useToast();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJson<{ mentors: Mentor[] }>("/api/mentors")
      .then((payload) => setMentors(payload.mentors))
      .catch((error: unknown) =>
        showToast(error instanceof Error ? error.message : "Unable to load mentors."),
      )
      .finally(() => setLoading(false));
  }, [showToast]);

  return (
    <div className="container">
      <h2 className="section-title">Senior Mentor Directory</h2>
      <p className="section-sub">
        Browse mentors for this session. Mentees can register and submit
        their top&nbsp;3 preferences from this pool.
      </p>

      <div className="form-note" style={{ marginBottom: 28 }}>
        <svg
          className="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ flex: "none", marginTop: 1 }}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <span>
          Want to request a mentor?{" "}
          <Link href="/mentee">
            <b>Register as a mentee</b>
          </Link>{" "}
          to pick your top&nbsp;3 choices. Mentor profiles are managed by administrators.
        </span>
      </div>

      <div className="mentor-grid">
        {loading && <p className="muted">Loading mentors…</p>}
        {!loading && mentors.length === 0 && (
          <p className="muted">No mentors have been added yet. Check back soon.</p>
        )}

        {mentors.map((mentor, index) => {
          const isFull = mentor.allocatedCount >= mentor.capacity;

          return (
            <MentorCard
              key={mentor.id}
              id={mentor.id}
              fullName={mentor.fullName}
              batch={mentor.batch}
              academicInterests={mentor.academicInterests}
              technicalInterests={mentor.technicalInterests}
              profilePhotoUrl={mentor.profilePhotoUrl}
              index={index}
              isFull={isFull}
            />
          );
        })}
      </div>
    </div>
  );
}
