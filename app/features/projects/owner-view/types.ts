export interface ProjectElement {
  id: number;
  title: string;
  type: string;
  price: string | number | null;
  is_done: boolean;
  to_make: boolean;
  project_id: number;
  category_id: number | null;
  parent_id: number | null;
  total_working_time: string;
  category?: { id: number; name: string } | null;
  children?: ProjectElement[];
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
  project_element?: {
    id: number;
    title: string;
  } | null;
  timesheetable_id: string;
  timesheetable_type: string;
  created_at: string;
  updated_at: string;
}

export interface ElementCategory {
  id: number;
  name: string;
}

export interface SectionsState {
  info: boolean;
  elements: boolean;
  time: boolean;
  gallery: boolean;
}

export interface NewTimeEntryForm {
  hours: number;
  minutes: number;
  description: string;
  element_id: string;
}

