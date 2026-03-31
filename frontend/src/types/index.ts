// 大纲相关类型
export interface OutlineSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Outline {
  id: string;
  topic: string;
  sections: OutlineSection[];
  createdAt: string;
  updatedAt: string;
}

// 模板相关类型
export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  colorScheme: string[];
  category: string;
}

// PPT 相关类型
export interface PPTSlide {
  id: string;
  title: string;
  content: string;
  layout: string;
  images?: string[];
}

export interface PPT {
  id: string;
  title: string;
  slides: PPTSlide[];
  template: Template;
  createdAt: string;
}

// 对话相关类型
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  outlineId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// 反馈相关类型
export interface Feedback {
  id: string;
  type: 'bug' | 'feature' | 'improvement';
  title: string;
  description: string;
  email?: string;
  createdAt: string;
}