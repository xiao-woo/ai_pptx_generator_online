import { useState } from 'react';
import { Send, Bug, Lightbulb, Plus } from 'lucide-react';
import { feedbackApi } from '../api/feedback';

export default function FeedbackPage() {
  const [type, setType] = useState<'bug' | 'feature' | 'improvement'>('bug');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('请填写标题和描述');
      return;
    }

    setIsSubmitting(true);
    try {
      await feedbackApi.submitFeedback({
        type,
        title,
        description,
        email: email || undefined,
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('提交反馈失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setType('bug');
    setTitle('');
    setDescription('');
    setEmail('');
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send size={40} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">感谢您的反馈！</h2>
          <p className="text-gray-600 mb-8">
            我们已收到您的反馈，会尽快处理并改进产品。
          </p>
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
          >
            提交新的反馈
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">问题反馈</h1>
        <p className="text-gray-600">告诉我们您遇到的问题或改进建议</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 反馈类型 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              反馈类型
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setType('bug')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  type === 'bug'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Bug
                  size={32}
                  className={`mx-auto mb-2 ${type === 'bug' ? 'text-red-500' : 'text-gray-400'}`}
                />
                <div className="text-sm font-semibold text-gray-900">Bug 报告</div>
              </button>

              <button
                type="button"
                onClick={() => setType('feature')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  type === 'feature'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Lightbulb
                  size={32}
                  className={`mx-auto mb-2 ${type === 'feature' ? 'text-blue-500' : 'text-gray-400'}`}
                />
                <div className="text-sm font-semibold text-gray-900">功能建议</div>
              </button>

              <button
                type="button"
                onClick={() => setType('improvement')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  type === 'improvement'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Plus
                  size={32}
                  className={`mx-auto mb-2 ${type === 'improvement' ? 'text-green-500' : 'text-gray-400'}`}
                />
                <div className="text-sm font-semibold text-gray-900">改进建议</div>
              </button>
            </div>
          </div>

          {/* 标题 */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              标题 *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="简要描述问题或建议"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
            />
          </div>

          {/* 描述 */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              详细描述 *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请详细描述您遇到的问题或您的建议..."
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none resize-none transition-colors"
            />
          </div>

          {/* 邮箱（可选） */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              邮箱（可选）
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="您的邮箱地址，方便我们与您联系"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
            />
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-3"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>提交中...</span>
              </>
            ) : (
              <>
                <Send size={24} />
                <span>提交反馈</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}