import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ModelSelector } from './components/ModelSelector/ModelSelector';
import { ChatMessage as ChatMessageType } from './types/models';
import { ChatMessage } from './components/Chat/ChatMessage';
import { ChatInput } from './components/Chat/ChatInput';
import { modelCategories } from './data/modelCategories';
import { ConversationList } from './components/ConversationHistory/ConversationList';
import { Conversation } from './types/conversation';
import { UserMenu } from './components/UserMenu/UserMenu';
import { MyAccount } from './pages/MyAccount';
import { BackgroundSettings } from './components/Chat/BackgroundSettings';
import { Login } from './pages/Login';
import { SignupFlow } from './pages/SignupFlow';

const getModelAvatar = (modelId: string): string => {
  const avatars: Record<string, string> = {
    'text-to-video-1': 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=120&h=120&auto=format&fit=crop&q=80',
    'text-to-music-1': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=120&h=120&auto=format&fit=crop&q=80',
    'text-to-code-1': 'https://images.unsplash.com/photo-1676299082587-7e54cd6a9b0f?w=120&h=120&auto=format&fit=crop&q=80',
    'text-to-image-1': 'https://images.unsplash.com/photo-1675426513824-77813readf13?w=120&h=120&auto=format&fit=crop&q=80',
    'text-to-speech-1': 'https://images.unsplash.com/photo-1677442135426-5a23b266235c?w=120&h=120&auto=format&fit=crop&q=80',
    'multimodal-1': 'https://images.unsplash.com/photo-1675426513824-77813readf13?w=120&h=120&auto=format&fit=crop&q=80',
    'image-to-image-1': 'https://images.unsplash.com/photo-1677442135426-5a23b266235c?w=120&h=120&auto=format&fit=crop&q=80',
    'image-to-video-1': 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=120&h=120&auto=format&fit=crop&q=80',
  };

  return avatars[modelId] || 'https://images.unsplash.com/photo-1675426513824-77813readf13?w=120&h=120&auto=format&fit=crop&q=80';
};

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string>(modelCategories[0].models[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showMyAccount, setShowMyAccount] = useState(false);
  const [username, setUsername] = useState('User');
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop');
  const [isBackgroundSettingsOpen, setIsBackgroundSettingsOpen] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&q=80');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const selectedModel = modelCategories
    .flatMap(category => category.models)
    .find(model => model.id === selectedModelId);

  const selectedCategory = modelCategories.find(category =>
    category.models.some(model => model.id === selectedModelId)
  );

  const handleNewWorkspace = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Workspace',
      lastMessage: '',
      timestamp: new Date(),
      messages: []
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
    }
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === id
          ? { ...conv, title: newTitle }
          : conv
      )
    );
    if (currentConversation?.id === id) {
      setCurrentConversation(prev => prev ? { ...prev, title: newTitle } : null);
    }
  };

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!currentConversation) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        lastMessage: content,
        timestamp: new Date(),
        messages: []
      };
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
    }

    const activeConversation = currentConversation || {
      id: Date.now().toString(),
      title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
      lastMessage: content,
      timestamp: new Date(),
      messages: []
    };

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
      attachments,
    };

    const updatedConversation = {
      ...activeConversation,
      lastMessage: content,
      timestamp: new Date(),
      messages: [...activeConversation.messages, userMessage]
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversation.id ? updatedConversation : conv
      )
    );
    setCurrentConversation(updatedConversation);
    setIsLoading(true);

    setTimeout(() => {
      const aiMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        content: `Response from ${selectedModel?.name}`,
        role: 'assistant',
        timestamp: new Date(),
        modelId: selectedModelId,
        mediaType: selectedCategory?.id.includes('video')
          ? 'video'
          : selectedCategory?.id.includes('image')
          ? 'image'
          : selectedCategory?.id.includes('music') || selectedCategory?.id.includes('speech')
          ? 'audio'
          : selectedCategory?.id.includes('code')
          ? 'code'
          : undefined,
        mediaUrl: 'https://example.com/sample-media',
      };

      const finalConversation = {
        ...updatedConversation,
        lastMessage: aiMessage.content,
        messages: [...updatedConversation.messages, aiMessage]
      };

      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversation.id ? finalConversation : conv
      ));
      setCurrentConversation(finalConversation);
      setIsLoading(false);
    }, 1000);
  };

  const handleLogin = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsAuthenticated(true);
    setIsSigningUp(false);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setIsSigningUp(false);
  };

  const handleSignupComplete = async (data: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsAuthenticated(true);
    setIsSigningUp(false);
  };

  const handleSaveAccount = (username: string, profileImage: string) => {
    setUsername(username);
    setProfileImage(profileImage);
    setShowMyAccount(false);
  };

  if (!isAuthenticated) {
    if (isSigningUp) {
      return (
        <SignupFlow
          onBack={() => setIsSigningUp(false)}
          onComplete={handleSignupComplete}
        />
      );
    }
    return (
      <Login
        onLogin={handleLogin}
        onSignup={() => setIsSigningUp(true)}
      />
    );
  }

  if (showMyAccount) {
    return (
      <MyAccount
        username={username}
        profileImage={profileImage}
        onBack={() => setShowMyAccount(false)}
        onSave={handleSaveAccount}
      />
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-[#050505]">
      <div
        className={`bg-[#0A0A0A] border-r border-[#151515] flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-0' : 'w-80'
        }`}
      >
        <ConversationList
          conversations={conversations}
          currentConversation={currentConversation}
          onNewChat={handleNewWorkspace}
          onSelectConversation={setCurrentConversation}
          onDeleteConversation={handleDeleteConversation}
          onRenameConversation={handleRenameConversation}
          isCollapsed={isSidebarCollapsed}
        />
      </div>

      <button
        onClick={() => setIsSidebarCollapsed(prev => !prev)}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#0A0A0A] p-1.5 rounded-r-lg border border-l-0 border-[#151515] hover:bg-[#151515] transition-colors z-10 text-zinc-400 hover:text-orange-500"
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
            <button
              onClick={() => setIsModelSelectorOpen(true)}
              className="flex items-center gap-3 px-4 py-2 bg-[#151515] rounded-lg hover:bg-[#1A1A1A] transition-colors text-white group"
            >
              <div className="relative">
                <img
                  src={getModelAvatar(selectedModelId)}
                  alt={selectedModel?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
              <span className="font-medium group-hover:text-orange-500 transition-colors">
                {selectedModel ? selectedModel.name : 'Select AI Model'}
              </span>
            </button>
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
              onSignOut={handleSignOut}
              username={username}
              profileImage={profileImage}
              onMyAccount={() => setShowMyAccount(true)}
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
          <div className="flex-1 overflow-y-auto backdrop-blur-sm bg-black/40">
            <div className="p-4 space-y-4">
              {currentConversation ? (
                currentConversation.messages.map((message) => (
                  <ChatMessage 
                    key={message.id} 
                    message={message} 
                    modelId={message.modelId || selectedModelId}
                    userAvatar={profileImage}
                  />
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-500">
                  Start typing to begin a new workspace
                </div>
              )}
            </div>
          </div>

          <div className="flex-none p-4 border-t border-[#151515] bg-[#0A0A0A]/80 backdrop-blur-sm">
            <ChatInput
              onSendMessage={handleSendMessage}
              allowAttachments={selectedCategory?.requiresAttachment}
              isLoading={isLoading}
            />
          </div>
        </div>

        {isModelSelectorOpen && (
          <ModelSelector
            onSelectModel={(modelId) => {
              setSelectedModelId(modelId);
              setIsModelSelectorOpen(false);
            }}
            onClose={() => setIsModelSelectorOpen(false)}
          />
        )}

        {isBackgroundSettingsOpen && (
          <BackgroundSettings
            onSelectBackground={(bg) => {
              setBackgroundImage(bg);
              setIsBackgroundSettingsOpen(false);
            }}
            onClose={() => setIsBackgroundSettingsOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;