import React, { useState } from 'react';
import './keyInput.css';

export const KeyInput: React.FC<{ onSave: (key: string) => void }> = ({ onSave }) => {
    const [apiKey, setApiKey] = useState<string>('');

    const handleKeySave = () => {
        if (apiKey.trim().startsWith('sk-')) { // Validate key format
            onSave(apiKey.trim());
            setApiKey('');
        } else if (apiKey !== '') {
            alert('Invalid API Key format. Please check and try again.');
        }
    };

    return (
        <input
            id="apiKey"
            type="password"
            className="key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)} // Update state on change
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleKeySave(); // Use the latest state value
                }
            }}
            onBlur={handleKeySave} // Handle save on blur
            placeholder="Enter your OpenAI API key"
        />
    );
};