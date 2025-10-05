import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Collapse
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { CUSTOM_COLORS } from '../constants/theme';
import GeminiService, { ChatMessage } from '../services/geminiService';

interface ChatbotProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isExpanded, onToggle }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const geminiService = GeminiService.getInstance();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await geminiService.sendMessage(userMessage);
      
      if (response.success) {
        setMessages(geminiService.getConversationHistory());
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('אירעה שגיאה טכנית. אנא נסה שוב.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    geminiService.clearHistory();
    setMessages([]);
    setError(null);
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 400,
        maxHeight: 600,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        zIndex: 1000,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: CUSTOM_COLORS.primary,
          color: 'white',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer'
        }}
        onClick={onToggle}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BotIcon />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            עוזר קמפוס
          </Typography>
        </Box>
        <IconButton
          size="small"
          sx={{ color: 'white' }}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Chat Area */}
      <Collapse in={isExpanded}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 500 }}>
          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              backgroundColor: '#fafafa',
              maxHeight: 400
            }}
          >
            {messages.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <BotIcon sx={{ fontSize: 48, color: CUSTOM_COLORS.primary, mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  שלום! אני כאן לעזור לך עם השימוש באתר קמפוס
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  שאל אותי כל שאלה על הלימודים או השימוש באתר
                </Typography>
              </Box>
            )}

            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  mb: 2,
                  flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: 1
                }}
              >
                <Avatar
                  sx={{
                    backgroundColor: message.role === 'user' ? CUSTOM_COLORS.primary : '#e0e0e0',
                    color: message.role === 'user' ? 'white' : 'text.primary',
                    width: 32,
                    height: 32
                  }}
                >
                  {message.role === 'user' ? <PersonIcon /> : <BotIcon />}
                </Avatar>
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '80%',
                    backgroundColor: message.role === 'user' ? CUSTOM_COLORS.primary : 'white',
                    color: message.role === 'user' ? 'white' : 'text.primary',
                    borderRadius: message.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px'
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.content}
                  </Typography>
                </Paper>
              </Box>
            ))}

            {isLoading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Avatar sx={{ backgroundColor: '#e0e0e0', width: 32, height: 32 }}>
                  <BotIcon />
                </Avatar>
                <Paper sx={{ p: 2, backgroundColor: 'white', borderRadius: '18px 18px 18px 4px' }}>
                  <CircularProgress size={16} />
                </Paper>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <div ref={messagesEndRef} />
          </Box>

          <Divider />

          {/* Input Area */}
          <Box sx={{ p: 2, backgroundColor: 'white' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                placeholder="שאל אותי כל שאלה על קמפוס..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                sx={{
                  backgroundColor: CUSTOM_COLORS.primary,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgb(159, 189, 33)'
                  },
                  '&:disabled': {
                    backgroundColor: '#e0e0e0',
                    color: 'text.disabled'
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
            
            {messages.length > 0 && (
              <Box sx={{ mt: 1, textAlign: 'center' }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={clearChat}
                >
                  נקה שיחה
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default Chatbot;
