import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatMessage as ChatMessageType } from './types/models';
import { ChatMessage } from './components/Chat/ChatMessage';
import { ChatInput } from './components/Chat/ChatInput';
import { CreateVisualSpace } from './components/VisualSpace/CreateVisualSpace';
import { VisualSpaceList } from './components/VisualSpace/VisualSpaceList';
import { BackgroundSettings } from './components/Settings/BackgroundSettings';
import { MyAccount } from './components/Settings/MyAccount';
import { VisualSpace } from './types/visualSpace';
import { visualSpaceService } from './services/visualSpaceService';
import { supabase } from './lib/supabase';

function App() {
  const { username, spaceTitle } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showMyAccount, setShowMyAccount] = useState(false);
  const [usernameState, setUsernameState] = useState('User');
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop');
  const [isBackgroundSettingsOpen, setIsBackgroundSettingsOpen] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&q=80');
  const [isVisualSpaceListOpen, setIsVisualSpaceListOpen] = useState(false);
  const [isCreatingSpace, setIsCreatingSpace] = useState(false);
  const [currentVisualSpace, setCurrentVisualSpace] = useState<VisualSpace | null>(null);
  const [visualSpaces, setVisualSpaces] = useState<VisualSpace[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ username: string } | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);

  useEffect(() => {
    // Vérifier l'authentification au chargement
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        // Récupérer le profil utilisateur
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserProfile(profile);
          // Rediriger vers l'URL avec le username si on est sur une autre page
          if (!username) {
            navigate(`/${profile.username}`);
          }
        }
        
        await loadVisualSpaces(user.id);
      } else {
        // Rediriger vers login si non authentifié
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate, username]);

  // Charger le Visual Space spécifié dans l'URL
  useEffect(() => {
    if (spaceTitle && visualSpaces.length > 0) {
      const space = visualSpaces.find(
        s => s.title.toLowerCase() === decodeURIComponent(spaceTitle).toLowerCase()
      );
      if (space) {
        setCurrentVisualSpace(space);
      } else {
        // Si le space n'existe pas, rediriger vers la racine du profil
        navigate(`/${username}`);
      }
    }
  }, [spaceTitle, visualSpaces, username, navigate]);

  const loadVisualSpaces = async (uid: string) => {
    const spaces = await visualSpaceService.getVisualSpaces(uid);
    setVisualSpaces(spaces);
    
    // Si pas de space dans l'URL, charger le dernier utilisé
    if (!spaceTitle && spaces.length > 0) {
      setCurrentVisualSpace(spaces[0]);
      navigate(`/${userProfile?.username}/${encodeURIComponent(spaces[0].title)}`);
    }
  };

  const handleSelectVisualSpace = async (space: VisualSpace) => {
    setCurrentVisualSpace(space);
    setIsVisualSpaceListOpen(false);
    
    // Mettre à jour l'URL
    navigate(`/${userProfile?.username}/${encodeURIComponent(space.title)}`);
    
    // Mettre à jour last_accessed
    await visualSpaceService.updateLastAccessed(space.id);
    
    // Mettre à jour la liste pour refléter le nouvel ordre
    const updatedSpaces = await visualSpaceService.getVisualSpaces(userId!);
    setVisualSpaces(updatedSpaces);
  };

  const handleCreateVisualSpace = async (title: string) => {
    if (!userId) return;
    
    try {
      const newSpace = await visualSpaceService.createVisualSpace(userId, title);
      if (newSpace) {
        setVisualSpaces(prev => [newSpace, ...prev]);
        setCurrentVisualSpace(newSpace);
        setIsCreatingSpace(false);
        // Mettre à jour l'URL avec le nouveau space
        navigate(`/${userProfile?.username}/${encodeURIComponent(newSpace.title)}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An error occurred while creating the Visual Space');
      }
    }
  };

  const handleDeleteVisualSpace = async (space: VisualSpace) => {
    if (!userId) return;

    const success = await visualSpaceService.deleteVisualSpace(space.id);
    if (success) {
      setVisualSpaces(prev => prev.filter(s => s.id !== space.id));
      
      // Si l'espace supprimé était l'espace courant, sélectionner le premier espace disponible
      if (currentVisualSpace?.id === space.id) {
        const remainingSpaces = visualSpaces.filter(s => s.id !== space.id);
        if (remainingSpaces.length > 0) {
          setCurrentVisualSpace(remainingSpaces[0]);
          navigate(`/${userProfile?.username}/${encodeURIComponent(remainingSpaces[0].title)}`);
        } else {
          setCurrentVisualSpace(null);
          navigate(`/${userProfile?.username}`);
        }
      }
    } else {
      alert('Failed to delete the Visual Space. Please try again.');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setVisualSpaces([]);
    setCurrentVisualSpace(null);
    setUserProfile(null);
    navigate('/login');
  };

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!content.trim()) return;

    const newMessage: ChatMessageType = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const handleSaveAccount = (username: string, profileImage: string) => {
    setUsernameState(username);
    setProfileImage(profileImage);
    setShowMyAccount(false);
  };

  const handleSaveBackground = (imageUrl: string) => {
    setBackgroundImage(imageUrl);
    setIsBackgroundSettingsOpen(false);
  };

  if (showMyAccount) {
    return (
      <MyAccount
        username={usernameState}
        profileImage={profileImage}
        onBack={() => setShowMyAccount(false)}
        onSave={handleSaveAccount}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0A0A0A] text-white relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Header */}
      <header className="relative flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsVisualSpaceListOpen(true)}
            className="text-lg font-semibold hover:text-orange-500 transition-colors"
          >
            {currentVisualSpace?.title || 'Select Visual Space'}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsBackgroundSettingsOpen(true)}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            title="Change background"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>

          <button
            onClick={() => setShowMyAccount(true)}
            className="w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-orange-500 transition-all"
          >
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>

          <button
            onClick={handleSignOut}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            title="Sign out"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {/* Chat Messages */}
        <div className="absolute inset-0 overflow-y-auto py-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </main>

      {/* Chat Input */}
      <div className="relative p-4 bg-black/50 backdrop-blur-sm border-t border-zinc-800">
        <ChatInput onSend={handleSendMessage} />
      </div>

      {/* Visual Space List */}
      {isVisualSpaceListOpen && (
        <VisualSpaceList
          spaces={visualSpaces}
          onSelect={handleSelectVisualSpace}
          onClose={() => setIsVisualSpaceListOpen(false)}
          onDelete={handleDeleteVisualSpace}
          onCreate={() => setIsCreatingSpace(true)}
        />
      )}

      {/* Create Visual Space */}
      {isCreatingSpace && (
        <CreateVisualSpace
          onSubmit={handleCreateVisualSpace}
          onCancel={() => setIsCreatingSpace(false)}
          userId={userId!}
        />
      )}

      {/* Background Settings */}
      {isBackgroundSettingsOpen && (
        <BackgroundSettings
          currentImage={backgroundImage}
          onSave={handleSaveBackground}
          onClose={() => setIsBackgroundSettingsOpen(false)}
        />
      )}
    </div>
  );
}

export default App;