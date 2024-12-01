import { supabase } from '../lib/supabase';
import { VisualSpace } from '../types/visualSpace';

export const visualSpaceService = {
  async getVisualSpaces(userId: string): Promise<VisualSpace[]> {
    const { data, error } = await supabase
      .from('visual_spaces')
      .select('*')
      .eq('user_id', userId)
      .order('last_accessed', { ascending: false });

    if (error) {
      console.error('Error fetching visual spaces:', error);
      throw new Error('Failed to fetch visual spaces');
    }

    return data.map(space => ({
      id: space.id,
      title: space.title,
      createdAt: new Date(space.created_at),
      lastModified: new Date(space.last_modified),
      lastAccessed: space.last_accessed ? new Date(space.last_accessed) : new Date(space.created_at),
      description: space.description || undefined,
    }));
  },

  async checkTitleExists(userId: string, title: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('visual_spaces')
      .select('id')
      .eq('user_id', userId)
      .ilike('title', title)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking title:', error);
      throw new Error('Failed to check title');
    }

    return !!data;
  },

  async suggestUniqueName(userId: string, baseTitle: string): Promise<string> {
    let counter = 1;
    let title = baseTitle;
    
    while (await this.checkTitleExists(userId, title)) {
      counter++;
      title = `${baseTitle} (${counter})`;
    }
    
    return title;
  },

  async createVisualSpace(userId: string, title: string): Promise<VisualSpace | null> {
    // Vérifier si le titre existe déjà
    const titleExists = await this.checkTitleExists(userId, title);
    if (titleExists) {
      const uniqueTitle = await this.suggestUniqueName(userId, title);
      throw new Error(`A Visual Space with this name already exists. Try "${uniqueTitle}" instead.`);
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('visual_spaces')
      .insert([
        {
          title,
          user_id: userId,
          created_at: now,
          last_modified: now,
          last_accessed: now,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating visual space:', error);
      throw new Error('Failed to create visual space');
    }

    return {
      id: data.id,
      title: data.title,
      createdAt: new Date(data.created_at),
      lastModified: new Date(data.last_modified),
      lastAccessed: new Date(data.last_accessed),
      description: data.description || undefined,
    };
  },

  async updateLastAccessed(spaceId: string): Promise<void> {
    const { error } = await supabase
      .from('visual_spaces')
      .update({ last_accessed: new Date().toISOString() })
      .eq('id', spaceId);

    if (error) {
      console.error('Error updating last accessed:', error);
      throw new Error('Failed to update last accessed');
    }
  },

  async updateVisualSpace(
    spaceId: string,
    updates: Partial<Omit<VisualSpace, 'id' | 'createdAt' | 'lastAccessed'>>
  ): Promise<boolean> {
    // Si le titre est mis à jour, vérifier s'il existe déjà
    if (updates.title) {
      const { data: space } = await supabase
        .from('visual_spaces')
        .select('user_id')
        .eq('id', spaceId)
        .single();

      if (space) {
        const titleExists = await this.checkTitleExists(space.user_id, updates.title);
        if (titleExists) {
          throw new Error('A Visual Space with this name already exists');
        }
      }
    }

    const { error } = await supabase
      .from('visual_spaces')
      .update({
        ...updates,
        last_modified: new Date().toISOString(),
      })
      .eq('id', spaceId);

    if (error) {
      console.error('Error updating visual space:', error);
      throw new Error('Failed to update visual space');
    }

    return true;
  },

  async deleteVisualSpace(spaceId: string): Promise<boolean> {
    const { error } = await supabase
      .from('visual_spaces')
      .delete()
      .eq('id', spaceId);

    if (error) {
      console.error('Error deleting visual space:', error);
      throw new Error('Failed to delete visual space');
    }

    return true;
  },
};
