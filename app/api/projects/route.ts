import { NextResponse } from "next/server";
import { WORKSTATION_PROJECTS } from "@/data/projects";
import { syncStills } from "@/scripts/sync-stills.mjs";

export async function GET() {
  if (process.env.NODE_ENV !== "production") {
    try {
      syncStills(true);
    } catch {}
  }
  return NextResponse.json(WORKSTATION_PROJECTS);
}
