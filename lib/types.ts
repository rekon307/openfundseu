export interface Opportunity {
  id: string;
  title: string;
  programme: string;
  portal: string;
  deadline: string;
  status: "open" | "upcoming" | "closed";
  budget: string;
  cofinancing: string;
  eligible_for: string[];
  sectors: string[];
  regions: string[];
  url: string;
  summary: string;
  scraped_at: string;
}

export interface UserProfile {
  background: string;
  github?: string;
  linkedin?: string;
  website?: string;
  entityType: string;
}
