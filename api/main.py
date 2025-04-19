from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

# Rate limiting dictionary (We will use Redis in production)
request_counts = {}

def get_api_key(x_api_key: Optional[str] = Header(None)):
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API Key is required")
    return x_api_key

def check_rate_limit(api_key: str):
    max_requests = 10  
    
    if api_key not in request_counts:
        request_counts[api_key] = 1
    else:
        if request_counts[api_key] >= max_requests:
            raise HTTPException(status_code=429, detail="Rate limit exceeded. Try again later.")
        request_counts[api_key] += 1

# @app.post("/generate")
# async def generate_response(request: PromptRequest, api_key: str = Depends(get_api_key)):
#     try:
#         check_rate_limit(api_key)
        
#         ai.api_key = api_key
        
#         response = ai.ChatCompletion.create(
#             model="gpt-3.5-turbo", 
#             messages=[
#                 {"role": "system", "content": "You are a helpful assistant."},
#                 {"role": "user", "content": request.prompt}
#             ],
#             max_tokens=1000,
#             temperature=0.7,
#         )
        
#         assistant_response = response.choices[0].message.content
        
#         return {"response": assistant_response}
    
#     except openai.error.AuthenticationError:
#         raise HTTPException(status_code=401, detail="Invalid OpenAI API key")
#     except openai.error.RateLimitError:
#         raise HTTPException(status_code=429, detail="OpenAI rate limit exceeded")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
import httpx

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

@app.post("/generate")
async def generate_response(request: PromptRequest, api_key: str = Depends(get_api_key)):
    try:
        check_rate_limit(api_key)

        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [
                {
                    "parts": [{"text": request.prompt}]
                }
            ]
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{GEMINI_API_URL}?key={api_key}",
                json=payload,
                headers=headers,
                timeout=60
            )
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        data = response.json()
        response_text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "No response generated")
        return {"response": response_text}

    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Request error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}