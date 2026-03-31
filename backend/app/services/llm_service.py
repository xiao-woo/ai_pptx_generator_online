from typing import List, Optional, Dict, Any
import openai
import anthropic
import httpx
from app.config import settings

class LLMService:
    """大语言模型服务，支持多模型和故障转移"""

    def __init__(self):
        self.models = {
            'openai': self._openai_client,
            'anthropic': self._anthropic_client,
            'azure': self._azure_client,
            'deepseek': self._deepseek_client,
            'nvidia': self._nvidia_client,
        }

    def _openai_client(self) -> openai.AsyncOpenAI:
        """OpenAI 客户端"""
        return openai.AsyncOpenAI(api_key=settings.openai_api_key)

    def _anthropic_client(self) -> anthropic.AsyncAnthropic:
        """Anthropic 客户端"""
        return anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    def _azure_client(self) -> openai.AsyncAzureOpenAI:
        """Azure OpenAI 客户端"""
        return openai.AsyncAzureOpenAI(
            api_key=settings.azure_openai_api_key,
            azure_endpoint=settings.azure_openai_endpoint,
        )

    def _deepseek_client(self) -> openai.AsyncOpenAI:
        """DeepSeek 客户端"""
        return openai.AsyncOpenAI(
            api_key=settings.deepseek_api_key,
            base_url="https://api.deepseek.com/v1"
        )

    def _nvidia_client(self) -> openai.AsyncOpenAI:
        """NVIDIA NIM 客户端"""
        return openai.AsyncOpenAI(
            api_key=settings.nvidia_api_key,
            base_url=settings.nvidia_base_url
        )

    async def generate_outline(self, topic: str, preferences: Optional[Dict] = None) -> str:
        """生成 PPT 大纲"""
        prompt = self._build_outline_prompt(topic, preferences)
        return await self._generate(prompt, "outline")

    async def update_outline(self, outline: str, instruction: str) -> str:
        """更新大纲"""
        prompt = f"""当前大纲：
{outline}

用户修改指令：
{instruction}

请根据用户指令修改大纲，保持结构清晰。"""
        return await self._generate(prompt, "update")

    async def generate_slide_content(self, section_title: str, section_content: str) -> str:
        """生成幻灯片内容"""
        prompt = f"""章节标题：{section_title}
章节内容：{section_content}

请为这个章节生成适合幻灯片展示的内容，要求：
1. 内容简洁明了
2. 重点突出
3. 适合展示
4. 包含关键点"""
        return await self._generate(prompt, "slide")

    async def _generate(self, prompt: str, task_type: str) -> str:
        """生成内容，支持故障转移"""
        model_order = self._get_model_order(task_type)

        for model_name in model_order:
            try:
                client = self.models[model_name]()
                return await self._call_model(client, model_name, prompt)
            except Exception as e:
                print(f"Model {model_name} failed: {e}")
                continue

        raise Exception("All models failed to generate content")

    def _get_model_order(self, task_type: str) -> List[str]:
        """获取模型调用顺序"""
        base_models = ['nvidia', 'openai', 'anthropic', 'deepseek', 'azure']
        if settings.default_model in base_models:
            base_models.remove(settings.default_model)
            return [settings.default_model] + base_models
        return base_models

    async def _call_model(self, client, model_name: str, prompt: str) -> str:
        """调用指定模型"""
        if model_name in ['openai', 'azure', 'deepseek']:
            response = await client.chat.completions.create(
                model="gpt-3.5-turbo" if model_name in ['openai', 'azure'] else "deepseek-chat",
                messages=[
                    {"role": "system", "content": "你是一个专业的 PPT 大纲生成助手。"},
                    {"role": "user", "content": prompt}
                ],
                timeout=settings.model_timeout
            )
            return response.choices[0].message.content
        elif model_name == 'anthropic':
            response = await client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=4096,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            return response.content[0].text
        elif model_name == 'nvidia':
            # NVIDIA NIM 模型
            models = settings.nvidia_models.split(',')
            model_id = models[0] if models else "z-ai/glm4.7"
            response = await client.chat.completions.create(
                model=model_id,
                messages=[
                    {"role": "system", "content": "你是一个专业的 PPT 大纲生成助手。"},
                    {"role": "user", "content": prompt}
                ],
                timeout=settings.model_timeout
            )
            # 尝试获取content，如果为None则使用reasoning_content
            content = response.choices[0].message.content
            if content is None and hasattr(response.choices[0].message, 'reasoning_content'):
                content = response.choices[0].message.reasoning_content
            return content

    def _build_outline_prompt(self, topic: str, preferences: Optional[Dict] = None) -> str:
        """构建大纲生成提示词"""
        base_prompt = f"""请为主题"{topic}"生成一个详细的 PPT 大纲。

要求：
1. 大纲应该包含 5-10 个主要章节
2. 每个章节要有明确的标题和内容描述
3. 内容应该逻辑清晰，层层递进
4. 适合 15-30 分钟的演讲

输出格式：
章节 1：[标题]
内容：[内容描述]

章节 2：[标题]
内容：[内容描述]
..."""

        if preferences:
            if preferences.get('length'):
                base_prompt += f"\n- 长度要求：{preferences['length']} 页"
            if preferences.get('style'):
                base_prompt += f"\n- 风格要求：{preferences['style']}"
            if preferences.get('audience'):
                base_prompt += f"\n- 受众：{preferences['audience']}"

        return base_prompt

llm_service = LLMService()