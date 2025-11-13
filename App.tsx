import React from 'react';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-dark text-white/90 font-display">
      <div className="relative flex flex-col h-screen">
        <Header />
        <ChatInterface />
      </div>
    </div>
  );
};

export default App;