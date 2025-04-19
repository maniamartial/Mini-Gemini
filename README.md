# AI Assistant

A full-stack web application using Next.js and FastAPI to interact with GEMINI's API.

## Features

- User-friendly AI prompt interface
- Secure API key management
- Chat history tracking
- FastAPI backend for OpenAI integration
- Responsive design
- Dark/light mode support

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Python (v3.8 or later)
- Gemini API key

### Installation

1. Clone the repository

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd api
pip install -r requirements.txt
```

### Running the Application

1. Start the frontend
```bash
npm run dev
```

2. Start the backend
```bash
npm run api
# Or directly with: cd api && uvicorn main:app --reload
```

3. Open your browser and navigate to http://localhost:3000


4. Add your GEMINI API key in the settings
 

## Usage

1. Click the settings icon in the top-right corner
2. Enter your GEMINI API key
      ![Screenshot 2025-04-19 at 17 53 50](https://github.com/user-attachments/assets/87a3fb33-2bf4-49f5-88d3-cf1d8b29fc78)

4. Start chatting with the AI by entering prompts in the text area
   ![Screenshot 2025-04-19 at 16 45 51](https://github.com/user-attachments/assets/7e08eaea-4d5a-4e6b-900c-c007d0380ee7)

6. View and copy responses as needed
   ![Screenshot 2025-04-19 at 16 44 52](https://github.com/user-attachments/assets/37bd5522-8cca-4541-bf51-8bd3974709b4)


## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: FastAPI, Python, GEMINI API
- **State Management**: React Hooks
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion

## License

MIT
