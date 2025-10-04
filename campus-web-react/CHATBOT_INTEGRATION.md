# Chatbot Integration with Gemini API

## Overview
This project now includes a chatbot integration using Google's Gemini API to provide assistance to users on the Help page.

## Features
- **Context-Aware Responses**: The chatbot is specifically trained to answer questions about the Campus website and learning-related topics
- **Hebrew Language Support**: All interactions are in Hebrew
- **Real-time Chat Interface**: Modern chat UI with message history
- **Context Filtering**: The bot only responds to relevant questions about the website and learning
- **Responsive Design**: Works on both desktop and mobile devices

## Components Added

### 1. GeminiService (`src/services/geminiService.ts`)
- Handles API communication with Google Gemini
- Manages conversation history
- Implements context filtering to ensure relevant responses
- Error handling and fallback responses

### 2. Chatbot Component (`src/components/Chatbot.tsx`)
- Modern chat interface with Material-UI
- Real-time message display
- Loading states and error handling
- Expandable/collapsible design
- Message history management

### 3. Updated Help Page (`src/components/HelpPage.tsx`)
- Integrated chatbot alongside existing FAQ sections
- Responsive grid layout
- Information panel about the virtual assistant

## Configuration

### Environment Variables
The API key is configured in `.env`:
```
VITE_GEMINI_API_KEY=AIzaSyDYSXShZ89-LkTcJ_x7txJNWfSKkb7fnQo
```

### Dependencies Added
- `@google/generative-ai`: Google's official Gemini API client

## Usage

1. Navigate to the Help page
2. The chatbot appears as a floating widget in the bottom-right corner
3. Click to expand and start chatting
4. Ask questions about:
   - Website functionality
   - Learning management features
   - Campus services
   - Academic processes

## Context Filtering

The chatbot is programmed to:
- ✅ Answer questions about the Campus website
- ✅ Help with learning-related queries
- ✅ Explain website features and functionality
- ❌ Respond to unrelated topics (weather, general knowledge, etc.)

When asked irrelevant questions, the bot responds with:
> "סליחה, אני יכול לעזור רק עם שאלות הקשורות לאתר קמפוס וללימודים במכללה. איך אוכל לעזור לך עם השימוש באתר?"

## Technical Implementation

### API Integration
- Uses Google Generative AI SDK
- Implements proper error handling
- Manages conversation state
- Optimized for Hebrew language responses

### UI/UX Features
- Floating chat widget
- Smooth animations
- Message typing indicators
- Clear conversation history
- Mobile-responsive design

### Security
- API key stored in environment variables
- No sensitive data stored in chat history
- Proper error handling for API failures

## Future Enhancements
- Voice input/output capabilities
- Integration with user authentication
- Analytics for common questions
- Multi-language support
- Advanced context awareness
