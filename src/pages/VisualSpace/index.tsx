import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Chat } from '../../components/Chat';
import { UserMenu } from '../../components/UserMenu';
import { BackgroundSettings } from '../../components/Settings/BackgroundSettings';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { VisualSpaceData, UserData } from '../../types';

// Inline Spinner component
const Spinner = () => (
  <div className="flex items-center justify-center h-screen bg-[#050505]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
  </div>
);

const VisualSpace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [space, setSpace] = useState<VisualSpaceData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isBackgroundSettingsOpen, setIsBackgroundSettingsOpen] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&q=80');

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

        // Get user profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, username, profile_image, email')
          .eq('email', currentUser.email)
          .single();

        if (userError || !userData) {
          throw new Error('Failed to load user profile');
        }

        setUser(userData);

        // Get visual space data
        const { data: spaceData, error: spaceError } = await supabase
          .from('visual_spaces')
          .select('*')
          .eq('id', id)
          .single();

        if (spaceError || !spaceData) {
          throw new Error('Failed to load visual space');
        }

        // Update last_accessed
        await supabase
          .from('visual_spaces')
          .update({ last_accessed: new Date().toISOString() })
          .eq('id', id);

        setSpace(spaceData);
      } catch (err: any) {
        console.error('Error loading visual space:', err);
        setError(err.message);
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
      <div className="flex items-center justify-center h-screen bg-zinc-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{error || 'Failed to load visual space'}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-[#050505]">
      <div
        className={`bg-[#0A0A0A] border-r border-[#151515] flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-0 opacity-0' : 'w-80 opacity-100'
        } overflow-hidden`}
      >
        {/* Sidebar content */}
        <div className="p-4">
          <h2 className="text-xl font-bold text-white mb-2">{space.title}</h2>
          <p className="text-zinc-400">{space.description}</p>
        </div>
      </div>

      <button
        onClick={() => setIsSidebarCollapsed(prev => !prev)}
        className="fixed left-0 top-1/2 -translate-y-1/2 bg-[#0A0A0A] p-1.5 rounded-r-lg border border-l-0 border-[#151515] hover:bg-[#151515] transition-colors z-20 text-zinc-400 hover:text-orange-500"
      >
        {isSidebarCollapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="flex-none flex items-center justify-between p-4 border-b border-[#151515] bg-[#0A0A0A]/80 backdrop-blur-sm relative z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white">{space.title}</h2>
          </div>

          <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold font-['Orbitron'] text-orange-500 whitespace-nowrap">
            Polymat
          </h1>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsBackgroundSettingsOpen(true)}
              className="text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-orange-500 rounded-full transition-colors"
            >
              Change background
            </button>
            <UserMenu 
              user={{
                username: user.username,
                email: user.email,
                profileImage: user.profile_image
              }}
            />
          </div>
        </header>

        <div 
          className="flex-1 overflow-hidden flex flex-col min-h-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="flex-1 overflow-y-auto overflow-x-hidden backdrop-blur-sm bg-black/40">
            <div className="p-4 space-y-4 max-w-full">
              <Chat
                visualSpaceId={space.id}
                userId={user.id}
                username={user.username}
              />
            </div>
          </div>
        </div>

        {isBackgroundSettingsOpen && (
          <BackgroundSettings
            currentImage={backgroundImage}
            onSave={(bg) => {
              setBackgroundImage(bg);
              setIsBackgroundSettingsOpen(false);
            }}
            onClose={() => setIsBackgroundSettingsOpen(false)}
          />
        )}
      </div>

      {error && (
        <div className="fixed bottom-4 right-4">
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export { VisualSpace };
export default VisualSpace;
