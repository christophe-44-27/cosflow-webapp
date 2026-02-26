export interface PackingListItem {
  id: number;
  name: string;
  quantity: number;
  category: string | null;
  notes: string | null;
  is_packed: boolean;
  packing_list_id: number;
}

export interface PackingList {
  id: number;
  name: string;
  description: string | null;
  due_date: string | null;
  project_id: number;
  items: PackingListItem[];
}
