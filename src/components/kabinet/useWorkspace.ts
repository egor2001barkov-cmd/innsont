"use client";

import { useEffect, useState } from "react";
import { loadSession, planForSession, type Session } from "@/lib/session";
import {
  hasOnboardedProject,
  loadActiveProjectId,
  loadProjects,
  type Project,
} from "@/lib/workspace";

export function useWorkspace() {
  const [session, setSession] = useState<Session | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const sync = () => {
      setSession(loadSession());
      const ps = loadProjects();
      setProjects(ps);
      setActiveId(loadActiveProjectId(ps));
    };
    sync();
    window.addEventListener("insont-session", sync);
    window.addEventListener("insont-workspace", sync);
    return () => {
      window.removeEventListener("insont-session", sync);
      window.removeEventListener("insont-workspace", sync);
    };
  }, []);

  const project = projects.find((p) => p.id === activeId) || projects[0];
  const plan = planForSession(session);
  const needsOnboarding = !hasOnboardedProject(projects);
  return {
    session,
    setSession,
    projects,
    project,
    plan,
    needsOnboarding,
    ready: Boolean(session),
  };
}
