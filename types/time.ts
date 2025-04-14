export interface Time {
  id: number;
  name: string;
  modality: string;
  category: string;
  coach: string;
  description?: string;
  creation_date?: string;
  medals?: number;
  competitions?: number;
  weekly_trainings?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  
  // Campos adicionais usados na UI
  status?: 'active' | 'inactive' | 'training' | 'competing';
  cover_image?: string;
  logo_url?: string;
  coach_name?: string;
  athletes_count?: number;
  achievements_count?: number;
  competitions_count?: number;
  founded_at?: string;
}

export type TimeStatus = NonNullable<Time['status']>; 