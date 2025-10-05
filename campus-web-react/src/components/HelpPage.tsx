import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import { CUSTOM_COLORS, TYPOGRAPHY } from '../constants/theme';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Chatbot from './Chatbot';

const HelpPage: React.FC = () => {
  const [isChatbotExpanded, setIsChatbotExpanded] = useState(false);

  const helpSections = [
    {
      title: "מה זה קמפוס?",
      content: "קמפוס היא מערכת ניהול מקיפה שמאפשרת לסטודנטים ומרצים להיכנס ולנהל את חיי הסטודנטים במכללה. מערכת זו מכילה כלים לניהול מטלות, ציונים, תפריט קפיטריה, מציאות ואבדות, שוק יד שנייה ועוד."
    },
    {
      title: "כיצד להתחבר?",
      content: "כדי להתחבר למערכת, יש לספק את פרטי ההתחברות שלך. אם אתה סטודנט, יש להזין אימייל וסיסמה שקיבלת מהמערכת. אם אתה מרצה, יש להזין את פרטי ההתחברות שלך שהוגדרו על ידי המנהל."
    },
    {
      title: "איך אני יכול לנהל מטלות?",
      content: "במרכז הלימודים, תוכל לצפות במטלות שלך, להוסיף מטלות חדשות, לערוך ולמחוק מטלות קיימות. כל מטלה מכילה סוג, קורס, כותרת, תיאור, תאריך יעד ודחיפות. תוכל לסמן מטלות כהושלמות כשהגעת לתוצאה."
    },
    {
      title: "איך אני יכול להגיש מטלה?",
      content: "לפני תאריך הגשה של מטלה, יש לך זמן מספיק. במרכז הלימודים, תוכל לגשת למטלה ולהוסיף קובץ או תיאור של הפתרון. בתאריך הגשה, תוכל להגיש את המטלה ולצפות בסטטוס שלה."
    },
    {
      title: "איך אני יכול לראות את הציונים שלי?",
      content: "במרכז הלימודים, תוכל לראות את כל הציונים שלך בטבלה. כל ציון מכיל קורס, נקודות זכות, ציון וסטטוס. תוכל לצפות בציונים הנוכחיים והיסטוריים."
    },
    {
      title: "איך אני יכול להזמין חדר למידה?",
      content: "במרכז השירותים, תוכל להזמין חדר למידה בהתאם לצרכים שלך. בחר סוג חדר, תאריך ושעה. תוכל לבחור משך זמן שונה בהתאם לצרכים שלך."
    },
    {
      title: "איך אני יכול להזמין הסעה?",
      content: "במרכז השירותים, תוכל להזמין הסעה ליעד שונה. בחר יעד, תאריך ושעה. תוכל לבחור משך זמן שונה בהתאם לצרכים שלך."
    },
    {
      title: "איך אני יכול להזמין קפה או סלט בקפיטריה?",
      content: "בקפיטריה, תוכל להזמין תפריט יומי ולבחור מנה. בחר מנה שונה מתוך התפריט המפורט והוסף הערות מיוחדות אם צריך. תוכל לבחור מועד שונה להזמנה."
    },
    {
      title: "איך אני יכול לדווח על תקלה או הצעה?",
      content: "במרכז הקהילה, תוכל לדווח על תקלות ולהציע שיפורים. בחר סוג תקלה או הצעה, והוסף מיקום ותיאור שלך. תוכל לשלוח את הדיווח או ההצעה ולצפות בתשובה מהמנהל."
    },
    {
      title: "איך אני יכול להציע פריט למכירה או למצוא פריט שאבדתי?",
      content: "בשוק היד שנייה, תוכל להוסיף פריט למכירה או לחפש פריטים שאבדת. בחר סוג דיווח (אבדתי או מצאתי), קטגוריה ומיקום. הוסף תיאור ותאריך ושלח דיווח. תוכל לצפות בפריטים האחרונים שהודעו ולצור קשר עם המוכרים."
    },
    {
      title: "איך אני יכול להתקבל מודעות או הודעות?",
      content: "במרכז הקהילה, תוכל לצפות בהודעות ומודעות שנשלחו אליך. תוכל להגיב על הודעות או להסיר אותן אם זה נדרש."
    },
    {
      title: "איך אני יכול להתקבל מודעות ממערכת של מטלות או ציונים?",
      content: "במרכז הלימודים, תוכל לקבל הודעות ממערכת בגירסה של דואר אלקטרוני או במערכת הפעולה. תוכל לצפות בסטטוס של מטלות וציונים ולהגיב על הודעות ממערכת."
    },
    {
      title: "איך אני יכול להתקבל מודעות משוק היד שנייה?",
      content: "בשוק היד שנייה, תוכל לקבל הודעות ממוכרים שמציעים פריטים למכירה או שמבקשים ממך משהו. תוכל לצור קשר עם המוכרים ולהגיב על הודעות."
    },
    {
      title: "איך אני יכול להתקבל מודעות ממרכז השירותים?",
      content: "במרכז השירותים, תוכל לקבל הודעות ממערכת בגירסה של דואר אלקטרוני או במערכת הפעולה. תוכל לצפות בסטטוס של הזמנות חדרים והסעות ולהגיב על הודעות ממערכת."
    },
    {
      title: "איך אני יכול להתקבל מודעות ממרכז הקהילה?",
      content: "במרכז הקהילה, תוכל לקבל הודעות ממשתמשים אחרים במערכת או ממנהלים. תוכל לצפות בדיווחי תקלות והצעות שונות ולהגיב על הודעות."
    },
    {
      title: "איך אני יכול להתקבל מודעות ממרכז הפרופיל?",
      content: "במרכז הפרופיל, תוכל לקבל הודעות ממערכת בגירסה של דואר אלקטרוני או במערכת הפעולה. תוכל לצפות בפרטים שלך ולעדכן אותם בפעולות שונות."
    },
    {
      title: "איך אני יכול להתקבל מודעות ממערכת כללית?",
      content: "תוכל לקבל הודעות ממערכת כללית שנשלחו לכל המשתמשים במערכת. תוכל לצפות בהודעות אלה ולהגיב עליהן אם זה נדרש."
    }
  ];

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ 
            ...TYPOGRAPHY.h3,
            color: CUSTOM_COLORS.primary,
            textAlign: 'center',
            mb: 3
          }}>
            מרכז העזרה
          </Typography>
          <Typography variant="h6" sx={{ 
            textAlign: 'center', 
            color: 'text.secondary',
            mb: 4
          }}>
            כאן תוכל למצוא תשובות לכל השאלות הנפוצות על השימוש במערכת קמפוס
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 2 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
              {helpSections.map((section, index) => (
                <Box key={index}>
                  <Accordion sx={{ 
                    mb: 1,
                    '&:before': {
                      display: 'none',
                    },
                    boxShadow: 'none',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2
                  }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        backgroundColor: 'rgb(179, 209, 53)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgb(159, 189, 33)',
                        },
                        borderRadius: index === 0 ? '8px 8px 0 0' : '0',
                        '& .MuiAccordionSummary-content': {
                          margin: '12px 0',
                        }
                      }}
                    >
                      <Typography variant="h6" sx={TYPOGRAPHY.h6}>
                        {section.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ 
                      backgroundColor: '#fafafa',
                      p: 3
                    }}>
                      <Typography variant="body1" sx={{ 
                        lineHeight: 1.8,
                        fontSize: '1.1rem'
                      }}>
                        {section.content}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  {index < helpSections.length - 1 && (
                    <Divider sx={{ my: 1 }} />
                  )}
                </Box>
              ))}
            </Paper>
          </Box>
          
          <Box sx={{ flex: 1, minWidth: { md: 300 } }}>
            <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
              <Typography variant="h5" sx={{ 
                color: CUSTOM_COLORS.primary,
                mb: 2,
                textAlign: 'center'
              }}>
                עוזר וירטואלי
              </Typography>
              <Typography variant="body2" sx={{ 
                color: 'text.secondary',
                mb: 3,
                textAlign: 'center'
              }}>
                שאל את העוזר הווירטואלי שלנו כל שאלה על השימוש באתר קמפוס
              </Typography>
              <Box sx={{ 
                textAlign: 'center',
                p: 2,
                backgroundColor: '#f5f5f5',
                borderRadius: 2,
                mb: 2
              }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  העוזר זמין בפינה הימנית התחתונה של המסך
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            לא מצאת את התשובה שחיפשת? צור קשר עם התמיכה הטכנית
          </Typography>
        </Box>
      </Container>
      
      <Chatbot 
        isExpanded={isChatbotExpanded}
        onToggle={() => setIsChatbotExpanded(!isChatbotExpanded)}
      />
    </>
  );
};

export default HelpPage;
