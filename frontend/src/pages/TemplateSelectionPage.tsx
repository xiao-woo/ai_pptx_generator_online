import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, ArrowRight, Search, Star, Filter } from 'lucide-react';
import { Template } from '../types';
import { pptApi } from '../api/ppt';
import { usePPTStore } from '../store/pptStore';

export default function TemplateSelectionPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { setSelectedTemplate } = usePPTStore();

  useEffect(() => {
    loadTemplates();
    loadFavorites();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchQuery, selectedCategory]);

  const loadTemplates = async () => {
    try {
      const data = await pptApi.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('ppt-favorites');
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
    }
  };

  const saveFavorites = (newFavorites: Set<string>) => {
    localStorage.setItem('ppt-favorites', JSON.stringify(Array.from(newFavorites)));
  };

  const toggleFavorite = (templateId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const filterTemplates = () => {
    let filtered = templates;

    // 按分类筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    // 按搜索词筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedId(template.id);
    setSelectedTemplate(template);
  };

  const handleNext = () => {
    if (selectedId) {
      navigate('/preview');
    }
  };

  const handleBack = () => {
    navigate('/outline');
  };

  const categories = [
    { id: 'all', name: '全部' },
    { id: '商务', name: '商务' },
    { id: '创意', name: '创意' },
    { id: '教育', name: '教育' },
    { id: '科技', name: '科技' },
    { id: '医疗', name: '医疗' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">选择模板</h1>
        <p className="text-gray-600">选择一个模板来生成您的 PPT</p>
      </div>

      {/* 搜索和筛选 */}
      <div className="mb-6 space-y-4">
        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="搜索模板..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* 分类筛选 */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Filter size={20} className="text-gray-400 flex-shrink-0" />
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 模板网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleSelectTemplate(template)}
            className={`relative cursor-pointer rounded-xl overflow-hidden shadow-md transition-all hover:shadow-xl ${
              selectedId === template.id
                ? 'ring-4 ring-primary-500 scale-105'
                : 'hover:scale-102'
            }`}
          >
            <div
              className="h-48 bg-gradient-to-br relative"
              style={{
                background: `linear-gradient(135deg, ${template.colorScheme[0]} 0%, ${template.colorScheme[1]} 100%)`,
              }}
            >
              {/* 选中标记 */}
              {selectedId === template.id && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center z-10">
                  <Check size={18} className="text-white" />
                </div>
              )}

              {/* 收藏按钮 */}
              <button
                onClick={(e) => toggleFavorite(template.id, e)}
                className="absolute top-4 left-4 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
              >
                <Star
                  size={18}
                  className={favorites.has(template.id) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}
                />
              </button>

              {/* 模板预览 */}
              <div className="flex items-center justify-center h-full">
                <div className="text-white text-center p-4">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-sm opacity-80">模板预览</div>
                </div>
              </div>
            </div>

            {/* 模板信息 */}
            <div className="p-4 bg-white">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {template.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
              <div className="flex items-center space-x-2">
                {template.colorScheme.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 结果统计 */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>没有找到匹配的模板</p>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>返回大纲</span>
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedId}
          className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
        >
          <span>生成 PPT</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}