import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Edit2, Trash2, ArrowRight, MessageSquare } from 'lucide-react';
import { useOutlineStore } from '../store/outlineStore';
import { useChatStore } from '../store/chatStore';
import { outlineApi } from '../api/outline';

export default function OutlineEditorPage() {
  const navigate = useNavigate();
  const { outline, updateSection, removeSection, addSection } = useOutlineStore();
  const { messages, isLoading, addMessage, setLoading } = useChatStore();
  const [input, setInput] = useState('');
  const [editingSection, setEditingSection] = useState<string | null>(null);

  useEffect(() => {
    if (!outline) {
      navigate('/');
    }
  }, [outline, navigate]);

  const handleSendMessage = async () => {
    if (!input.trim() || !outline) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);
    setInput('');
    setLoading(true);

    try {
      const updatedOutline = await outlineApi.updateOutline({
        outlineId: outline.id,
        instruction: input,
      });
      useOutlineStore.setState({ outline: updatedOutline });

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: '已根据您的要求更新大纲',
        timestamp: new Date().toISOString(),
      };
      addMessage(assistantMessage);
    } catch (error) {
      console.error('Failed to update outline:', error);
      alert('更新大纲失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSection = (sectionId: string, field: 'title' | 'content', value: string) => {
    updateSection(sectionId, { [field]: value });
  };

  const handleAddSection = () => {
    if (!outline) return;
    const newSection = {
      id: Date.now().toString(),
      title: '新章节',
      content: '章节内容',
      order: outline.sections.length,
    };
    addSection(newSection);
  };

  const handleRemoveSection = (sectionId: string) => {
    if (confirm('确定要删除这个章节吗？')) {
      removeSection(sectionId);
    }
  };

  if (!outline) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">编辑大纲</h1>
        <p className="text-gray-600">主题: {outline.topic}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧：大纲列表 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">章节列表</h2>
            <button
              onClick={handleAddSection}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              添加章节
            </button>
          </div>

          {outline.sections.map((section, index) => (
            <div
              key={section.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  {editingSection !== section.id ? (
                    <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                  ) : (
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => handleUpdateSection(section.id, 'title', e.target.value)}
                      className="text-lg font-semibold text-gray-900 border-b-2 border-primary-500 focus:outline-none flex-1"
                      autoFocus
                    />
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                    className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleRemoveSection(section.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {editingSection === section.id ? (
                <textarea
                  value={section.content}
                  onChange={(e) => handleUpdateSection(section.id, 'content', e.target.value)}
                  className="w-full min-h-[100px] p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none resize-none"
                  placeholder="输入章节内容..."
                />
              ) : (
                <p className="text-gray-600 whitespace-pre-wrap">{section.content}</p>
              )}
            </div>
          ))}
        </div>

        {/* 右侧：对话调整 */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-[600px]">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MessageSquare className="mr-2" size={24} />
            对话调整
          </h2>

          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <MessageSquare size={48} className="mx-auto mb-4" />
                <p>通过对话来调整大纲内容</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入您的调整建议..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => navigate('/templates')}
          className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all flex items-center space-x-2"
        >
          <span>下一步：选择模板</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}