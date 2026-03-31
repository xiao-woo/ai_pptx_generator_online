import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { outlineApi } from '../api/outline';
import { useOutlineStore } from '../store/outlineStore';

export default function HomePage() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setOutline } = useOutlineStore();

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      const outline = await outlineApi.generateOutline({ topic });
      setOutline(outline);
      navigate('/outline');
    } catch (error) {
      console.error('Failed to generate outline:', error);
      alert('生成大纲失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 rounded-full">
            <Sparkles size={48} className="text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          AI PPT 生成器
        </h1>
        <p className="text-xl text-gray-600">
          输入主题，AI 自动为您生成精美的演示文稿
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <label htmlFor="topic" className="block text-lg font-semibold text-gray-700 mb-4">
          输入您想要创建 PPT 的主题
        </label>
        <div className="flex space-x-4">
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：人工智能的发展历程与应用"
            className="flex-1 px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
            onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>生成中...</span>
              </>
            ) : (
              <>
                <span>生成大纲</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-semibold text-gray-900 mb-2">智能大纲</h3>
            <p className="text-sm text-gray-600">AI 自动生成结构化大纲</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-semibold text-gray-900 mb-2">精美模板</h3>
            <p className="text-sm text-gray-600">多种专业模板可选</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">快速导出</h3>
            <p className="text-sm text-gray-600">一键导出 PPTX 格式</p>
          </div>
        </div>
      </div>
    </div>
  );
}