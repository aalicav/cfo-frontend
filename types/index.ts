export interface Usuario {
  id: string;
  name: string;
  email: string;
  role: string;
  profile_photo_url?: string;
}

export interface TeamMembership {
  id?: string;
  team_id: string;
  joined_at: string;
  left_at?: string;
  role?: string;
  team?: {
    id: string;
    name: string;
    category?: string;
  };
}

export interface Atleta {
  id: string;
  code?: string;
  birth_date?: string;
  gender?: string;
  height?: number;
  weight?: number;
  document_number?: string;
  document_type?: string;
  phone?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  health_insurance?: string;
  health_observations?: string;
  photo_url?: string;
  status: "active" | "inactive" | "suspended" | "pending";
  group?: string;
  created_at?: string;
  updated_at?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  modalities?: string[];
  team_memberships?: TeamMembership[];
}

export interface Indicador {
  id?: string;
  evaluation_id?: string;
  name: string;
  value: string | number;
  unit: string;
  reference?: string | number;
  percentage?: number;
  description?: string;
  observation?: string;
  order?: number;
}

export interface Avaliacao {
  id: string;
  athlete_id: string;
  created_by: string | Usuario;
  evaluation_date: string;
  type: 'Física' | 'Técnica' | 'Médica';
  title: string;
  description?: string;
  observations?: string;
  recommendations?: string;
  status: 'pending' | 'completed' | 'cancelled';
  follow_up_date?: string;
  indicators?: Indicador[];
  athlete?: Atleta;
  createdBy?: Usuario;
}

export interface AvaliacaoFrontend {
  id: string;
  type: string;
  date: string;
  responsible: string;
  athlete: {
    id: string;
    name: string;
    photo?: string;
  };
  modality: string;
  observations?: string;
  indicators?: {
    name: string;
    value: string | number;
    unit: string;
    reference?: string | number;
    percentage?: number;
    description?: string;
    observation?: string;
  }[];
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

// Interfaces para Teams (Times)
export interface Team {
  id: string;
  name: string;
  modality: string;
  category: string;
  coach: string;
  description?: string;
  creation_date?: string;
  medals: number;
  competitions: number;
  weekly_trainings: number;
  created_at: string;
  updated_at: string;
  athletes?: Atleta[];
  technical_committee?: TechnicalCommitteeMember[];
  training_locations?: TrainingLocation[];
  competitions_history?: Competition[];
  upcoming_events?: Event[];
}

export interface TechnicalCommitteeMember {
  id?: string;
  team_id: string;
  name: string;
  role: string;
  contact?: string;
  photo_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TrainingLocation {
  id?: string;
  team_id: string;
  name: string;
  address?: string;
  days: string;
  schedule: string;
  space_id?: string;
  created_at?: string;
  updated_at?: string;
  space?: {
    id: string;
    name: string;
  };
}

export interface Competition {
  id?: string;
  team_id: string;
  name: string;
  date: string;
  location: string;
  result: string;
  description?: string;
  highlights?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Event {
  id?: string;
  team_id: string;
  name: string;
  date: string;
  location: string;
  description?: string;
  type: string;
  created_at?: string;
  updated_at?: string;
} 