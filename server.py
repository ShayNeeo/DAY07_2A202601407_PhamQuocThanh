import os
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai

# Load environment variables from .env
load_dotenv()

API_KEY = os.getenv("AI_STUDIO_API_KEY")
AI_MODEL = os.getenv("AI_MODEL", "gemma-4-26b-a4b-it")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "gemini-embedding-2")

app = FastAPI(
    title="AGY Multi-Agent RAG Backend (Tiếng Việt)",
    description="Backend API Trợ lý RAG Đa Tác viên - Mô hình Gemma 4 & Gemini Embedding 2"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

genai_client = None
if API_KEY:
    try:
        genai_client = genai.Client(api_key=API_KEY)
    except Exception as e:
        print(f"Lỗi khởi tạo GenAI client: {e}")

class EmbedRequest(BaseModel):
    text: str

class GenerateRequest(BaseModel):
    prompt: str
    model: Optional[str] = None
    system_instruction: Optional[str] = None

@app.get("/api/status")
def get_status():
    return {
        "status": "online",
        "api_key_configured": bool(API_KEY),
        "ai_model": AI_MODEL,
        "embedding_model": EMBEDDING_MODEL,
        "provider": "Google AI Studio GenAI SDK",
        "language": "vi"
    }

@app.post("/api/embed")
def embed_text(req: EmbedRequest):
    if not genai_client:
        raise HTTPException(status_code=500, detail="GenAI client chưa được cấu hình.")
    try:
        res = genai_client.models.embed_content(
            model=EMBEDDING_MODEL,
            contents=req.text
        )
        vec = res.embeddings[0].values
        return {
            "model": EMBEDDING_MODEL,
            "dimension": len(vec),
            "embedding": vec[:10],
            "full_dimension": len(vec)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tạo Vector Embedding thất bại: {str(e)}")

@app.post("/api/generate")
def generate_text(req: GenerateRequest):
    if not genai_client:
        raise HTTPException(status_code=500, detail="GenAI client chưa được cấu hình.")
    
    target_model = req.model or AI_MODEL
    
    # If custom system_instruction or custom prompt is passed, do NOT add overlapping predefined system prompt
    if req.system_instruction:
        final_prompt = f"{req.system_instruction.strip()}\n\n{req.prompt}"
    elif any(k in req.prompt for k in ["Bạn là", "System Instruction", "Chỉ thị", "[Ngữ cảnh"]):
        # Direct custom prompt contains its own system instructions, do not wrap!
        final_prompt = req.prompt
    else:
        # Default fallback wrapper for simple raw queries only
        final_prompt = f"""Bạn là Giáo sư / Trợ lý AI chuyên về Quy định và Học vụ Đại học.
Hãy trả lời câu hỏi hoàn toàn bằng TIẾNG VIỆT, ngắn gọn, chính xác và dẫn nguồn rõ ràng [Source N] nếu ngữ cảnh có thông tin.

{req.prompt}"""

    try:
        res = genai_client.models.generate_content(
            model=target_model,
            contents=final_prompt
        )
        return {
            "model": target_model,
            "response": res.text.strip()
        }
    except Exception as e:
        try:
            fallback_model = "gemini-2.5-flash"
            res = genai_client.models.generate_content(
                model=fallback_model,
                contents=final_prompt
            )
            return {
                "model": fallback_model,
                "response": res.text.strip(),
                "note": f"Tự động chuyển từ {target_model} sang {fallback_model}"
            }
        except Exception as e2:
            raise HTTPException(status_code=500, detail=f"Tạo câu trả lời LLM thất bại: {str(e2)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
