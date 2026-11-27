import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, Edit3, X, Search, Check } from 'lucide-react';
import { AIConversation } from '../../types/ai';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: AIConversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartRename = (conv: AIConversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditingTitle(conv.title);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingTitle.trim()) {
      onRenameConversation(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      onDeleteConversation(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex">
      {/* Backdrop overlay bounded inside application container */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel attached to left edge of MoneyCare container */}
      <div className="relative w-80 max-w-[85%] sm:w-72 bg-white h-full shadow-2xl flex flex-col z-10 animate-fade-in border-r border-[#E8EAF0]">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#E8EAF0] flex items-center justify-between">
          <h2 className="text-base font-bold text-[#171923]">Lịch sử trò chuyện</h2>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b border-[#E8EAF0]">
          <button
            onClick={() => {
              onNewConversation();
              onClose();
            }}
            type="button"
            className="w-full py-3 px-4 rounded-xl bg-[#2F5BEA] hover:bg-[#244CD9] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Cuộc trò chuyện mới</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="px-4 pt-3 pb-1">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#858A9B]" />
            <input
              type="text"
              placeholder="Tìm kiếm hội thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-8 pr-3 bg-[#F7F8FC] border border-[#E8EAF0] rounded-lg text-xs text-[#171923] outline-none focus:border-[#2F5BEA]"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 no-scrollbar">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#858A9B] space-y-1">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p>Chưa có cuộc trò chuyện nào.</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              const isEditing = editingId === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    onClose();
                  }}
                  className={`group p-3 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all border ${
                    isActive
                      ? 'bg-[#EAF0FF] border-[#2F5BEA]/40 text-[#2F5BEA] font-bold shadow-2xs'
                      : 'border-transparent hover:bg-gray-50 text-[#171923]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2F5BEA]' : 'text-[#858A9B]'}`} />

                    {isEditing ? (
                      <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="w-full bg-white border border-[#2F5BEA] rounded px-1.5 py-0.5 text-xs text-[#171923] outline-none"
                          autoFocus
                        />
                        <button
                          onClick={(e) => handleSaveRename(conv.id, e)}
                          type="button"
                          className="p-1 text-[#16A66A] hover:bg-green-50 rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="truncate">
                        <p className="truncate font-semibold">{conv.title}</p>
                        {conv.lastMessagePreview && (
                          <p className="text-[10px] text-[#858A9B] truncate font-normal mt-0.5">
                            {conv.lastMessagePreview}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleStartRename(conv, e)}
                        type="button"
                        className="p-1 text-gray-400 hover:text-[#2F5BEA] rounded hover:bg-white"
                        title="Đổi tên"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTargetId(conv.id);
                        }}
                        type="button"
                        className="p-1 text-gray-400 hover:text-[#EF4444] rounded hover:bg-white"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Xóa cuộc trò chuyện?"
        message="Bạn có chắc chắn muốn xóa cuộc trò chuyện này cùng toàn bộ lịch sử tin nhắn không?"
        confirmText="Xóa"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
