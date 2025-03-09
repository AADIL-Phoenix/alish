import { useState } from 'react';
import Sidebar from './Sidebar';
import Chat from './Chat';
import Community from './Community';

const Layout = ({ children }) => {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'community'

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - adjust width for better proportions */}
      <div className="w-64 h-full bg-white border-r shadow-sm flex-shrink-0">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      {/* Main content area */}
      <div className="flex flex-1 h-full overflow-hidden">
        {/* Chat/Community section - adjust width for better proportions */}
        <div className="w-96 h-full border-r bg-white shadow-sm flex-shrink-0 overflow-hidden flex flex-col">
          {activeTab === 'chat' ? <Chat /> : <Community />}
        </div>
        
        {/* Content area */}
        <div className="flex-1 h-full bg-white overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout; 