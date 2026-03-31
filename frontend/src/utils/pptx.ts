import PptxGenJS from 'pptxgenjs';
import { PPT } from '../types';

export const generatePPTX = async (ppt: PPT): Promise<Blob> => {
  const pres = new PptxGenJS();

  // 设置演示文稿属性
  pres.title = ppt.title;
  pres.author = 'AI PPT Generator';

  // 生成幻灯片
  for (const slide of ppt.slides) {
    const slideObj = pres.addSlide();

    // 添加标题
    slideObj.addText(slide.title, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 36,
      bold: true,
      color: '363636',
      align: 'center',
    });

    // 添加内容
    slideObj.addText(slide.content, {
      x: 0.5,
      y: 2,
      w: 9,
      h: 4,
      fontSize: 18,
      color: '666666',
      align: 'left',
      valign: 'top',
    });

    // 添加图片（如果有）
    if (slide.images && slide.images.length > 0) {
      for (let i = 0; i < slide.images.length; i++) {
        try {
          await slideObj.addImage({
            data: slide.images[i],
            x: 0.5 + (i * 3),
            y: 5.5,
            w: 2.8,
            h: 2,
          });
        } catch (error) {
          console.error('Error adding image:', error);
        }
      }
    }
  }

  // 生成 PPTX
  const buffer = await pres.write({ outputType: 'nodebuffer' }) as Uint8Array;
  return new Blob([buffer.buffer as BlobPart], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
};

export const downloadPPTX = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};