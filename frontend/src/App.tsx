import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI PPT Generator
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            智能PPT生成器 - 最小MVP版本
          </p>
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">✅ 部署状态</h3>
              <p className="text-blue-700">
                GitHub Pages部署成功！
              </p>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h3 className="font-semibold text-green-900 mb-2">🚀 功能特性</h3>
              <ul className="text-green-700 space-y-1">
                <li>• 静态页面展示</li>
                <li>• 响应式设计</li>
                <li>• 现代化UI</li>
              </ul>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <h3 className="font-semibold text-purple-900 mb-2">📋 下一步计划</h3>
              <ul className="text-purple-700 space-y-1">
                <li>• 添加AI对话功能</li>
                <li>• 集成PPT生成</li>
                <li>• 完善用户界面</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Powered by React + Vite + Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
