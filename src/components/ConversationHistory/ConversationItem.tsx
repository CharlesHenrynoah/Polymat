import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Trash2, Pencil } from 'lucide-react';
import { Conversation } from '../../types/conversation';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (conversation: Conversation) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onSelect,
  onDelete,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(conversation.title);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(conversation.timestamp);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRename = () => {
    const newTitle = editedTitle.trim();
    if (newTitle && newTitle !== conversation.title) {
      onRename(conversation.id, newTitle);
    } else {
      setEditedTitle(conversation.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditedTitle(conversation.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      onClick={() => !isEditing && onSelect(conversation)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive 
          ? 'bg-orange-500/10 hover:bg-orange-500/20' 
          : 'hover:bg-[#151515]'
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
        isActive ? 'bg-orange-500/20 text-orange-500' : 'bg-[#151515] text-zinc-400'
      }`}>
        <MessageSquare className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleRename}
              className="flex-1 px-2 py-1 text-sm bg-[#151515] border border-orange-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="flex-1">
              <h3 className={`font-medium truncate transition-colors ${
                isActive ? 'text-orange-500' : 'text-zinc-200'
              }`}>
                {conversation.title}
              </h3>
              <span className="text-xs text-zinc-500">{formattedTime}</span>
            </div>
          )}
          <div className={`flex items-center gap-1 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="p-1.5 hover:bg-[#202020] rounded-full transition-all text-zinc-400 hover:text-orange-500"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conversation.id);
              }}
              className="p-1.5 hover:bg-[#202020] rounded-full transition-all text-zinc-400 hover:text-red-500"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <p className={`text-sm truncate mt-1 transition-colors ${
          isActive ? 'text-orange-500/70' : 'text-zinc-400'
        }`}>
          {conversation.lastMessage}
        </p>
      </div>
    </div>
  );
};