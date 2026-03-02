export interface ProjectStats {
  progression_percentage: number;
  is_manual_progression: boolean;
  elements: {
    total: number;
    completed: number;
    remaining: number;
  };
  budget: {
    estimated: number | null;
    spent: number;
    remaining: number | null;
    is_over_budget: boolean;
  };
  time: {
    total_hours: number;
    formatted: string;
  };
  deadline: {
    date: string | null;
    days_until: number | null;
    is_overdue: boolean;
  } | null;
  priority: string;
  status: string;
}
