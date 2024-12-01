export interface VisualSpace {
  id: string;
  title: string;
  createdAt: Date;
  lastModified: Date;
  lastAccessed: Date;
  preview?: string; // URL de l'aperçu
  description?: string;
  tags?: string[];
}
