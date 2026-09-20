import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()


@dataclass
class Settings:
    granite_api_key: str | None = os.getenv('IBM_GRANITE_API_KEY') or os.getenv('WATSONX_APIKEY')
    granite_api_url: str | None = os.getenv('IBM_GRANITE_API_URL') or os.getenv('WATSONX_URL')
    granite_project_id: str | None = os.getenv('IBM_GRANITE_PROJECT_ID') or os.getenv('WATSONX_PROJECT_ID')
    granite_model_id: str = os.getenv('IBM_GRANITE_MODEL_ID', 'ibm/granite-4-h-small')
    app_name: str = 'Eco Lifestyle Agent'
    knowledge_root: str = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'knowledge_base'))
    chroma_db_dir: str = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'chroma_db'))
    admin_key: str = os.getenv('ECO_ADMIN_KEY', 'Nandu123')
    demo_mode: bool = False  # Maintained as False for backward compatibility

    @property
    def granite_configured(self) -> bool:
        return bool(self.granite_api_key and self.granite_api_url)


settings = Settings()
