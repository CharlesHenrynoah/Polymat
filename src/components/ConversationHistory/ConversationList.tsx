import React from 'react';
import { Plus } from 'lucide-react';
import { Conversation } from '../../types/conversation';
import { ConversationItem } from './ConversationItem';

interface ConversationListProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  onNewChat: () => void;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  isCollapsed: boolean;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  currentConversation,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  isCollapsed,
}) => {
  // Group conversations by date
  const groupedConversations = conversations.reduce((groups, conversation) => {
    const date = new Date(conversation.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateKey;
    if (date.toDateString() === today.toDateString()) {
      dateKey = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = 'Yesterday';
    } else {
      dateKey = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    }

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(conversation);
    return groups;
  }, {} as Record<string, Conversation[]>);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
        >
          <Plus className="w-5 h-5" />
          <span className={`${isCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity font-medium`}>
            New Workspace
          </span>
        </button>
      </div>

      <div 
        className={`flex-1 overflow-y-auto overflow-x-hidden ${
          isCollapsed ? 'opacity-0' : 'opacity-100'
        } transition-opacity scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent`}
      >
        {Object.entries(groupedConversations).map(([date, convs]) => (
          <div key={date} className="pt-4 first:pt-2">
            <div className="px-4 mb-2">
              <span className="text-xs font-medium text-zinc-500">{date}</span>
            </div>
            <div className="space-y-0.5 px-2">
              {convs.map(conversation => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={currentConversation?.id === conversation.id}
                  onSelect={onSelectConversation}
                  onDelete={onDeleteConversation}
                  onRename={onRenameConversation}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};