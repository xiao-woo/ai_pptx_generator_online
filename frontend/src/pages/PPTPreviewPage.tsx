import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Download, ArrowLeft, RefreshCw } from 'lucide-react';
import { PPT } from '../types';
import { pptApi } from '../api/ppt';
import { useOutlineStore } from '../store/outlineStore';
import { usePPTStore } from '../store/pptStore';

export default function PPTPreviewPage() {
  const navigate = useNavigate();
  const [ppt, setPPT] = useState<PPT | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const { outline } = useOutlineStore();
  const { selectedTemplate } = usePPTStore();

  useEffect(() => {
    if (!outline || !selectedTemplate) {
      navigate('/templates');
      return;
    }
    generatePPT();
  }, []);

  const generatePPT = async () => {
    if (!outline || !selectedTemplate) return;

    setIsGenerating(true);
    try {
      const data = await pptApi.generatePPT({
        outlineId: outline.id,
        templateId: selectedTemplate.id,
      });
      setPPT(data);
    } catch (error) {
      console.error('Failed to generate PPT:', error);
      alert('生成 PPT 失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrevSlide = () => {
    if (ppt && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNextSlide = () => {
    if (ppt && currentSlide < ppt.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleSlideClick = (index: number) => {
    setCurrentSlide(index);
  };

  const handleBack = () => {
    navigate('/templates');
  };

  const handleExport = () => {
    navigate('/export');
  };

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-lg text-gray-600">正在生成 PPT...</p>
        </div>
      </div>
    );
  }

  if (!ppt) {
    return null;
  }

  const currentSlideData = ppt.slides[currentSlide];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">PPT 预览</h1>
        <p className="text-gray-600">预览您的演示文稿</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 主预览区域 */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div
              className="aspect-video bg-gradient-to-br rounded-lg flex items-center justify-center mb-6"
              style={{
                background: `linear-gradient(135deg, ${ppt.template.colorScheme[0]} 0%, ${ppt.template.colorScheme[1]} 100%)`,
              }}
            >
              <div className="text-center text-white p-8">
                <h2 className="text-4xl font-bold mb-4">{currentSlideData.title}</h2>
                <p className="text-xl opacity-90 whitespace-pre-wrap">{currentSlideData.content}</p>
                {currentSlideData.images && currentSlideData.images.length > 0 && (
                  <div className="mt-6 flex justify-center space-x-4">
                    {currentSlideData.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Slide ${index + 1}`}
                        className="w-48 h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevSlide}
                disabled={currentSlide === 0}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <ChevronLeft size={20} />
                <span>上一页</span>
              </button>

              <div className="text-lg font-semibold text-gray-700">
                {currentSlide + 1} / {ppt.slides.length}
              </div>

              <button
                onClick={handleNextSlide}
                disabled={currentSlide === ppt.slides.length - 1}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <span>下一页</span>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* 幻灯片缩略图 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">幻灯片列表</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {ppt.slides.map((slide, index) => (
                <div
                  key={slide.id}
                  onClick={() => handleSlideClick(index)}
                  className={`cursor-pointer rounded-lg p-3 transition-all ${
                    currentSlide === index
                      ? 'bg-primary-100 ring-2 ring-primary-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-sm font-semibold text-gray-900 mb-1">
                    {index + 1}. {slide.title}
                  </div>
                  <div className="text-xs text-gray-600 line-clamp-2">
                    {slide.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <div className="flex space-x-4">
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>返回模板</span>
          </button>
          <button
            onClick={generatePPT}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <RefreshCw size={20} />
            <span>重新生成</span>
          </button>
        </div>
        <button
          onClick={handleExport}
          className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all flex items-center space-x-2"
        >
          <Download size={20} />
          <span>导出 PPT</span>
        </button>
      </div>
    </div>
  );
}