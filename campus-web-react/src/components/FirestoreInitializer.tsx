import React, { useState } from 'react';
import { initializeAllCollections, testAllCollections } from '../fireStore/initializeCollections';

interface FirestoreInitializerProps {
  onInitializationComplete?: () => void;
}

const FirestoreInitializer: React.FC<FirestoreInitializerProps> = ({ onInitializationComplete }) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleInitialize = async () => {
    setIsInitializing(true);
    setStatus('מאתחל את האוספים...');
    setLogs([]);
    
    try {
      addLog('🚀 מתחיל לאתחל את אוספי Firestore...');
      
      // Override console.log to capture logs
      const originalLog = console.log;
      const originalError = console.error;
      
      console.log = (...args) => {
        addLog(args.join(' '));
        originalLog(...args);
      };
      
      console.error = (...args) => {
        addLog(`❌ ${args.join(' ')}`);
        originalError(...args);
      };

      await initializeAllCollections();
      
      // Restore original console functions
      console.log = originalLog;
      console.error = originalError;
      
      setStatus('✅ האוספים נוצרו בהצלחה!');
      addLog('🎉 כל האוספים נוצרו בהצלחה!');
      
      onInitializationComplete?.();
      
    } catch (error) {
      setStatus('❌ שגיאה ביצירת האוספים');
      addLog(`❌ שגיאה: ${error}`);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setStatus('בודק את האוספים...');
    
    try {
      const results = await testAllCollections();
      
      if (results) {
        setStatus('✅ כל האוספים עובדים תקין!');
        addLog('✅ כל האוספים נבדקו בהצלחה!');
      } else {
        setStatus('❌ חלק מהאוספים נכשלו בבדיקה');
        addLog('❌ חלק מהאוספים נכשלו בבדיקה');
      }
      
    } catch (error) {
      setStatus('❌ שגיאה בבדיקת האוספים');
      addLog(`❌ שגיאה בבדיקה: ${error}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      margin: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2>אתחול אוספי Firestore</h2>
      <p>כלי זה יוצר את כל האוספים הנדרשים במסד הנתונים עם נתוני דמו.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleInitialize}
          disabled={isInitializing || isTesting}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: isInitializing ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isInitializing ? 'not-allowed' : 'pointer'
          }}
        >
          {isInitializing ? 'מאתחל...' : 'אתחל אוספים'}
        </button>
        
        <button 
          onClick={handleTest}
          disabled={isInitializing || isTesting}
          style={{
            padding: '10px 20px',
            backgroundColor: isTesting ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isTesting ? 'not-allowed' : 'pointer'
          }}
        >
          {isTesting ? 'בודק...' : 'בדוק אוספים'}
        </button>
      </div>

      {status && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: status.includes('✅') ? '#d4edda' : status.includes('❌') ? '#f8d7da' : '#d1ecf1',
          border: `1px solid ${status.includes('✅') ? '#c3e6cb' : status.includes('❌') ? '#f5c6cb' : '#bee5eb'}`,
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <strong>סטטוס:</strong> {status}
        </div>
      )}

      {logs.length > 0 && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6', 
          borderRadius: '4px', 
          padding: '10px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          <h4>לוגים:</h4>
          {logs.map((log, index) => (
            <div key={index} style={{ 
              fontFamily: 'monospace', 
              fontSize: '12px',
              marginBottom: '2px',
              color: log.includes('❌') ? '#dc3545' : log.includes('✅') ? '#28a745' : '#333'
            }}>
              {log}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h4>אוספים שייווצרו:</h4>
        <ul>
          <li><strong>users</strong> - חשבונות משתמשים ופרופילים</li>
          <li><strong>students</strong> - רשומות סטודנטים עם מידע אקדמי</li>
          <li><strong>events</strong> - אירועי קמפוס ופעילויות</li>
          <li><strong>facilities</strong> - מתקני קמפוס וסטטוס שלהם</li>
          <li><strong>tasks</strong> - משימות אקדמיות והגשות</li>
          <li><strong>courses</strong> - מידע קורסים והתקדמות</li>
          <li><strong>messages</strong> - הודעות תקשורת</li>
        </ul>
      </div>
    </div>
  );
};

export default FirestoreInitializer;
