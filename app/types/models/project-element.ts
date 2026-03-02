import type { ElementCategory } from './element-category';

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
  is_leaf?: boolean;
  position?: number;
  total_working_time: string;
  category?: ElementCategory | null;
  children?: ProjectElement[];
}
