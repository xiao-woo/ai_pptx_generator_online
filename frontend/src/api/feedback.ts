import apiClient from './client';
import { Feedback } from '../types';

export interface SubmitFeedbackRequest {
  type: 'bug' | 'feature' | 'improvement';
  title: string;
  description: string;
  email?: string;
}

export const feedbackApi = {
  // 提交反馈
  submitFeedback: async (data: SubmitFeedbackRequest) => {
    const response = await apiClient.post<Feedback>('/api/feedback', data);
    return response.data;
  },
};