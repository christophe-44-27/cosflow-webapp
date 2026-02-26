export interface TimeEntryProjectElement {
  id: number;
  title: string;
}

export interface TimeEntry {
  id: number;
  project_id: number;
  hours: string;
  minutes: string;
  description: string | null;
  date: string;
  total_minutes: number;
  formatted_time: string;
  project_element?: TimeEntryProjectElement | null;
  timesheetable_id: string;
  timesheetable_type: string;
  created_at: string;
  updated_at: string;
}

export interface NewTimeEntryForm {
  hours: number;
  minutes: number;
  description: string;
  element_id: string;
}
