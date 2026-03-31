from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import outline, ppt, feedback, templates
from app.database import init_db

app = FastAPI(title="AI PPT Generator API", version="1.0.0")

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://10.240.33.40:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 启动时初始化数据库
@app.on_event("startup")
async def startup_event():
    await init_db()

# 注册路由
app.include_router(outline.router, prefix="/api/outline", tags=["outline"])
app.include_router(ppt.router, prefix="/api/ppt", tags=["ppt"])
app.include_router(feedback.router, prefix="/api/feedback", tags=["feedback"])
app.include_router(templates.router, prefix="/api/templates", tags=["templates"])

@app.get("/")
async def root():
    return {"message": "AI PPT Generator API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)