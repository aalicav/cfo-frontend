export interface Usuario {
  id: string;
  name: string;
  email: string;
  role: string;
  profile_photo_url?: string;
}

export interface Atleta {
  id: string;
  user_id: string;
  registration_number?: string;
  birth_date?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_conditions?: string;
  allergies?: string;
  modalities?: string[];
  blood_type?: string;
  height?: number;
  weight?: number;
  identity_document?: string;
  document_number?: string;
  nationality?: string;
  status: 'active' | 'inactive' | 'suspended';
  joined_at?: string;
  expires_at?: string;
  notes?: string;
  achievements?: any[];
  metrics?: any;
  is_professional?: boolean;
  has_health_insurance?: boolean;
  health_insurance_provider?: string;
  health_insurance_number?: string;
  user?: Usuario;
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
  created_by: string;
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