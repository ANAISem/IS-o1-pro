import React from 'react';

interface ChatToolbarProps {
  input: string;
  onInputChange: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

const ChatToolbar: React.FC<ChatToolbarProps> = ({ input, onInputChange, onSend, isLoading }) => {
  return (
    <div style={{ marginTop: '1rem', display: 'flex', gap: '8px' }}>
      <input
        type="text"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        style={{ width: '80%', padding: '8px' }}
        disabled={isLoading}
      />
      <button 
        onClick={onSend} 
        disabled={isLoading}
        style={{ 
          padding: '8px 16px',
          backgroundColor: isLoading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Sendet...' : 'Senden'}
      </button>
    </div>
  );
};

export default ChatToolbar;
