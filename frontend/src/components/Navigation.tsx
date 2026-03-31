import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';
import { Home, FileText, Layout, Eye, Download, MessageSquare } from 'lucide-react';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/outline', label: '大纲编辑', icon: FileText },
  { path: '/templates', label: '模板选择', icon: Layout },
  { path: '/preview', label: 'PPT 预览', icon: Eye },
  { path: '/export', label: '导出', icon: Download },
  { path: '/feedback', label: '问题反馈', icon: MessageSquare },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-primary-600">
            AI PPT 生成器
          </Link>
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}