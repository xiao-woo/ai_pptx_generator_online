import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            🚀 AI PPT Generator
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            最小MVP版本 - 纯静态页面
          </p>

          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">✅ 部署状态</h3>
              <p className="text-blue-700">
                GitHub Pages部署成功！
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h3 className="font-semibold text-green-900 mb-2">🎯 功能特性</h3>
              <ul className="text-green-700 space-y-1">
                <li>• 纯静态页面</li>
                <li>• 无需后端API</li>
                <li>• 响应式设计</li>
                <li>• 现代化UI</li>
              </ul>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <h3 className="font-semibold text-purple-900 mb-2">📋 技术栈</h3>
              <ul className="text-purple-700 space-y-1">
                <li>• React 18</li>
                <li>• TypeScript</li>
                <li>• Vite</li>
                <li>• Tailwind CSS</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <h3 className="font-semibold text-yellow-900 mb-2">🌐 访问地址</h3>
              <p className="text-yellow-700">
                https://xiao-woo.github.io/ai_pptx_generator_online/
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Powered by React + Vite + Tailwind CSS
            </p>
            <p className="text-xs text-gray-400 text-center mt-2">
              最小MVP版本 v1.0 - 纯静态页面
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
