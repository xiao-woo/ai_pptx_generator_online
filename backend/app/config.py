from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Backend Settings
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000

    # AI Model Settings
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    azure_openai_api_key: str = ""
    azure_openai_endpoint: str = ""
    deepseek_api_key: str = ""
    
    # NVIDIA NIM Settings
    nvidia_api_key: str = ""
    nvidia_base_url: str = "https://integrate.api.nvidia.com/v1"
    nvidia_models: str = "z-ai/glm4.7,z-ai/glm5"

    default_model: str = "nvidia"
    model_timeout: int = 60
    max_retries: int = 3

    # GitHub Settings
    github_token: str = ""
    github_repo: str = ""

    # Image Generation
    unsplash_access_key: str = ""

    # Database
    database_url: str = "sqlite:///./app.db"

    # CORS
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()