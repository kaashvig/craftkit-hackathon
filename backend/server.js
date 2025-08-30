const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));

const PORT = process.env.PORT || 5000;

// Mock database
let projects = {};

// --- AI CHAT API ---
app.post("/api/ai-chat", async (req, res) => {
  try {
    const { message, projectContext } = req.body;
    
    // Mock AI responses based on message content
    let aiResponse = "";
    
    if (message.toLowerCase().includes('student') && message.toLowerCase().includes('erp')) {
      aiResponse = `Great idea! I'll help you build a Student ERP system. Here's what we can include:

🎓 **Core Features:**
• Student Registration & Profiles
• Course Management & Enrollment  
• Grade Tracking & Report Cards
• Attendance Management
• Fee Management & Payments
• Timetable & Class Scheduling

📊 **Components to add:**
1. **Forms** - for student registration
2. **Tables** - to display student lists
3. **Dashboard Cards** - for key metrics
4. **Calendar** - for schedules
5. **Charts** - for analytics

Would you like me to generate code for any specific module? Try dragging some components to the canvas and I'll help you structure the ERP system!`;
    } else if (message.toLowerCase().includes('component')) {
      aiResponse = "I can help you with components! You can drag buttons, inputs, text, and images from the component library. Each component is fully customizable.";
    } else if (message.toLowerCase().includes('deploy')) {
      aiResponse = "To deploy your app, click the 'One-Click Deploy' button. I'll package your components into a complete React app and deploy it to Vercel.";
    } else if (message.toLowerCase().includes('code')) {
      aiResponse = `I can generate React code for your ${projectContext?.components?.length || 0} components. The code will be production-ready with proper styling and functionality.`;
    } else if (message.toLowerCase().includes('help') || message.toLowerCase().includes('build')) {
      aiResponse = "I'm here to help you build your no-code app! For the Student ERP system, start by dragging some form components (Input fields, Buttons) to create a student registration form. I can guide you through each step!";
    } else {
      aiResponse = "I'm your AI assistant for building apps! Ask me about creating components, generating code, or deploying your project. What would you like to work on?";
    }

    // Add context-aware suggestions
    if (projectContext?.components?.length > 0) {
      aiResponse += ` I see you have ${projectContext.components.length} component(s) on your canvas. Would you like me to help you connect them or add more functionality?`;
    }

    res.json({
      success: true,
      message: aiResponse
    });
    
  } catch (error) {
    console.error("AI Chat error:", error);
    res.status(500).json({
      success: false,
      error: "AI service temporarily unavailable"
    });
  }
});

// --- CODE GENERATION API ---
app.post("/api/generate-code", async (req, res) => {
  try {
    const { components, framework = 'react', projectName = 'StudentERPApp' } = req.body;
    
    const componentCode = components.map(comp => {
      switch (comp.type) {
        case 'button':
          return `
    <button 
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors shadow-lg"
      style={{ position: 'absolute', left: '${comp.x}px', top: '${comp.y}px' }}
      onClick={() => alert('${comp.props?.text || 'Button'} clicked!')}
    >
      ${comp.props?.text || 'Button'}
    </button>`;
        case 'input':
          return `
    <input 
      type="${comp.props?.type || 'text'}"
      placeholder="${comp.props?.placeholder || 'Enter text...'}"
      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 shadow-sm"
      style={{ position: 'absolute', left: '${comp.x}px', top: '${comp.y}px' }}
    />`;
        case 'text':
          return `
    <p 
      className="text-gray-800 bg-white px-3 py-2 rounded shadow"
      style={{ position: 'absolute', left: '${comp.x}px', top: '${comp.y}px' }}
    >
      ${comp.props?.content || 'Sample text'}
    </p>`;
        case 'image':
          return `
    <div 
      className="w-32 h-24 bg-gray-200 rounded flex items-center justify-center text-gray-600 shadow"
      style={{ position: 'absolute', left: '${comp.x}px', top: '${comp.y}px' }}
    >
      🖼️ Image
    </div>`;
        default:
          return `
    <div 
      className="bg-purple-600 text-white px-3 py-2 rounded shadow-lg"
      style={{ position: 'absolute', left: '${comp.x}px', top: '${comp.y}px' }}
    >
      ${comp.name}
    </div>`;
      }
    }).join('');

    const fullCode = `
import React, { useState } from 'react';

export default function ${projectName.replace(/[^a-zA-Z0-9]/g, '')}() {
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Student ERP System
        </h1>
        
        <div className="relative bg-white rounded-xl shadow-2xl p-8 min-h-96">
          <div className="absolute top-4 left-4 text-sm text-gray-600">
            Components: ${components.length} | Generated with Craft-Kit-AI
          </div>
          
          ${componentCode}
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-2">Next Steps for ERP:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Add form validation for student data</li>
              <li>• Connect to database for data persistence</li>
              <li>• Implement user authentication</li>
              <li>• Add routing for different modules</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}`;

    res.json({
      success: true,
      code: fullCode,
      componentCount: components.length,
      message: "Code generated successfully for Student ERP System!"
    });
    
  } catch (error) {
    console.error("Code generation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate code"
    });
  }
});

// --- DEPLOYMENT API ---
app.post("/api/deploy", async (req, res) => {
  try {
    const { projectName = 'student-erp-system', components = [] } = req.body;
    
    // Simulate deployment process
    console.log(`🚀 Deploying ${projectName} with ${components.length} components...`);
    
    setTimeout(() => {
      const deploymentUrl = `https://${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}.vercel.app`;
      
      res.json({
        success: true,
        deploymentId: Date.now().toString(),
        deploymentUrl: deploymentUrl,
        platform: 'vercel',
        status: 'deployed',
        message: `🎉 Successfully deployed your Student ERP System!`
      });
    }, 2000);
    
  } catch (error) {
    console.error("Deployment error:", error);
    res.status(500).json({
      success: false,
      error: "Deployment failed"
    });
  }
});

// --- BUTTON CLICK HANDLER ---
app.post("/api/button-click", (req, res) => {
  const { buttonName, projectId } = req.body;
  console.log(`🔥 Button clicked: ${buttonName} in project ${projectId || 'default'}`);
  
  let responseData = { 
    message: `${buttonName} action triggered successfully!`,
    success: true 
  };
  
  switch(buttonName) {
    case 'Drag & Drop UI':
      responseData.action = 'component-library-opened';
      responseData.message = 'Component library is ready! Drag components to build your ERP system.';
      break;
    case 'AI Code Generation':
      responseData.action = 'code-generation-started';
      responseData.message = 'AI code generation initiated!';
      break;
    case 'One-Click Deploy':
      responseData.action = 'deployment-started';
      responseData.message = 'Deployment process started!';
      break;
    default:
      responseData.action = 'generic-action';
  }
  
  res.json(responseData);
});

// --- HEALTH CHECK ---
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    services: {
      ai: "active",
      deployment: "active", 
      codeGeneration: "active"
    }
  });
});

// --- ERROR HANDLING ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Something went wrong!",
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Craft-Kit-AI Backend running on http://localhost:${PORT}`);
  console.log(`📦 Services: AI Chat, Code Generation, Deployment`);
  console.log(`🎯 Ready for Student ERP development!`);
});

module.exports = app;
