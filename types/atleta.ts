export interface Atleta {
  id: string;
  name: string;
  birth_date?: string;
  document_id?: string;
  category?: string;
  modality?: string;
  team_name?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'pending' | 'ativo' | 'inativo' | 'suspenso';
  profile_image?: string;
  achievements_count?: number;
  evaluations_count?: number;
  training_count?: number;
  
  // Propriedades adicionais para o frontend
  modalities?: string[];
  user?: {
    id: string;
    name: string;
    email?: string;
    photo?: string;
  };
}

export type AtletaStatus = Atleta['status']; 