import apiClient from './client';
import { Outline } from '../types';

export interface GenerateOutlineRequest {
  topic: string;
  preferences?: {
    length?: number;
    style?: string;
    audience?: string;
  };
}

export interface UpdateOutlineRequest {
  outlineId: string;
  instruction: string;
}

export const outlineApi = {
  // 生成大纲
  generateOutline: async (data: GenerateOutlineRequest) => {
    const response = await apiClient.post<Outline>('/api/outline/generate', data);
    return response.data;
  },

  // 获取大纲
  getOutline: async (outlineId: string) => {
    const response = await apiClient.get<Outline>(`/api/outline/${outlineId}`);
    return response.data;
  },

  // 更新大纲（通过对话）
  updateOutline: async (data: UpdateOutlineRequest) => {
    const response = await apiClient.post<Outline>('/api/outline/update', data);
    return response.data;
  },

  // 删除大纲
  deleteOutline: async (outlineId: string) => {
    await apiClient.delete(`/api/outline/${outlineId}`);
  },
};