import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from './lib/supabase';

function App() {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserSpace = async () => {
      try {
        // Get the current user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          navigate('/login', { replace: true });
          return;
        }

        // Find the user by username
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('username', username)
          .single();

        if (userError || !userData) {
          throw new Error('User not found');
        }

        // Get user's first visual space
        const { data: spaceData, error: spaceError } = await supabase
          .from('visual_spaces')
          .select('id')
          .eq('user_id', userData.id)
          .order('created_at', { ascending: true })
          .limit(1)
          .single();

        if (spaceError || !spaceData) {
          throw new Error('No visual space found');
        }

        // Redirect to the visual space
        navigate(`/space/${spaceData.id}`, { replace: true });
      } catch (error) {
        console.error('Error loading user space:', error);
        navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserSpace();
  }, [username, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return null;
}

export default App;
