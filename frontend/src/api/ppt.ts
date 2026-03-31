import apiClient from './client';
import { PPT, Template } from '../types';

export interface GeneratePPTRequest {
  outlineId: string;
  templateId: string;
}

export const pptApi = {
  // 生成 PPT
  generatePPT: async (data: GeneratePPTRequest) => {
    const response = await apiClient.post<PPT>('/api/ppt/generate', data);
    return response.data;
  },

  // 获取 PPT
  getPPT: async (pptId: string) => {
    const response = await apiClient.get<PPT>(`/api/ppt/${pptId}`);
    return response.data;
  },

  // 导出 PPT
  exportPPT: async (pptId: string, format: 'pptx' | 'pdf') => {
    const response = await apiClient.get(`/api/ppt/${pptId}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  // 获取模板列表
  getTemplates: async () => {
    const response = await apiClient.get<Template[]>('/api/templates');
    return response.data;
  },
};