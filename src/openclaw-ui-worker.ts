export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    // Serve OpenClaw UI
    if (url.pathname === "/" || url.pathname === "/ui") {
      const uiHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenClaw Control Panel</title>
    <meta name="color-scheme" content="dark">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #12141a; color: #e4e4e7; overflow-x: hidden;
        }
        .header {
            background: linear-gradient(135deg, #ff5c5c 0%, #ff7070 100%);
            padding: 1rem 2rem; display: flex; align-items: center; gap: 1rem;
            box-shadow: 0 2px 10px rgba(255, 92, 92, 0.2);
        }
        .logo { font-size: 1.5rem; font-weight: 700; }
        .nav { display: flex; gap: 1rem; margin-left: auto; }
        .nav button {
            background: rgba(255,255,255,0.2); border: none; color: white;
            padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;
            transition: all 0.2s;
        }
        .nav button:hover { background: rgba(255,255,255,0.3); }
        .main { display: grid; grid-template-columns: 250px 1fr; height: calc(100vh - 80px); }
        
        .sidebar {
            background: #1a1d25; border-right: 1px solid #27272a; padding: 1rem;
            overflow-y: auto;
        }
        .sidebar-item {
            display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem;
            border-radius: 8px; cursor: pointer; transition: background 0.2s;
            margin-bottom: 0.5rem;
        }
        .sidebar-item:hover { background: #262a35; }
        .sidebar-item.active { background: #ff5c5c; color: white; }
        .sidebar-icon { width: 20px; height: 20px; }
        
        .content {
            padding: 2rem; overflow-y: auto;
            background: linear-gradient(135deg, #12141a 0%, #1a1d25 100%);
        }
        .chat-container {
            background: #181b22; border-radius: 12px; height: calc(100vh - 200px);
            display: flex; flex-direction: column; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .chat-header {
            padding: 1rem 1.5rem; border-bottom: 1px solid #27272a;
            display: flex; align-items: center; gap: 1rem;
        }
        .chat-messages {
            flex: 1; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem;
        }
        .message {
            max-width: 80%; padding: 1rem; border-radius: 12px; position: relative;
        }
        .message.user {
            background: linear-gradient(135deg, #ff5c5c 0%, #ff7070 100%);
            color: white; align-self: flex-end; margin-left: auto;
        }
        .message.assistant {
            background: #262a35; color: #e4e4e7; align-self: flex-start;
        }
        .chat-input {
            padding: 1rem; border-top: 1px solid #27272a; display: flex; gap: 1rem;
        }
        .chat-input input {
            flex: 1; padding: 0.75rem 1rem; background: #262a35; border: 1px solid #3f3f46;
            border-radius: 8px; color: #e4e4e7; outline: none;
        }
        .chat-input input:focus { border-color: #ff5c5c; }
        .send-btn {
            background: linear-gradient(135deg, #ff5c5c 0%, #ff7070 100%);
            border: none; color: white; padding: 0.75rem 1.5rem; border-radius: 8px;
            cursor: pointer; font-weight: 500;
        }
        .send-btn:hover { opacity: 0.9; }
        
        .card {
            background: #181b22; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;
            border: 1px solid #27272a; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .card h3 { color: #ff5c5c; margin-bottom: 1rem; }
        .skill-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
        .skill-item {
            background: #262a35; padding: 1rem; border-radius: 8px; cursor: pointer;
            transition: all 0.2s; border: 1px solid transparent;
        }
        .skill-item:hover { border-color: #ff5c5c; transform: translateY(-2px); }
        .channel-item {
            display: flex; align-items: center; justify-content: space-between;
            padding: 1rem; background: #262a35; border-radius: 8px; margin-bottom: 0.5rem;
        }
        .status { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 500; }
        .status.online { background: #22c55e; color: white; }
        .status.offline { background: #71717a; color: white; }
        
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease-out; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🦀 OpenClaw</div>
        <div class="nav">
            <button onclick="connectGateway()">Connect Gateway</button>
            <button onclick="showSettings()">Settings</button>
        </div>
    </div>
    
    <div class="main">
        <div class="sidebar">
            <div class="sidebar-item active" onclick="showTab('chat')">
                <span class="sidebar-icon">💬</span>
                <span>Chat</span>
            </div>
            <div class="sidebar-item" onclick="showTab('skills')">
                <span class="sidebar-icon">🛠️</span>
                <span>Skills</span>
            </div>
            <div class="sidebar-item" onclick="showTab('channels')">
                <span class="sidebar-icon">📡</span>
                <span>Channels</span>
            </div>
            <div class="sidebar-item" onclick="showTab('agents')">
                <span class="sidebar-icon">🤖</span>
                <span>Agents</span>
            </div>
            <div class="sidebar-item" onclick="showTab('logs')">
                <span class="sidebar-icon">📝</span>
                <span>Logs</span>
            </div>
            <div class="sidebar-item" onclick="showTab('config')">
                <span class="sidebar-icon">⚙️</span>
                <span>Config</span>
            </div>
        </div>
        
        <div class="content">
            <div id="chat" class="tab-content active fade-in">
                <div class="chat-container">
                    <div class="chat-header">
                        <h3>AI Assistant</h3>
                        <span class="status online">Connected</span>
                    </div>
                    <div class="chat-messages" id="messages">
                        <div class="message assistant">
                            👋 Hello! I'm your OpenClaw AI assistant. I can help you with:
                            <br>• Managing channels and integrations
                            <br>• Configuring skills and agents
                            <br>• Monitoring system status
                            <br>• Setting up automations
                            <br><br>What would you like to do today?
                        </div>
                    </div>
                    <div class="chat-input">
                        <input type="text" id="messageInput" placeholder="Type your message..." onkeypress="handleKeyPress(event)">
                        <button class="send-btn" onclick="sendMessage()">Send</button>
                    </div>
                </div>
            </div>
            
            <div id="skills" class="tab-content fade-in">
                <div class="card">
                    <h3>Available Skills</h3>
                    <div class="skill-grid">
                        <div class="skill-item">
                            <h4>Web Search</h4>
                            <p>Search the web for information</p>
                        </div>
                        <div class="skill-item">
                            <h4>Code Generation</h4>
                            <p>Generate and execute code</p>
                        </div>
                        <div class="skill-item">
                            <h4>File Operations</h4>
                            <p>Read, write, and manage files</p>
                        </div>
                        <div class="skill-item">
                            <h4>Email</h4>
                            <p>Send and receive emails</p>
                        </div>
                        <div class="skill-item">
                            <h4>Calendar</h4>
                            <p>Manage calendar events</p>
                        </div>
                        <div class="skill-item">
                            <h4>+ Add Skill</h4>
                            <p>Install new capabilities</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="channels" class="tab-content fade-in">
                <div class="card">
                    <h3>Communication Channels</h3>
                    <div class="channel-item">
                        <div>
                            <h4>WhatsApp</h4>
                            <p>WhatsApp Business API integration</p>
                        </div>
                        <span class="status online">Connected</span>
                    </div>
                    <div class="channel-item">
                        <div>
                            <h4>Telegram</h4>
                            <p>Telegram Bot API</p>
                        </div>
                        <span class="status offline">Disconnected</span>
                    </div>
                    <div class="channel-item">
                        <div>
                            <h4>Discord</h4>
                            <p>Discord Bot integration</p>
                        </div>
                        <span class="status offline">Disconnected</span>
                    </div>
                    <div class="channel-item">
                        <div>
                            <h4>Slack</h4>
                            <p>Slack Bot integration</p>
                        </div>
                        <span class="status offline">Disconnected</span>
                    </div>
                </div>
            </div>
            
            <div id="agents" class="tab-content fade-in">
                <div class="card">
                    <h3>AI Agents</h3>
                    <p>Configure and manage your AI agents here. Connect to OpenAI, Anthropic, or other providers.</p>
                </div>
            </div>
            
            <div id="logs" class="tab-content fade-in">
                <div class="card">
                    <h3>System Logs</h3>
                    <p>Monitor system activities and debug issues.</p>
                </div>
            </div>
            
            <div id="config" class="tab-content fade-in">
                <div class="card">
                    <h3>Configuration</h3>
                    <p>System settings and environment configuration.</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        function showTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(el => {
                el.classList.remove('active');
            });
            document.querySelectorAll('.sidebar-item').forEach(el => {
                el.classList.remove('active');
            });
            
            // Show selected tab
            document.getElementById(tabName).classList.add('active', 'fade-in');
            event.target.closest('.sidebar-item').classList.add('active');
        }
        
        function sendMessage() {
            const input = document.getElementById('messageInput');
            const messages = document.getElementById('messages');
            
            if (input.value.trim()) {
                // Add user message
                const userMsg = document.createElement('div');
                userMsg.className = 'message user';
                userMsg.textContent = input.value;
                messages.appendChild(userMsg);
                
                // Simulate assistant response
                setTimeout(() => {
                    const assistantMsg = document.createElement('div');
                    assistantMsg.className = 'message assistant';
                    assistantMsg.innerHTML = \`I understand you want to \${input.value.toLowerCase()}. This would typically connect to your OpenClaw gateway running locally. To set this up:<br><br>1. Install OpenClaw locally<br>2. Start the gateway: <code>openclaw gateway</code><br>3. Connect this UI to your local instance<br><br>Would you like help with the setup?\`;
                    messages.appendChild(assistantMsg);
                    messages.scrollTop = messages.scrollHeight;
                }, 1000);
                
                input.value = '';
                messages.scrollTop = messages.scrollHeight;
            }
        }
        
        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }
        
        function connectGateway() {
            alert('To connect to your OpenClaw gateway:\\n\\n1. Install OpenClaw locally\\n2. Run: openclaw gateway --port 3000\\n3. Configure this UI to connect to localhost:3000\\n\\nThis will enable full functionality with chat, skills, and channels.');
        }
        
        function showSettings() {
            alert('Settings:\\n\\n• Gateway URL: localhost:3000\\n• UI Mode: Web Interface\\n• Theme: Dark\\n\\nTo modify settings, connect to your local OpenClaw instance.');
        }
    </script>
</body>
</html>`;
      return new Response(uiHTML, { 
        headers: { "content-type": "text/html" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};