"use client";

import React, { useState, useEffect, useRef } from 'react';

interface Label {
  id: string;
  text: string;
  value: string;
  x: number;
  y: number;
  category: string;
}

interface Connection {
  id: string;
  from: string;
  to: string;
}

interface SavedConfiguration {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title: string;
}

const IronGateSectionOne = () => {
  // State for logic graph
  const [labels, setLabels] = useState<Label[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
  const [connectionMode, setConnectionMode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [moveMode, setMoveMode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // State for loop detection
  const [loopDetectionResult, setLoopDetectionResult] = useState<{
    hasLoop: boolean;
    loopPath: string[];
    message: string;
  } | null>(null);

  // State for configuration loading
  const [savedConfigurations, setSavedConfigurations] = useState<SavedConfiguration[]>([]);
  const [selectedConfigurationId, setSelectedConfigurationId] = useState<string>("");
  const [isLoadingConfigurations, setIsLoadingConfigurations] = useState(false);
  const [isLoadingConfiguration, setIsLoadingConfiguration] = useState(false);
  const [loadedConfiguration, setLoadedConfiguration] = useState<{
    labels: Label[];
    connections: Connection[];
  } | null>(null);

  // State for toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    loadSavedConfigurations();
  }, []);

  // Toast notification functions
  const showToast = (type: Toast['type'], title: string, message: string) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, type, title, message };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-700',
          icon: 'text-green-600 dark:text-green-400',
          title: 'text-green-800 dark:text-green-200',
          message: 'text-green-700 dark:text-green-300'
        };
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-700',
          icon: 'text-red-600 dark:text-red-400',
          title: 'text-red-800 dark:text-red-200',
          message: 'text-red-700 dark:text-red-300'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-700',
          icon: 'text-yellow-600 dark:text-yellow-400',
          title: 'text-yellow-800 dark:text-yellow-200',
          message: 'text-yellow-700 dark:text-yellow-300'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-700',
          icon: 'text-blue-600 dark:text-blue-400',
          title: 'text-blue-800 dark:text-blue-200',
          message: 'text-blue-700 dark:text-blue-300'
        };
    }
  };

  const getToastIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  // Depth-First Search for loop detection
  const detectInfiniteLoop = () => {
    if (labels.length === 0 || connections.length === 0) {
      setLoopDetectionResult({
        hasLoop: false,
        loopPath: [],
        message: "No labels or connections to analyze"
      });
      return;
    }

    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const path: string[] = [];

    const dfs = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) {
        // Found a back edge - cycle detected
        const cycleStartIndex = path.indexOf(nodeId);
        const cyclePath = path.slice(cycleStartIndex);
        setLoopDetectionResult({
          hasLoop: true,
          loopPath: cyclePath,
          message: `Infinite loop detected! Cycle: ${cyclePath.join(' → ')} → ${nodeId}`
        });
        return true;
      }

      if (visited.has(nodeId)) {
        return false;
      }

      visited.add(nodeId);
      recursionStack.add(nodeId);
      path.push(nodeId);

      // Find all outgoing connections from this node
      const outgoingConnections = connections.filter(conn => conn.from === nodeId);
      
      for (const connection of outgoingConnections) {
        if (dfs(connection.to)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      path.pop();
      return false;
    };

    // Start DFS from each unvisited node
    for (const label of labels) {
      if (!visited.has(label.id)) {
        if (dfs(label.id)) {
          return; // Loop found, result already set
        }
      }
    }

    // No loop found
    setLoopDetectionResult({
      hasLoop: false,
      loopPath: [],
      message: "✅ No infinite loops detected. Logic is safe!"
    });
  };

  const loadSavedConfigurations = async () => {
    setIsLoadingConfigurations(true);
    try {
      const response = await fetch('http://localhost:8000/api/sentra-core/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const configurations = await response.json();
      
      const validConfigurations = configurations.map((config: any) => ({
        id: config._id || config.id,
        name: config.name,
        description: config.description,
        created_at: config.created_at
      })).filter((config: any) => config.id);
      
      setSavedConfigurations(validConfigurations);
    } catch (error) {
      console.error('Error loading saved configurations:', error);
    } finally {
      setIsLoadingConfigurations(false);
    }
  };

  const loadConfiguration = async () => {
    if (!selectedConfigurationId) {
      showToast('warning', 'No Configuration Selected', 'Please select a configuration to load.');
      return;
    }

    setIsLoadingConfiguration(true);
    try {
      const response = await fetch(`http://localhost:8000/api/sentra-core/${selectedConfigurationId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const configuration = await response.json();
      
      // Get actual canvas dimensions from the container
      const canvasContainer = containerRef.current;
      const canvasWidth = canvasContainer ? canvasContainer.clientWidth - 100 : 500; // Account for padding
      const canvasHeight = canvasContainer ? canvasContainer.clientHeight - 100 : 400; // Account for padding
      
      // Find the bounds of the original coordinates to scale properly
      const xCoords = configuration.labels.map((label: any) => label.x);
      const yCoords = configuration.labels.map((label: any) => label.y);
      const minX = Math.min(...xCoords);
      const maxX = Math.max(...xCoords);
      const minY = Math.min(...yCoords);
      const maxY = Math.max(...yCoords);
      
      const originalWidth = maxX - minX;
      const originalHeight = maxY - minY;
      
      // Scale coordinates to fit the canvas with padding
      const frontendLabels = configuration.labels.map((label: any) => {
        const scaledX = ((label.x - minX) / originalWidth) * (canvasWidth - 200) + 100;
        const scaledY = ((label.y - minY) / originalHeight) * (canvasHeight - 200) + 100;
        
        return {
          id: label.id,
          text: label.text,
          value: label.value,
          x: scaledX,
          y: scaledY,
          category: label.category
        };
      });

      const frontendConnections = configuration.connections.map((connection: any) => ({
        id: connection.id,
        from: connection.from_id,
        to: connection.to_id
      }));

      // Apply the loaded configuration to the graph canvas
      setLabels(frontendLabels);
      setConnections(frontendConnections);

      setLoadedConfiguration({
        labels: frontendLabels,
        connections: frontendConnections
      });

      showToast('success', 'Configuration Loaded', 'Configuration loaded successfully!');
    } catch (error) {
      console.error('Error loading configuration:', error);
      showToast('error', 'Error Loading Configuration', 'Error loading configuration. Please try again.');
    } finally {
      setIsLoadingConfiguration(false);
    }
  };

  // Logic graph handlers
  const handleRightSectionClick = (event: React.MouseEvent) => {
    if (connectionMode && selectedLabelId && selectedLabelId !== connectionMode) {
      // Check if connection already exists
      const connectionExists = connections.some(
        conn => (conn.from === connectionMode && conn.to === selectedLabelId) ||
                (conn.from === selectedLabelId && conn.to === connectionMode)
      );
      
      if (!connectionExists) {
        const newConnection: Connection = {
          id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          from: connectionMode,
          to: selectedLabelId
        };
        setConnections(prev => [...prev, newConnection]);
      }
      setConnectionMode(null);
      setSelectedLabelId(null);
    } else {
      setSelectedLabelId(null);
      setConnectionMode(null);
    }
  };

  const handleLabelClickForConnection = (labelId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (connectionMode) {
      if (connectionMode !== labelId) {
        setSelectedLabelId(labelId);
      }
    } else {
      setConnectionMode(labelId);
    }
  };

  const handleMouseDown = (labelId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setMoveMode(labelId);
    setIsDragging(true);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging && moveMode && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newX = event.clientX - rect.left;
      const newY = event.clientY - rect.top;

      setLabels(prev => prev.map(label => 
        label.id === moveMode 
          ? { ...label, x: newX, y: newY }
          : label
      ));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setMoveMode(null);
  };

  const addLabel = (category: string) => {
    const newLabel: Label = {
      id: `label-${Date.now()}`,
      text: category.charAt(0).toUpperCase() + category.slice(1),
      value: "100",
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
      category
    };
    setLabels(prev => [...prev, newLabel]);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'move': return 'bg-blue-500';
      case 'turn': return 'bg-green-500';
      case 'grip': return 'bg-purple-500';
      case 'wait': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryHoverColor = (category: string) => {
    switch (category) {
      case 'move': return 'hover:bg-blue-600';
      case 'turn': return 'hover:bg-green-600';
      case 'grip': return 'hover:bg-purple-600';
      case 'wait': return 'hover:bg-orange-600';
      default: return 'hover:bg-gray-600';
    }
  };

  const renderConnectionLine = (fromLabel: Label, toLabel: Label, connectionId: string) => {
    const isSelected = connectionMode === fromLabel.id || selectedLabelId === toLabel.id;
    
    const fromX = fromLabel.x;
    const fromY = fromLabel.y;
    const toX = toLabel.x;
    const toY = toLabel.y;
    
    // Path: vertical first, then horizontal (same as SentraCoreSectionOne)
    return (
      <svg
        key={connectionId}
        className="absolute pointer-events-none"
        style={{
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          zIndex: 10
        }}
      >
        <path
          d={`M ${fromX} ${fromY} L ${fromX} ${toY} L ${toX} ${toY}`}
          stroke={isSelected ? "#10b981" : "#3B82F6"}
          strokeWidth={isSelected ? "3" : "2"}
          fill="none"
          strokeDasharray="5,5"
        />
      </svg>
    );
  };

  return (
    <section id="IronGate" className="pt-16 md:pt-20 lg:pt-28">
      {/* Toast Notifications Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          return (
            <div
              key={toast.id}
              className={`${styles.bg} ${styles.border} border rounded-lg p-4 max-w-sm transform transition-all duration-300 ease-in-out`}
            >
              <div className="flex items-start">
                <div className={`${styles.icon} flex-shrink-0 mr-3 mt-0.5`}>
                  {getToastIcon(toast.type)}
                </div>
                <div className="flex-1">
                  <h4 className={`${styles.title} font-semibold text-sm`}>
                    {toast.title}
                  </h4>
                  <p className={`${styles.message} text-sm mt-1`}>
                    {toast.message}
                  </p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className={`${styles.icon} ml-3 flex-shrink-0 hover:opacity-75 transition-opacity`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="container">
        <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
          <div className="-mx-4 flex flex-wrap items-top justify-between">
            
            {/* Left Side - Logic Graph and Loop Detection */}
            <div className="w-full px-4 py-4 lg:w-1/2 border border-body-color/[.15] dark:border-white/[.15] rounded-lg max-h-[850px] bg-gray-50 dark:bg-gray-900">
              <h3 className="text-xl font-bold text-body-color dark:text-white mb-4">Logic Flow Analysis</h3>
              
              {/* Loop Detection Controls */}
              <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-body-color dark:text-white">Infinite Loop Detection</h4>
                  <button
                    onClick={detectInfiniteLoop}
                    className="px-4 py-2 border hover cursor-pointer hover:bg-green-600 text-gray-600 dark:text-gray-400 font-semibold rounded-lg transition-colors"
                  >
                    🔍 Detect Loops
                  </button>
                </div>
                
                {loopDetectionResult && (
                  <div className={`p-3 rounded-lg ${
                    loopDetectionResult.hasLoop 
                      ? 'bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700' 
                      : 'bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700'
                  }`}>
                    <p className={`font-medium ${
                      loopDetectionResult.hasLoop ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'
                    }`}>
                      {loopDetectionResult.message}
                    </p>
                    {loopDetectionResult.loopPath.length > 0 && (
                      <p className="text-sm text-red-600 dark:text-red-300 mt-2">
                        Loop path: {loopDetectionResult.loopPath.join(' → ')}
                      </p>
                    )}
                  </div>
                )}
              </div>


              {/* Logic Graph Canvas */}
              <div 
                ref={containerRef}
                className="relative w-full h-[500px] h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 cursor-crosshair"
                onClick={handleRightSectionClick}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                {/* Render connection lines */}
                {connections.map(connection => {
                  const fromLabel = labels.find(l => l.id === connection.from);
                  const toLabel = labels.find(l => l.id === connection.to);
                  if (fromLabel && toLabel) {
                    return renderConnectionLine(fromLabel, toLabel, connection.id);
                  }
                  return null;
                })}
                
                {/* Render labels */}
                {labels.map((label) => (
                  <div
                    key={label.id}
                    className={`absolute rounded-md text-xs font-medium transition-colors min-w-[60px] ${
                      moveMode === label.id
                        ? `${getCategoryColor(label.category)} text-white cursor-move ${getCategoryHoverColor(label.category)}`
                        : connectionMode && connectionMode !== label.id
                        ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600'
                        : connectionMode === label.id
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : `${getCategoryColor(label.category)} text-white cursor-pointer ${getCategoryHoverColor(label.category)}`
                    }`}
                    style={{
                      left: label.x,
                      top: label.y,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 20, // Higher than connection lines (z-index: 10)
                    }}
                    onClick={(event) => handleLabelClickForConnection(label.id, event)}
                    onMouseDown={(event) => handleMouseDown(label.id, event)}
                  >
                    <div className="px-2 py-0.5 border-b border-white/20 font-semibold text-center text-xs">
                      {label.text}
                    </div>
                    <div className="px-2 py-1 text-center text-xs">
                      {label.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Load Configuration */}
            <div className="w-full px-4 py-4 lg:w-3/7 border border-body-color/[.15] dark:border-white/[.15] rounded-lg max-h-[850px] bg-gray-50 dark:bg-gray-900">
              <h3 className="text-xl font-bold text-body-color dark:text-white mb-4">Configuration Loader</h3>
              
              {/* Load Configuration */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-lg text-white bg-indigo-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7,10 12,15 17,10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="text-body-color dark:text-white font-semibold text-base block">Load Configuration</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Load a previously saved configuration</span>
                  </div>
                  <button
                    onClick={loadSavedConfigurations}
                    disabled={isLoadingConfigurations}
                    className="p-2 text-gray-500 cursor-pointer hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                    title="Refresh configurations list"
                  >
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      className={isLoadingConfigurations ? "animate-spin" : ""}
                    >
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                      <path d="M21 3v5h-5" />
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                      <path d="M3 21v-5h5" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-3">
                  <select
                    value={selectedConfigurationId}
                    onChange={(e) => setSelectedConfigurationId(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-body-color dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isLoadingConfigurations}
                  >
                    <option key="default" value="">Select a configuration...</option>
                    {savedConfigurations.map((config, index) => (
                      <option key={config.id || `config-${index}`} value={config.id || ""}>
                        {config.name} - {new Date(config.created_at).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                  
                  <button
                    onClick={loadConfiguration}
                    disabled={!selectedConfigurationId || isLoadingConfiguration}
                    className="w-full px-4 py-2 border cursor-pointer disabled:border disabled:cursor-not-allowed text-gray-600 dark:text-gray-200 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 text-sm flex items-center justify-center space-x-2"
                  >
                    {isLoadingConfiguration ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7,10 12,15 17,10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>Load Configuration</span>
                      </>
                    )}
                  </button>
                  
                  {savedConfigurations.length === 0 && !isLoadingConfigurations && (
                    <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-2">
                      No saved configurations found
                    </div>
                  )}
                  
                  {isLoadingConfigurations && (
                    <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-2 flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Loading configurations...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Loaded Configuration Display */}
              {loadedConfiguration && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-body-color dark:text-white mb-3">Loaded Configuration</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-body-color dark:text-white mb-2">Labels ({loadedConfiguration.labels.length})</h5>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {loadedConfiguration.labels.map((label) => (
                          <div key={label.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                            <span className="text-body-color dark:text-white">{label.text}</span>
                            <span className={`px-2 py-1 rounded text-xs text-white ${getCategoryColor(label.category)}`}>
                              {label.category}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-body-color dark:text-white mb-2">Connections ({loadedConfiguration.connections.length})</h5>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {loadedConfiguration.connections.map((connection) => {
                          const fromLabel = loadedConfiguration.labels.find(l => l.id === connection.from);
                          const toLabel = loadedConfiguration.labels.find(l => l.id === connection.to);
                          return (
                            <div key={connection.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                              <span className="text-body-color dark:text-white">
                                {fromLabel?.text || connection.from} → {toLabel?.text || connection.to}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IronGateSectionOne; 