"use client";

import React, { useState, useEffect, useRef } from 'react';

interface SensorData {
  timestamp: number;
  [key: string]: number | string;
}

interface Label {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  category: string;
  color: string;
}

interface SensorFile {
  id: string;
  name: string;
  type: 'lidar' | 'imu';
  data: SensorData[];
  loaded: boolean;
}

interface RobotPosition {
  x: number;
  y: number;
  angle: number; // in degrees
}

interface RobotMovement {
  id: string;
  type: 'move' | 'turn' | 'wait' | 'grip';
  value: number;
  duration: number; // in seconds
  startTime: number;
  endTime: number;
  fromPosition: RobotPosition;
  toPosition: RobotPosition;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title: string;
}

const SensorGridSectionOne = () => {
  // State for sensor data
  const [sensorFiles, setSensorFiles] = useState<SensorFile[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [timeRange, setTimeRange] = useState({ start: 0, end: 100 });

  // State for labeling
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  const [labelingMode, setLabelingMode] = useState<'point' | 'range' | 'none'>('none');
  const [newLabelText, setNewLabelText] = useState('');
  const [newLabelCategory, setNewLabelCategory] = useState('event');

  // State for timeline
  const [timelineStart, setTimelineStart] = useState(0);
  const [timelineEnd, setTimelineEnd] = useState(100);

  // State for configuration
  const [savedConfigurations, setSavedConfigurations] = useState<any[]>([]);
  const [selectedConfigurationId, setSelectedConfigurationId] = useState<string>("");
  const [selectedConfigurationName, setSelectedConfigurationName] = useState<string>("");
  const [isLoadingConfigurations, setIsLoadingConfigurations] = useState(false);
  const [isLoadingConfiguration, setIsLoadingConfiguration] = useState(false);

  // State for robot movement simulation
  const [robotPosition, setRobotPosition] = useState<RobotPosition>({ x: 100, y: 100, angle: 0 });
  const [robotMovements, setRobotMovements] = useState<RobotMovement[]>([]);
  const [isRobotMoving, setIsRobotMoving] = useState(false);
  const [robotSimulationTime, setRobotSimulationTime] = useState(0);
  const [robotSimulationSpeed, setRobotSimulationSpeed] = useState(1);
  const [isRobotSimulationPlaying, setIsRobotSimulationPlaying] = useState(false);

  // State for toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Refs
  const timelineRef = useRef<HTMLDivElement>(null);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Toast notification functions
  const showToast = (type: Toast['type'], title: string, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = { id, type, title, message };
    setToasts(prev => [...prev, newToast]);
    
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

  // File upload handling
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          let data: SensorData[] = [];
          
          if (file.name.endsWith('.csv')) {
            data = parseCSV(content);
          } else if (file.name.endsWith('.json')) {
            data = JSON.parse(content);
          } else {
            showToast('error', 'Invalid File', 'Please upload CSV or JSON files only');
            return;
          }

          const sensorFile: SensorFile = {
            id: Date.now().toString(),
            name: file.name,
            type: file.name.toLowerCase().includes('lidar') ? 'lidar' : 'imu',
            data: data,
            loaded: true
          };

          setSensorFiles(prev => [...prev, sensorFile]);
          showToast('success', 'File Uploaded', `${file.name} loaded successfully`);
          
          // Update time range if this is the first file
          if (sensorFiles.length === 0) {
            const timestamps = data.map(d => d.timestamp);
            const minTime = Math.min(...timestamps);
            const maxTime = Math.max(...timestamps);
            setTimeRange({ start: minTime, end: maxTime });
            setTimelineStart(minTime);
            setTimelineEnd(maxTime);
          }
        } catch (error) {
          showToast('error', 'Parse Error', `Failed to parse ${file.name}`);
        }
      };
      reader.readAsText(file);
    });
  };

  const parseCSV = (content: string): SensorData[] => {
    const lines = content.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data: SensorData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: SensorData = { timestamp: 0 };
        
        headers.forEach((header, index) => {
          const value = values[index];
          if (header === 'timestamp') {
            row.timestamp = parseFloat(value) || 0;
          } else {
            row[header] = isNaN(parseFloat(value)) ? value : parseFloat(value);
          }
        });
        
        data.push(row);
      }
    }
    
    return data;
  };

  // Playback controls
  const togglePlayback = () => {
    if (isPlaying) {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
        playbackIntervalRef.current = null;
      }
      setIsPlaying(false);
    } else {
      playbackIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + (0.1 * playbackSpeed);
          if (newTime >= timeRange.end) {
            setIsPlaying(false);
            if (playbackIntervalRef.current) {
              clearInterval(playbackIntervalRef.current);
              playbackIntervalRef.current = null;
            }
            return timeRange.end;
          }
          return newTime;
        });
      }, 100);
      setIsPlaying(true);
    }
  };

  const seekTo = (time: number) => {
    setCurrentTime(Math.max(timeRange.start, Math.min(timeRange.end, time)));
  };

  // Labeling functions
  const addLabel = (startTime: number, endTime: number = startTime) => {
    if (!newLabelText.trim()) {
      showToast('warning', 'Missing Label', 'Please enter a label text');
      return;
    }

    const label: Label = {
      id: Date.now().toString(),
      startTime,
      endTime,
      text: newLabelText,
      category: newLabelCategory,
      color: getCategoryColor(newLabelCategory)
    };

    setLabels(prev => [...prev, label]);
    setNewLabelText('');
    showToast('success', 'Label Added', `Added label: ${newLabelText}`);
  };

  const removeLabel = (id: string) => {
    setLabels(prev => prev.filter(label => label.id !== id));
    if (selectedLabel?.id === id) {
      setSelectedLabel(null);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'event': return '#3B82F6';
      case 'anomaly': return '#EF4444';
      case 'milestone': return '#10B981';
      case 'note': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  // Timeline interaction
  const handleTimelineClick = (event: React.MouseEvent) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const timelineWidth = rect.width;
    const timeAtClick = timelineStart + (clickX / timelineWidth) * (timelineEnd - timelineStart);
    
    if (labelingMode === 'point') {
      addLabel(timeAtClick);
    } else if (labelingMode === 'range') {
      addLabel(timeAtClick, timeAtClick + 1);
    } else {
      seekTo(timeAtClick);
    }
  };

  // Export functions
  const exportLabels = (format: 'csv' | 'json') => {
    if (labels.length === 0) {
      showToast('warning', 'No Labels', 'No labels to export');
      return;
    }

    let content: string;
    let filename: string;

    if (format === 'csv') {
      const headers = ['id', 'startTime', 'endTime', 'text', 'category'];
      const rows = labels.map(label => [
        label.id,
        label.startTime,
        label.endTime,
        label.text,
        label.category
      ]);
      content = [headers, ...rows].map(row => row.join(',')).join('\n');
      filename = 'sensor_labels.csv';
    } else {
      content = JSON.stringify(labels, null, 2);
      filename = 'sensor_labels.json';
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('success', 'Export Complete', `Labels exported as ${filename}`);
  };

  // Robot movement calculation functions
  const calculateMovementDuration = (type: string, value: number): number => {
    switch (type) {
      case 'move':
        return Math.abs(value) / 200; // 1 second for 200 units
      case 'turn':
        return Math.abs(value) / 90; // 1 second for 90 degrees
      case 'wait':
        return value; // Same as value in seconds
      case 'grip':
        return 0.5; // 0.5 seconds for grip action
      default:
        return 1;
    }
  };

  const calculateNewPosition = (currentPos: RobotPosition, type: string, value: number): RobotPosition => {
    const angleRad = (currentPos.angle * Math.PI) / 180;
    
    switch (type) {
      case 'move':
        return {
          x: currentPos.x + value * Math.cos(angleRad),
          y: currentPos.y + value * Math.sin(angleRad),
          angle: currentPos.angle
        };
      case 'turn':
        return {
          x: currentPos.x,
          y: currentPos.y,
          angle: currentPos.angle + value
        };
      case 'wait':
      case 'grip':
        return currentPos; // No position change
      default:
        return currentPos;
    }
  };

  const generateRobotMovements = (labels: any[], connections: any[]): RobotMovement[] => {
    const movements: RobotMovement[] = [];
    let currentTime = 0;
    let currentPosition: RobotPosition = { x: 100, y: 100, angle: 0 };
    
    // Use the same duration calculation as in loadConfiguration
    const calculateDuration = (category: string, value: number): number => {
      switch (category) {
        case 'move':
          return Math.abs(value) / 200; // 1 second for 200 units
        case 'turn':
          return Math.abs(value) / 90; // 1 second for 90 degrees
        case 'wait':
          return value; // Same as value in seconds
        case 'grip':
          return 0.5; // 0.5 seconds for grip action
        default:
          return 1; // Default 1 second
      }
    };
    
    // Create a map of labels by ID for easy lookup
    const labelMap = new Map(labels.map(label => [label.id, label]));
    
    // Find starting label (label with no incoming connections)
    const incomingConnections = new Set(connections.map(conn => conn.to));
    const startingLabels = labels.filter(label => !incomingConnections.has(label.id));
    
    if (startingLabels.length === 0 && labels.length > 0) {
      // If no clear starting point, use the first label
      startingLabels.push(labels[0]);
    }
    
    const processedLabels = new Set<string>();
    const queue = [...startingLabels];
    
    while (queue.length > 0) {
      const currentLabel = queue.shift()!;
      
      if (processedLabels.has(currentLabel.id)) continue;
      processedLabels.add(currentLabel.id);
      
      // Extract value from the label (handle different field names)
      const value = currentLabel.value !== undefined ? Number(currentLabel.value) : 
                   currentLabel.val !== undefined ? Number(currentLabel.val) : 0;
      
      // Calculate movement for current label using the same logic as loadConfiguration
      const duration = calculateDuration(currentLabel.category, value);
      const newPosition = calculateNewPosition(currentPosition, currentLabel.category, value);
      
      const movement: RobotMovement = {
        id: currentLabel.id,
        type: currentLabel.category as 'move' | 'turn' | 'wait' | 'grip',
        value: value,
        duration,
        startTime: currentTime,
        endTime: currentTime + duration,
        fromPosition: { ...currentPosition },
        toPosition: newPosition
      };
      
      movements.push(movement);
      currentTime += duration;
      currentPosition = newPosition;
      
      // Find next labels through connections
      const nextConnections = connections.filter(conn => conn.from === currentLabel.id);
      for (const connection of nextConnections) {
        const nextLabel = labelMap.get(connection.to);
        if (nextLabel && !processedLabels.has(nextLabel.id)) {
          queue.push(nextLabel);
        }
      }
    }
    
    return movements;
  };

  const startRobotSimulation = () => {
    if (robotMovements.length === 0) {
      showToast('warning', 'No Movements', 'No robot movements to simulate');
      return;
    }
    
    setIsRobotSimulationPlaying(true);
    setRobotSimulationTime(0);
    setRobotPosition({ x: 100, y: 100, angle: 0 });
    
    const totalDuration = Math.max(...robotMovements.map(m => m.endTime));
    
    const interval = setInterval(() => {
      setRobotSimulationTime(prev => {
        const newTime = prev + (0.1 * robotSimulationSpeed);
        
        if (newTime >= totalDuration) {
          setIsRobotSimulationPlaying(false);
          clearInterval(interval);
          return totalDuration;
        }
        
        // Update robot position based on current time
        const currentMovement = robotMovements.find(m => 
          newTime >= m.startTime && newTime <= m.endTime
        );
        
        if (currentMovement) {
          const progress = (newTime - currentMovement.startTime) / currentMovement.duration;
          const currentPos = currentMovement.fromPosition;
          const targetPos = currentMovement.toPosition;
          
          const interpolatedPosition: RobotPosition = {
            x: currentPos.x + (targetPos.x - currentPos.x) * progress,
            y: currentPos.y + (targetPos.y - currentPos.y) * progress,
            angle: currentPos.angle + (targetPos.angle - currentPos.angle) * progress
          };
          
          setRobotPosition(interpolatedPosition);
        }
        
        return newTime;
      });
    }, 100);
  };

  const stopRobotSimulation = () => {
    setIsRobotSimulationPlaying(false);
    setRobotSimulationTime(0);
    setRobotPosition({ x: 100, y: 100, angle: 0 });
  };

  // Configuration loading
  const loadSavedConfigurations = async () => {
    setIsLoadingConfigurations(true);
    try {
      const response = await fetch('http://localhost:8000/api/sentra-core/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const configurations = await response.json();
      console.log('Loaded configurations:', configurations);
      
      // Map backend data to frontend format
      const validConfigurations = configurations.map((config: any) => ({
        id: config._id || config.id, // Handle both _id (MongoDB) and id fields
        name: config.name,
        description: config.description,
        created_at: config.created_at
      })).filter((config: any) => {
        if (!config.id) {
          console.warn('Configuration missing ID:', config);
          return false;
        }
        return true;
      });
      
      setSavedConfigurations(validConfigurations);
    } catch (error) {
      console.error('Error loading saved configurations:', error);
      showToast('error', 'Error', 'Failed to load configurations. Please try again.');
    } finally {
      setIsLoadingConfigurations(false);
    }
  };

  const loadConfiguration = async () => {
    if (!selectedConfigurationId) {
      showToast('error', 'Error', 'Please select a configuration to load');
      return;
    }

    setIsLoadingConfiguration(true);
    try {
      console.log('Loading configuration with ID:', selectedConfigurationId);
      const response = await fetch(`http://localhost:8000/api/sentra-core/${selectedConfigurationId}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      const configuration = await response.json();
      console.log('Loaded configuration:', configuration);
      
      // Debug: Log the first label to see its structure
      if (configuration.labels && configuration.labels.length > 0) {
        console.log('First label from backend:', configuration.labels[0]);
        console.log('Available fields in first label:', Object.keys(configuration.labels[0]));
      }
      
      // Calculate duration based on category and value
      const calculateDuration = (category: string, value: number): number => {
        switch (category) {
          case 'move':
            return Math.abs(value) / 200; // 1 second for 200 units
          case 'turn':
            return Math.abs(value) / 90; // 1 second for 90 degrees
          case 'wait':
            return value; // Same as value in seconds
          case 'grip':
            return 0.5; // 0.5 seconds for grip action
          default:
            return 1; // Default 1 second
        }
      };
      
      // Convert backend format to frontend format for sensor labels
      let currentTime = 0;
      const frontendLabels = configuration.labels.map((label: any) => {
        // Handle different possible field names for value
        const value = label.value !== undefined ? Number(label.value) : 
                     label.val !== undefined ? Number(label.val) : 0;
        
        const duration = calculateDuration(label.category || label.type || 'event', value);
        const startTime = currentTime;
        const endTime = startTime + duration;
        
        console.log(`Converting label ${label.id}: category=${label.category}, value=${value}, duration=${duration}, startTime=${startTime}, endTime=${endTime}`);
        
        // Update currentTime for next label
        currentTime = endTime;
        
        return {
          id: label.id,
          startTime: startTime,
          endTime: endTime,
          text: label.text || label.name || 'Unnamed Label',
          category: label.category || label.type || 'event',
          color: getCategoryColor(label.category || label.type || 'event')
        };
      });

      const frontendConnections = configuration.connections.map((connection: any) => ({
        id: connection.id,
        from: connection.from_id || connection.from, // Handle both field names
        to: connection.to_id || connection.to        // Handle both field names
      }));

      console.log('Converted frontend labels:', frontendLabels);

      // Update the state with loaded configuration
      setLabels(frontendLabels);
      setSelectedConfigurationName(configuration.name || 'Unknown Configuration');
      
      // Generate robot movements from the loaded configuration
      const movements = generateRobotMovements(frontendLabels, frontendConnections);
      setRobotMovements(movements);
      
      showToast('success', 'Success', 'Configuration loaded successfully!');
    } catch (error) {
      console.error('Error loading configuration:', error);
      showToast('error', 'Error', 'Error loading configuration. Please try again.');
    } finally {
      setIsLoadingConfiguration(false);
    }
  };

  const clearSelectedConfiguration = () => {
    setSelectedConfigurationName("");
    setLabels([]);
    setRobotMovements([]);
    setSelectedLabel(null);
  };

  useEffect(() => {
    loadSavedConfigurations();
  }, []);

  return (
    <section id="SensorGrid" className="pt-16 md:pt-20 lg:pt-28 relative">
      {/* Toast Notifications Container */}
      <div className="absolute top-4 right-4 z-[9999] space-y-2">
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
        <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28  min-h-[1200px]">
          <div className="-mx-4 flex flex-wrap items-top justify-between min-h-[1200px]">
            
            {/* Left Side - Sensor Data Upload, Timeline, and Labeling */}
            <div className="w-full px-4 py-4 lg:w-2/3 border border-body-color/[.15] dark:border-white/[.15] rounded-lg bg-gray-50 dark:bg-gray-900">
              <h3 className="text-xl font-bold text-body-color dark:text-white mb-4">Sensor Data Analysis</h3>
              
              {/* File Upload Section */}
              <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-lg text-white bg-blue-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17,8 12,3 7,8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="text-body-color dark:text-white font-semibold text-base block">Upload Sensor Data</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Upload LiDAR or IMU data (CSV/JSON)</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <input
                    type="file"
                    multiple
                    accept=".csv,.json"
                    onChange={handleFileUpload}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-body-color dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  
                  {sensorFiles.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium text-body-color dark:text-white">Loaded Files:</h5>
                      {sensorFiles.map(file => (
                        <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                          <span className="text-body-color dark:text-white">{file.name}</span>
                          <span className={`px-2 py-1 rounded text-xs text-white ${
                            file.type === 'lidar' ? 'bg-blue-500' : 'bg-green-500'
                          }`}>
                            {file.type.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline Controls */}
              <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-body-color dark:text-white">Timeline Controls</h4>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={togglePlayback}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                    </button>
                    <input
                      type="range"
                      min={timeRange.start}
                      max={timeRange.end}
                      value={currentTime}
                      onChange={(e) => seekTo(parseFloat(e.target.value))}
                      className="w-32"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {currentTime.toFixed(1)}s
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Speed:</label>
                    <select
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                      className="p-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={1}>1x</option>
                      <option value={2}>2x</option>
                      <option value={5}>5x</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Zoom:</label>
                    <input
                      type="range"
                      min={0.1}
                      max={5}
                      step={0.1}
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{zoom.toFixed(1)}x</span>
                  </div>
                </div>
              </div>

              {/* Timeline Visualization */}
              <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-body-color dark:text-white mb-3">Timeline</h4>
                
                <div
                  ref={timelineRef}
                  className="relative w-full h-32 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 cursor-pointer"
                  onClick={handleTimelineClick}
                >
                  {/* Time markers */}
                  <div className="absolute top-0 left-0 right-0 h-6 bg-gray-100 dark:bg-gray-600 border-b border-gray-300 dark:border-gray-500">
                    {Array.from({ length: 11 }, (_, i) => {
                      const time = timelineStart + (i / 10) * (timelineEnd - timelineStart);
                      return (
                        <div
                          key={i}
                          className="absolute top-1 text-xs text-gray-600 dark:text-gray-400"
                          style={{ left: `${(i / 10) * 100}%` }}
                        >
                          {time.toFixed(1)}s
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Playhead */}
                  <div
                    className="absolute top-6 w-0.5 h-full bg-red-500 z-10"
                    style={{
                      left: `${((currentTime - timelineStart) / (timelineEnd - timelineStart)) * 100}%`
                    }}
                  />
                  
                  {/* Labels */}
                  {labels.map(label => (
                    <div
                      key={label.id}
                      className="absolute top-8 h-4 bg-opacity-80 rounded cursor-pointer hover:bg-opacity-100 transition-opacity"
                      style={{
                        left: `${((label.startTime - timelineStart) / (timelineEnd - timelineStart)) * 100}%`,
                        width: `${((label.endTime - label.startTime) / (timelineEnd - timelineStart)) * 100}%`,
                        backgroundColor: label.color,
                        minWidth: '4px'
                      }}
                      onClick={() => setSelectedLabel(label)}
                      title={`${label.text} (${label.startTime.toFixed(1)}s - ${label.endTime.toFixed(1)}s)`}
                    />
                  ))}
                  
                  {/* Sensor data visualization placeholder */}
                  <div className="absolute top-16 left-0 right-0 h-16 bg-gray-100 dark:bg-gray-600 rounded">
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-sm">
                      {sensorFiles.length > 0 ? 'Sensor data visualization will appear here' : 'Upload sensor data to see visualization'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Labeling Tools */}
              <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-body-color dark:text-white mb-3">Labeling Tools</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600 dark:text-gray-400">Mode:</label>
                      <select
                        value={labelingMode}
                        onChange={(e) => setLabelingMode(e.target.value as 'point' | 'range' | 'none')}
                        className="p-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
                      >
                        <option value="none">None</option>
                        <option value="point">Point Label</option>
                        <option value="range">Range Label</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600 dark:text-gray-400">Category:</label>
                      <select
                        value={newLabelCategory}
                        onChange={(e) => setNewLabelCategory(e.target.value)}
                        className="p-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
                      >
                        <option value="event">Event</option>
                        <option value="anomaly">Anomaly</option>
                        <option value="milestone">Milestone</option>
                        <option value="note">Note</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Enter label text..."
                      value={newLabelText}
                      onChange={(e) => setNewLabelText(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded text-sm"
                    />
                    <button
                      onClick={() => addLabel(currentTime)}
                      className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                    >
                      Add Label
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => exportLabels('csv')}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      Export CSV
                    </button>
                    <button
                      onClick={() => exportLabels('json')}
                      className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 transition-colors"
                    >
                      Export JSON
                    </button>
                  </div>
                </div>
              </div>
              <div className='mb-4 p-4 bg-white dark:bg-gray-800 runded-lg shadow-sm'>
                <h4 className="text-lg font-semibold text-body-color dark:text-white mb-3">Labes Information</h4>
                <div className='justify-between flex'>
                  {/* Labels List */}
                  {labels.length > 0 && (
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm w-1/2">
                      <h4 className="text-lg font-semibold text-body-color dark:text-white mb-3">Labels ({labels.length})</h4>
                      
                      <div className="max-h-80 overflow-y-auto space-y-2">
                        {labels.map(label => (
                          <div
                            key={label.id}
                            className={`flex items-center justify-between p-2 rounded text-sm cursor-pointer transition-colors ${
                              selectedLabel?.id === label.id
                                ? 'bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700'
                                : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                            onClick={() => setSelectedLabel(label)}
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: label.color }}
                              />
                              <span className="text-body-color dark:text-white">{label.text}</span>
                              <span className="text-gray-500 dark:text-gray-400 text-xs">
                                {label.startTime.toFixed(1)}s - {label.endTime.toFixed(1)}s
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeLabel(label.id);
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Selected Label Details */}
                  {selectedLabel && (
                    <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 w-1/2">
                      <h4 className="text-lg font-semibold text-body-color dark:text-white mb-3">Selected Label</h4>
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Text:</span>
                          <p className="text-body-color dark:text-white">{selectedLabel.text}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Category:</span>
                          <p className="text-body-color dark:text-white">{selectedLabel.category}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Time Range:</span>
                          <p className="text-body-color dark:text-white">
                            {selectedLabel.startTime.toFixed(1)}s - {selectedLabel.endTime.toFixed(1)}s
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Duration:</span>
                          <p className="text-body-color dark:text-white">
                            {(selectedLabel.endTime - selectedLabel.startTime).toFixed(1)}s
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Configuration and Graph Display */}
            <div className="w-full px-4 py-4 lg:w-1/3 border border-body-color/[.15] dark:border-white/[.15] rounded-lg bg-gray-50 dark:bg-gray-900">
              <h3 className="text-xl font-bold text-body-color dark:text-white mb-4">Configuration & Analysis</h3>
              
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
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Load analysis configuration</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <select
                    value={selectedConfigurationId}
                    onChange={(e) => setSelectedConfigurationId(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-body-color dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isLoadingConfigurations}
                  >
                    <option value="">Select a configuration...</option>
                    {savedConfigurations.map((config, index) => (
                      <option key={config.id || `config-${index}`} value={config.id || ""}>
                        {config.name}
                      </option>
                    ))}
                  </select>
                  
                  <button
                    onClick={loadSavedConfigurations}
                    disabled={isLoadingConfigurations}
                    className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm flex items-center justify-center space-x-2"
                  >
                    {isLoadingConfigurations ? (
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
                          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                          <path d="M21 3v5h-5" />
                        </svg>
                        <span>Refresh Configurations</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={loadConfiguration}
                    disabled={!selectedConfigurationId || isLoadingConfiguration}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center justify-center space-x-2"
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
                  
                  {selectedConfigurationName && (
                    <button
                      onClick={clearSelectedConfiguration}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center justify-center space-x-2"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      <span>Clear Configuration</span>
                    </button>
                  )}
                  
                  {savedConfigurations.length === 0 && !isLoadingConfigurations && (
                    <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-2">
                      No saved configurations found
                    </div>
                  )}
                </div>
              </div>

              {/* Graph Display Area */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-body-color dark:text-white mb-3">
                  Analysis Graph
                  {selectedConfigurationName && (
                    <span className="ml-2 text-sm font-normal text-blue-600 dark:text-blue-400">
                      - {selectedConfigurationName}
                    </span>
                  )}
                </h4>
                
                <div className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-sm">
                      {selectedConfigurationName 
                        ? `Configuration "${selectedConfigurationName}" loaded` 
                        : 'Graph visualization will appear here'
                      }
                    </p>
                    <p className="text-xs mt-1">
                      {selectedConfigurationName 
                        ? `${labels.length} labels loaded` 
                        : 'Load configuration to see analysis results'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Robot Movement Simulation */}
              <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-body-color dark:text-white mb-3">Robot Movement Simulation</h4>
                
                <div className="space-y-3">
                  {/* Robot Visualization Canvas */}
                  <div className="relative w-full h-64 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 overflow-hidden">
                    {/* Grid lines */}
                    <div className="absolute inset-0 opacity-20">
                      {Array.from({ length: 20 }, (_, i) => (
                        <div key={`v-${i}`} className="absolute top-0 bottom-0 border-l border-gray-400" style={{ left: `${i * 5}%` }} />
                      ))}
                      {Array.from({ length: 20 }, (_, i) => (
                        <div key={`h-${i}`} className="absolute left-0 right-0 border-t border-gray-400" style={{ top: `${i * 5}%` }} />
                      ))}
                    </div>
                    
                    {/* Robot */}
                    <div
                      className="absolute w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg transform transition-all duration-100 ease-out"
                      style={{
                        left: `${robotPosition.x}px`,
                        top: `${robotPosition.y}px`,
                        transform: `translate(-50%, -50%) rotate(${robotPosition.angle}deg)`
                      }}
                    >
                      {/* Robot direction indicator */}
                      <div className="absolute top-1/2 left-1/2 w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    
                    {/* Movement path */}
                    {robotMovements.map((movement, index) => (
                      <div
                        key={movement.id}
                        className="absolute w-1 h-1 bg-green-400 rounded-full"
                        style={{
                          left: `${movement.fromPosition.x}px`,
                          top: `${movement.fromPosition.y}px`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    ))}
                    
                    {/* Current movement indicator */}
                    {robotSimulationTime > 0 && (
                      <div className="absolute text-xs text-gray-600 dark:text-gray-400 bottom-2 left-2">
                        Time: {robotSimulationTime.toFixed(1)}s
                      </div>
                    )}
                  </div>
                  
                  {/* Simulation Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={isRobotSimulationPlaying ? stopRobotSimulation : startRobotSimulation}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          isRobotSimulationPlaying 
                            ? 'bg-red-500 hover:bg-red-600 text-white' 
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {isRobotSimulationPlaying ? '⏹️ Stop' : '▶️ Start'}
                      </button>
                      
                      <select
                        value={robotSimulationSpeed}
                        onChange={(e) => setRobotSimulationSpeed(parseFloat(e.target.value))}
                        className="p-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
                      >
                        <option value={0.5}>0.5x</option>
                        <option value={1}>1x</option>
                        <option value={2}>2x</option>
                        <option value={5}>5x</option>
                      </select>
                    </div>
                    
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {robotMovements.length > 0 && (
                        <span>Total: {robotMovements.length} movements</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Movement List */}
                  {robotMovements.length > 0 && (
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      <h5 className="text-sm font-medium text-body-color dark:text-white">Movement Sequence:</h5>
                      {robotMovements.map((movement, index) => (
                        <div key={movement.id} className="flex items-center justify-between p-1 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                          <span className="text-body-color dark:text-white">
                            {index + 1}. {movement.type} ({movement.value})
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {movement.duration.toFixed(1)}s
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SensorGridSectionOne; 