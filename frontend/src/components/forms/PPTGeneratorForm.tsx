import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Loading } from '../ui/Loading';

export interface PPTFormData {
  title: string;
  topic: string;
  content: string;
  slideCount: number;
}

export const PPTGeneratorForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm<PPTFormData>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      topic: '',
      content: '',
      slideCount: 10,
    },
  });

  const onSubmit: SubmitHandler<PPTFormData> = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    setProgress(0);

    try {
      // 模拟提交过程
      const steps = [
        { progress: 20, delay: 500 },
        { progress: 40, delay: 500 },
        { progress: 60, delay: 500 },
        { progress: 80, delay: 500 },
        { progress: 100, delay: 500 },
      ];

      for (const step of steps) {
        await new Promise((resolve) => setTimeout(resolve, step.delay));
        setProgress(step.progress);
      }

      // 模拟成功
      setSubmitStatus('success');
      console.log('Form submitted:', data);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('提交失败，请重试');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    setSubmitStatus('idle');
    setErrorMessage('');
    setProgress(0);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          🚀 AI PPT Generator
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          输入主题和内容，AI将为您生成精美的PPT
        </p>

        {submitStatus === 'success' && (
          <Alert
            type="success"
            title="提交成功"
            message="您的PPT生成请求已提交，正在处理中..."
            onClose={() => setSubmitStatus('idle')}
            className="mb-6"
          />
        )}

        {submitStatus === 'error' && (
          <Alert
            type="error"
            title="提交失败"
            message={errorMessage}
            onClose={() => setSubmitStatus('idle')}
            className="mb-6"
          />
        )}

        {isSubmitting && (
          <div className="mb-6">
            <Loading text="正在生成PPT..." className="py-8" />
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">生成进度</span>
                <span className="text-sm font-medium text-gray-700">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="PPT标题"
            placeholder="请输入PPT标题"
            {...register('title', {
              required: '标题不能为空',
              minLength: {
                value: 2,
                message: '标题至少需要2个字符',
              },
              maxLength: {
                value: 50,
                message: '标题不能超过50个字符',
              },
            })}
            error={errors.title?.message}
            helperText="为您的PPT起一个吸引人的标题"
            disabled={isSubmitting}
          />

          <Input
            label="主题"
            placeholder="请输入PPT主题"
            {...register('topic', {
              required: '主题不能为空',
              minLength: {
                value: 2,
                message: '主题至少需要2个字符',
              },
            })}
            error={errors.topic?.message}
            helperText="描述PPT的核心主题"
            disabled={isSubmitting}
          />

          <Textarea
            label="内容描述"
            placeholder="请详细描述您希望PPT包含的内容..."
            rows={6}
            {...register('content', {
              required: '内容描述不能为空',
              minLength: {
                value: 10,
                message: '内容描述至少需要10个字符',
              },
              maxLength: {
                value: 1000,
                message: '内容描述不能超过1000个字符',
              },
            })}
            error={errors.content?.message}
            helperText="越详细的内容描述，生成的PPT质量越高"
            disabled={isSubmitting}
          />

          <Input
            label="幻灯片数量"
            type="number"
            min={1}
            max={50}
            {...register('slideCount', {
              required: '幻灯片数量不能为空',
              min: {
                value: 1,
                message: '至少需要1张幻灯片',
              },
              max: {
                value: 50,
                message: '最多支持50张幻灯片',
              },
              valueAsNumber: true,
            })}
            error={errors.slideCount?.message}
            helperText="建议10-20张幻灯片"
            disabled={isSubmitting}
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              disabled={!isDirty || !isValid || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? '生成中...' : '生成PPT'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleReset}
              disabled={isSubmitting || !isDirty}
            >
              重置
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500 space-y-2">
            <p className="font-medium">💡 使用提示：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>标题和主题要简洁明了</li>
              <li>内容描述越详细，生成效果越好</li>
              <li>建议幻灯片数量在10-20张之间</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
