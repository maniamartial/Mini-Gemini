from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os
from typing import Optional

app = FastAPI()

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, set this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

# Rate limiting dictionary (simple in-memory store, use Redis in production)
request_counts = {}

# Validate the API key in the request header
def get_api_key(x_api_key: Optional[str] = Header(None)):
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API Key is required")
    return x_api_key

# Simple rate limiting (in a production app, use a proper rate limiting solution)
def check_rate_limit(api_key: str):
    max_requests = 10  # Max requests per minute
    
    if api_key not in request_counts:
        request_counts[api_key] = 1
    else:
        if request_counts[api_key] >= max_requests:
            raise HTTPException(status_code=429, detail="Rate limit exceeded. Try again later.")
        request_counts[api_key] += 1

@app.post("/generate")
async def generate_response(request: PromptRequest, api_key: str = Depends(get_api_key)):
    try:
        # Check rate limit
        check_rate_limit(api_key)
        
        # Configure OpenAI with the provided API key
        openai.api_key = api_key
        
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # You can change this to a different model
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": request.prompt}
            ],
            max_tokens=1000,
            temperature=0.7,
        )
        
        # Extract response content
        assistant_response = response.choices[0].message.content
        
        return {"response": assistant_response}
    
    except openai.error.AuthenticationError:
        raise HTTPException(status_code=401, detail="Invalid OpenAI API key")
    except openai.error.RateLimitError:
        raise HTTPException(status_code=429, detail="OpenAI rate limit exceeded")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}