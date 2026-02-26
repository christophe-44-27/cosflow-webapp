export interface ProjectNote {
  id: number;
  project_id: number;
  title: string;
  description: string;
  is_private: boolean;
  position: number | null;
  due_date: string | null;
  notification_sent: boolean;
  is_due: boolean;
  created_at: string;
  updated_at: string;
}
