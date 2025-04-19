# AI Assistant

A full-stack web application using Next.js and FastAPI to interact with OpenAI's API.

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
- OpenAI API key

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

4. Add your OpenAI API key in the settings

## Usage

1. Click the settings icon in the top-right corner
2. Enter your OpenAI API key
3. Start chatting with the AI by entering prompts in the text area
4. View and copy responses as needed

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: FastAPI, Python, OpenAI API
- **State Management**: React Hooks
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion

## License

MIT