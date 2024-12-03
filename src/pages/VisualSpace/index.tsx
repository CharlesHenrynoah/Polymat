import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

// Simple Spinner component
const Spinner = () => (
  <div className="flex items-center justify-center h-screen bg-zinc-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
  </div>
);

interface VisualSpaceData {
  id: string;
  title: string;
  description: string;
  user_id: string;
  created_at: string;
  last_modified: string;
  last_accessed: string;
}

interface UserData {
  username: string;
  profile_image: string | null;
}

const VisualSpace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [space, setSpace] = useState<VisualSpaceData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVisualSpace = async () => {
      try {
        if (!id) {
          throw new Error('No space ID provided');
        }

        // Get the current user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          navigate('/login', { replace: true });
          return;
        }

        // Load the visual space
        const { data: spaceData, error: spaceError } = await supabase
          .from('visual_spaces')
          .select('*')
          .eq('id', id)
          .single();

        if (spaceError) throw spaceError;
        if (!spaceData) throw new Error('Visual space not found');

        // Load the space owner's data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('username, profile_image')
          .eq('id', spaceData.user_id)
          .single();

        if (userError) throw userError;
        if (!userData) throw new Error('Space owner not found');

        // Update last accessed time
        const { error: updateError } = await supabase
          .from('visual_spaces')
          .update({ last_accessed: new Date().toISOString() })
          .eq('id', id);

        if (updateError) {
          console.error('Failed to update last_accessed:', updateError);
        }

        setSpace(spaceData);
        setUser(userData);
        setError(null);

      } catch (err: any) {
        console.error('Error loading visual space:', err);
        setError(err.message);
        setSpace(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadVisualSpace();
  }, [id, navigate]);

  if (loading) {
    return <Spinner />;
  }

  if (error || !space || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-zinc-900 text-white">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500 mb-4">{error || 'Failed to load visual space'}</p>
        <button
          onClick={() => navigate('/', { replace: true })}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            {user.profile_image && (
              <img
                src={user.profile_image}
                alt={user.username}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold">{space.title}</h1>
              <p className="text-zinc-400">Created by {user.username}</p>
            </div>
          </div>
          <p className="text-lg text-zinc-300">{space.description}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Contenu de l'espace visuel ici */}
        </div>
      </div>
    </div>
  );
};

export default VisualSpace;
