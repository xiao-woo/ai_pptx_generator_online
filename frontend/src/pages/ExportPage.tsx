import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { usePPTStore } from '../store/pptStore';
import { pptApi } from '../api/ppt';
import { generatePPTX, downloadPPTX } from '../utils/pptx';

export default function ExportPage() {
  const navigate = useNavigate();
  const { ppt } = usePPTStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    if (!ppt) return;

    setIsExporting(true);
    try {
      // 使用后端 API 导出
      const blob = await pptApi.exportPPT(ppt.id, 'pptx');
      downloadPPTX(blob, `${ppt.title}.pptx`);
      setExported(true);
    } catch (error) {
      console.error('Failed to export PPT:', error);
      // 如果后端导出失败，尝试前端导出
      try {
        const blob = await generatePPTX(ppt);
        downloadPPTX(blob, `${ppt.title}.pptx`);
        setExported(true);
      } catch (frontendError) {
        console.error('Frontend export also failed:', frontendError);
        alert('导出失败，请重试');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleBack = () => {
    navigate('/preview');
  };

  if (!ppt) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">导出 PPT</h1>
        <p className="text-gray-600">将您的演示文稿导出为 PPTX 格式</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <FileText size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{ppt.title}</h2>
            <p className="text-gray-600">共 {ppt.slides.length} 张幻灯片</p>
          </div>
        </div>

        {exported ? (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
            <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-700 mb-2">导出成功！</h3>
            <p className="text-green-600">您的 PPT 文件已成功下载</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText size={24} className="text-primary-600" />
                  <div>
                    <div className="font-semibold text-gray-900">PPTX 格式</div>
                    <div className="text-sm text-gray-600">Microsoft PowerPoint 格式</div>
                  </div>
                </div>
                <span className="text-sm text-gray-500">推荐</span>
              </div>
            </div>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-3"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>正在导出...</span>
                </>
              ) : (
                <>
                  <Download size={24} />
                  <span>导出 PPTX 文件</span>
                </>
              )}
            </button>
          </>
        )}
      </div>

      <div className="mt-8 flex justify-start">
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>返回预览</span>
        </button>
      </div>
    </div>
  );
}