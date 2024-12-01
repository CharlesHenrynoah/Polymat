import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LoadingIndicator } from '../../components/LoadingIndicator';

interface VisualSpaceData {
  id: number;
  title: string;
  description: string;
  user_id: number;
  created_at: string;
  last_modified: string;
  last_accessed: string;
}

export const VisualSpace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [space, setSpace] = useState<VisualSpaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVisualSpace = async () => {
      try {
        // Update last_accessed
        const now = new Date().toISOString();
        const { data, error: updateError } = await supabase
          .from('visual_spaces')
          .update({ last_accessed: now })
          .eq('id', id)
          .select()
          .single();

        if (updateError) throw updateError;
        if (!data) throw new Error('Visual space not found');

        setSpace(data);
      } catch (err) {
        console.error('Error loading visual space:', err);
        setError(err instanceof Error ? err.message : 'Failed to load visual space');
      } finally {
        setLoading(false);
      }
    };

    loadVisualSpace();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-screen"><LoadingIndicator /></div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  if (!space) return <div className="flex items-center justify-center h-screen">Visual space not found</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{space.title}</h1>
          <p className="text-zinc-400">{space.description}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for future content */}
          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Welcome to Your Space</h3>
            <p className="text-zinc-400">
              This is your personal visual space. Here you can organize and visualize your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualSpace;
