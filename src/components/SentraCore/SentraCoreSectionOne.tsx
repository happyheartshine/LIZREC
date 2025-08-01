"use client";

import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";
import { useState, useRef, useEffect } from "react";

const checkIcon = (
  <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
    <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
  </svg>
);

// Icon components for the mini buttons
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const ConnectIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const MoveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L12 22" />
    <path d="M5 9L12 2L19 9" />
    <path d="M5 15L12 22L19 15" />
  </svg>
);

const TurnIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" />
    <path d="M12 7V12L15 15" />
  </svg>
);

const GripIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" />
    <path d="M8 18V20C8 21.1046 8.89543 22 10 22H14C15.1046 22 16 21.1046 16 20V18" />
    <path d="M8 6H16V18H8V6Z" />
    <path d="M10 10H14" />
    <path d="M10 14H14" />
  </svg>
);

const WaitIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title: string;
}

const SentraCoreSectionOne = () => {
  const [selectedOption, setSelectedOption] = useState("option1");
  const [labels, setLabels] = useState<Array<{ id: string; text: string; value: string; x: number; y: number; category: string }>>([]);
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [connectionMode, setConnectionMode] = useState<string | null>(null);
  const [connections, setConnections] = useState<Array<{ id: string; from: string; to: string }>>([]);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [moveMode, setMoveMode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // New state for saved configurations
  const [savedConfigurations, setSavedConfigurations] = useState<Array<{ id: string; name: string; description: string; created_at: string }>>([]);
  const [selectedConfigurationId, setSelectedConfigurationId] = useState<string>("");
  const [isLoadingConfigurations, setIsLoadingConfigurations] = useState(false);
  const [isLoadingConfiguration, setIsLoadingConfiguration] = useState(false);
  const [currentLoadedConfigurationId, setCurrentLoadedConfigurationId] = useState<string | null>(null);

  // New state for tab system
  const [activeTab, setActiveTab] = useState<"logic-blocks" | "others">("logic-blocks");

  // State for toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setContainerDimensions({ width: rect.width, height: rect.height });
        }
      };
      
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);

  // Load saved configurations on component mount
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

  const loadSavedConfigurations = async () => {
    setIsLoadingConfigurations(true);
    try {
      const response = await fetch('/api/sentra-core/');
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
      const response = await fetch(`/api/sentra-core/${selectedConfigurationId}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      const configuration = await response.json();
      console.log('Loaded configuration:', configuration);
      
      // Convert backend format to frontend format
      const frontendLabels = configuration.labels.map((label: any) => ({
        id: label.id,
        text: label.text,
        value: label.value,
        x: label.x,
        y: label.y,
        category: label.category
      }));

      const frontendConnections = configuration.connections.map((connection: any) => ({
        id: connection.id,
        from: connection.from_id || connection.from, // Handle both field names
        to: connection.to_id || connection.to        // Handle both field names
      }));

      // Update the state with loaded configuration
      setLabels(frontendLabels);
      setConnections(frontendConnections);
      setSelectedOption(configuration.selected_option || "option1");
      
      // Reset other states
      setSelectedLabelId(null);
      setEditingLabelId(null);
      setConnectionMode(null);
      setMoveMode(null);
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
      setEditValue("");
      setCurrentLoadedConfigurationId(selectedConfigurationId); // Set the current loaded ID

      showToast('success', 'Success', 'Configuration loaded successfully!');
    } catch (error) {
      console.error('Error loading configuration:', error);
      showToast('error', 'Error', 'Error loading configuration. Please try again.');
    } finally {
      setIsLoadingConfiguration(false);
    }
  };

  const actionCategories = [
    {
      id: "move",
      label: "Move",
      description: "Move robot forward/backward",
      icon: <MoveIcon />,
      iconBg: "bg-blue-500",
      labels: [
        { id: "move-forward", label: "Forward", value: "move-forward" },
        { id: "move-backward", label: "Backward", value: "move-backward" },
      ]
    },
    {
      id: "turn",
      label: "Turn",
      description: "Turn robot left/right",
      icon: <TurnIcon />,
      iconBg: "bg-teal-500",
      labels: [
        { id: "turn-left", label: "Left", value: "turn-left" },
        { id: "turn-right", label: "Right", value: "turn-right" },
      ]
    },
    {
      id: "grip",
      label: "Grip",
      description: "Grip or release objects",
      icon: <GripIcon />,
      iconBg: "bg-purple-500",
      labels: [
        { id: "grip", label: "Grip", value: "grip" },
        { id: "release", label: "Release", value: "release" },
      ]
    },
    {
      id: "wait",
      label: "Wait",
      description: "Wait for specified time",
      icon: <WaitIcon />,
      iconBg: "bg-orange-500",
      labels: [
        { id: "wait", label: "Wait", value: "wait" },
      ]
    }
  ];

  const handleRadioChange = (value: string) => {
    setSelectedOption(value);
  };

  const handleRightSectionClick = (event: React.MouseEvent) => {
    // Close any open label actions when clicking elsewhere
    setSelectedLabelId(null);
    setConnectionMode(null);
    
    // Get the click position relative to the inner container where labels are positioned
    const innerContainer = event.currentTarget.querySelector('.relative') as HTMLElement;
    if (!innerContainer) return;
    
    const rect = innerContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const selectedCategory = actionCategories.find(option => option.labels.some(l => l.value === selectedOption));
    const selectedLabel = selectedCategory?.labels.find(l => l.value === selectedOption)?.label || selectedOption;
    
    // Set default values based on category
    let defaultValue = "";
    if (selectedCategory?.id === "move") {
      defaultValue = "100"; // Distance in cm
    } else if (selectedCategory?.id === "turn") {
      defaultValue = "90"; // Angle in degrees
    } else if (selectedCategory?.id === "wait") {
      defaultValue = "2"; // Time in seconds
    } else if (selectedCategory?.id === "grip") {
      defaultValue = "50"; // Grip strength percentage
    }
    
    const newLabel = {
      id: Date.now().toString(),
      text: selectedLabel,
      value: defaultValue,
      x: x,
      y: y,
      category: selectedCategory?.id || "other"
    };
    console.log("New label created:", newLabel);
    setLabels(prev => [...prev, newLabel]);
  };

  const handleLabelClick = (labelId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the click from bubbling up to the container
    setSelectedLabelId(selectedLabelId === labelId ? null : labelId);
  };

  const handleEditLabel = (labelId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const label = labels.find(l => l.id === labelId);
    if (label) {
      setEditingLabelId(labelId);
      setEditValue(label.value);
      setSelectedLabelId(null); // Close the mini buttons
    }
  };

  const handleSaveEdit = (labelId: string) => {
    setLabels(prev => prev.map(label => 
      label.id === labelId 
        ? { ...label, value: editValue }
        : label
    ));
    setEditingLabelId(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingLabelId(null);
    setEditValue("");
  };

  const handleKeyPress = (event: React.KeyboardEvent, labelId: string) => {
    if (event.key === 'Enter') {
      handleSaveEdit(labelId);
    } else if (event.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleInit = () => {
    // Format/initialize the workspace
    setLabels([]);
    setConnections([]);
    setSelectedLabelId(null);
    setEditingLabelId(null);
    setConnectionMode(null);
    setMoveMode(null);
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setEditValue("");
    setCurrentLoadedConfigurationId(null);
  };

  const handleSave = async () => {
    // Save the current state to backend
    try {
      // Convert connections to backend format (use from_id/to_id instead of from/to)
      const backendConnections = connections.map(connection => ({
        id: connection.id,
        from_id: connection.from,
        to_id: connection.to
      }));

      const currentState = {
        name: `SentraCore Configuration ${new Date().toLocaleString()}`,
        description: "Robot movement and action sequence",
        labels: labels,
        connections: backendConnections,
        selected_option: selectedOption
      };
      
      console.log('Saving current state:', currentState);
      
      let response;
      let isUpdate = false;
      
      if (currentLoadedConfigurationId) {
        // Update existing configuration
        isUpdate = true;
        response = await fetch(`/api/sentra-core/${currentLoadedConfigurationId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentState)
        });
      } else {
        // Create new configuration
        response = await fetch('/api/sentra-core/save-state/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentState)
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('Saved successfully:', result);
      
      const message = isUpdate ? 'Configuration updated successfully!' : 'Configuration saved successfully!';
      showToast('success', 'Success', message);
      
      // If this was a new save, update the current loaded configuration ID
      if (!isUpdate && result.id) {
        setCurrentLoadedConfigurationId(result.id);
      }
      
      // Refresh the saved configurations list
      await loadSavedConfigurations();
      
    } catch (error) {
      console.error('Error saving configuration:', error);
      const message = currentLoadedConfigurationId ? 'Error updating configuration.' : 'Error saving configuration.';
      showToast('error', 'Error', `${message} Please try again.`);
    }
  };

  const handleExportJSON = () => {
    const exportData = {
      labels: labels,
      connections: connections,
      selected_option: selectedOption,
      exported_at: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sentra-core-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    // Create CSV content for labels
    const labelsCSV = labels.map(label => 
      `${label.id},${label.text},${label.value},${label.x},${label.y},${label.category}`
    ).join('\n');
    
    const csvContent = `ID,Text,Value,X,Y,Category\n${labelsCSV}`;
    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sentra-core-labels-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportYAML = () => {
    // Create YAML content
    const yamlContent = `# SentraCore Configuration
# Exported on: ${new Date().toISOString()}

configuration:
  selected_option: "${selectedOption}"
  exported_at: "${new Date().toISOString()}"

labels:
${labels.map(label => `  - id: "${label.id}"
    text: "${label.text}"
    value: "${label.value}"
    x: ${label.x}
    y: ${label.y}
    category: "${label.category}"`).join('\n')}

connections:
${connections.map(connection => `  - id: "${connection.id}"
    from: "${connection.from}"
    to: "${connection.to}"`).join('\n')}

# End of configuration`;

    const dataBlob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sentra-core-config-${new Date().toISOString().split('T')[0]}.yaml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteLabel = (labelId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // Delete the label
    setLabels(prev => prev.filter(label => label.id !== labelId));
    // Delete all connections to/from this label
    setConnections(prev => prev.filter(connection => 
      connection.from !== labelId && connection.to !== labelId
    ));
    setSelectedLabelId(null);
  };

  const handleConnectLabel = (labelId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setConnectionMode(labelId);
    setSelectedLabelId(null); // Close the mini buttons
  };

  const handleMoveLabel = (labelId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setMoveMode(labelId);
    setSelectedLabelId(null); // Close the mini buttons
  };

  const handleMouseDown = (labelId: string, event: React.MouseEvent) => {
    if (moveMode === labelId) {
      event.stopPropagation();
      setIsDragging(true);
      const label = labels.find(l => l.id === labelId);
      if (label) {
        const rect = event.currentTarget.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        setDragOffset({ x: offsetX, y: offsetY });
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging && moveMode) {
      event.preventDefault();
      const innerContainer = event.currentTarget.querySelector('.relative') as HTMLElement;
      if (!innerContainer) return;
      
      const rect = innerContainer.getBoundingClientRect();
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
    if (isDragging) {
      setIsDragging(false);
      setMoveMode(null);
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleLabelClickForConnection = (labelId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (connectionMode && connectionMode !== labelId) {
      // Create a new connection
      const newConnection = {
        id: `${connectionMode}-${labelId}`,
        from: connectionMode,
        to: labelId
      };
      
      // Check if connection already exists
      const connectionExists = connections.some(
        conn => (conn.from === connectionMode && conn.to === labelId) ||
                (conn.from === labelId && conn.to === connectionMode)
      );
      
      if (!connectionExists) {
        setConnections(prev => [...prev, newConnection]);
      }
      
      setConnectionMode(null);
    } else if (!connectionMode) {
      // Normal label selection
      setSelectedLabelId(selectedLabelId === labelId ? null : labelId);
    }
  };

  const isConnected = (labelId1: string, labelId2: string) => {
    return connections.some(
      conn => (conn.from === labelId1 && conn.to === labelId2) ||
              (conn.from === labelId2 && conn.to === labelId1)
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "move":
        return "bg-blue-500";
      case "turn":
        return "bg-teal-500";
      case "grip":
        return "bg-purple-500";
      case "wait":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryHoverColor = (category: string) => {
    switch (category) {
      case "move":
        return "hover:bg-blue-600";
      case "turn":
        return "hover:bg-teal-600";
      case "grip":
        return "hover:bg-purple-600";
      case "wait":
        return "hover:bg-orange-600";
      default:
        return "hover:bg-gray-600";
    }
  };

  const renderConnectionLine = (fromLabel: any, toLabel: any, connectionId: string) => {
    const fromX = fromLabel.x ;
    const fromY = fromLabel.y;
    const toX = toLabel.x ;
    const toY = toLabel.y;
    
    // Path: vertical first, then horizontal
    return (
      <svg
        key={connectionId}
        className="absolute pointer-events-none"
        style={{
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        }}
        viewBox={`0 0 ${containerDimensions.width} ${containerDimensions.height}`}
        preserveAspectRatio="none"
      >
        <path
          d={`M ${fromX} ${fromY} L ${fromX} ${toY} L ${toX} ${toY}`}
          stroke="#3B82F6"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
        />
      </svg>
    );
  };


  return (
    <section id="SentraCore" className="pt-16 md:pt-20 lg:pt-28 relative">
      {/* Toast Notifications Container */}
      <div className="absolute top-4 right-4 z-[9999] space-y-2">
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          return (
            <div
              key={toast.id}
              className={`${styles.bg} ${styles.border} border rounded-lg p-4 shadow-lg max-w-sm transform transition-all duration-300 ease-in-out`}
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
          <div className="-mx-4 flex flex-wrap items-top justify-between ">
            <div className="w-full px-4 py-4 lg:w-1/4 border border-body-color/[.15] dark:border-white/[.15] rounded-lg max-h-[800px] from-gray-50 to-white dark:from-gray-900 to-gray-800 shadow-lg" id="sentra-core-section-one-left">

              {/* Tab System */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setActiveTab("logic-blocks")}
                  className={`px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                    activeTab === "logic-blocks"
                      ? "bg-primary text-white border-primary shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-primary/50 dark:hover:border-primary/50"
                  }`}
                >
                  Logic Blocks
                </button>
                <button
                  onClick={() => setActiveTab("others")}
                  className={`px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                    activeTab === "others"
                      ? "bg-primary text-white border-primary shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-primary/50 dark:hover:border-primary/50"
                  }`}
                >
                  Others
                </button>
              </div>

              {/* Logic Blocks Section */}
              {activeTab === "logic-blocks" && (
                <div className="space-y-4">
                  {actionCategories.map((category) => (
                    <div key={category.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`p-2 rounded-lg text-white ${category.iconBg}`}>
                          {category.icon}
                        </div>
                        <div className="flex-1">
                          <span className="text-body-color dark:text-white font-semibold text-base block">{category.label}</span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">{category.description}</span>
                        </div>
                      </div>
                      <div className={`${category.labels.length > 1 ? 'flex space-x-2' : 'space-y-1'}`}>
                        {category.labels.map((label) => (
                          <button
                            key={label.id}
                            onClick={() => handleRadioChange(label.value)}
                            className={`flex items-center justify-center space-x-2 cursor-pointer p-2 rounded-lg transition-all duration-200 border-2 ${
                              selectedOption === label.value
                                ? 'bg-primary text-white border-primary shadow-lg transform scale-105'
                                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-primary/50 dark:hover:border-primary/50'
                            }`}
                          >
                            <span className={`text-sm font-medium ${
                              selectedOption === label.value
                                ? 'text-white'
                                : 'text-body-color dark:text-white'
                            }`}>
                              {label.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {/* Status Indicator */}
                    {currentLoadedConfigurationId && (
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600 dark:text-blue-400">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7,10 12,15 17,10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                            Editing loaded configuration
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={handleInit}
                      className="w-full px-4 py-2 border cursor-pointer from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-gray-600 dark:text-gray-400 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 text-sm"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 12a9 9 0 1 1 9 9 9.75 9.75 0 0 1-9.75-9.75" />
                          <path d="M21 3v5h-5" />
                        </svg>
                        <span>Initialize</span>
                      </div>
                    </button>
                    <button
                      onClick={handleSave}
                      className={`w-full px-4 py-2 cursor-pointer border font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 text-sm ${
                        currentLoadedConfigurationId 
                          ? 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white' 
                          : 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                          <polyline points="17,21 17,13 7,13 7,21" />
                          <polyline points="7,3 7,8 15,8" />
                        </svg>
                        <span>{currentLoadedConfigurationId ? 'Update' : 'Save'}</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Others Section */}
              {activeTab === "others" && (
                <div className="space-y-4">
                  {/* Load Configuration */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
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
                        className="p-2 text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
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
                        className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm flex items-center justify-center space-x-2"
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

                  {/* Export JSON */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 rounded-lg text-white bg-green-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7,10 12,15 17,10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <span className="text-body-color dark:text-white font-semibold text-base block">Export JSON</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Export current configuration as JSON file</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleExportJSON}
                      className="w-full px-4 py-2 cursor-pointer border hover:bg-green-800  text-gray-600 dark:text-gray-400 hover:text-gray-400 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 text-sm flex items-center justify-center space-x-2"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7,10 12,15 17,10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <span>Export JSON</span>
                    </button>
                  </div>

                  {/* Export CSV */}
                  <div className=" dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 rounded-lg text-white bg-orange-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14,2 14,8 20,8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10,9 9,9 8,9" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <span className="text-body-color dark:text-white font-semibold text-base block">Export CSV</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Export labels data as CSV file</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleExportCSV}
                      className="w-full px-4 py-2 border cursor-pointer hover:bg-orange-600  text-gray-600 dark:text-gray-400 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 text-sm flex items-center justify-center space-x-2"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10,9 9,9 8,9" />
                      </svg>
                      <span>Export CSV</span>
                    </button>
                  </div>

                  {/* Export YAML */}
                  <div className=" dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 rounded-lg text-white bg-purple-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14,2 14,8 20,8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10,9 9,9 8,9" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <span className="text-body-color dark:text-white font-semibold text-base block">Export YAML</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Export current configuration as YAML file</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleExportYAML}
                      className="w-full px-4 py-2 border cursor-pointer hover:bg-purple-600  text-gray-600 dark:text-gray-400 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 text-sm flex items-center justify-center space-x-2"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10,9 9,9 8,9" />
                      </svg>
                      <span>Export YAML</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div 
              className="w-full px-4 lg:w-2/3 border border-body-color/[.15] dark:border-white/[.15] relative cursor-crosshair dark:bg-gray-dark  max-h-[800px]" 
              id="sentra-core-section-one-right"
              onClick={handleRightSectionClick}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <div 
                ref={containerRef}
                className="relative mx-auto aspect-25/24 max-w-[100%] lg:mr-0 min-h-[300px]"
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
                
                {labels.map((label) => (
                  <div key={label.id} className="relative">
                    {editingLabelId === label.id ? (
                      // Edit mode - show input field
                      <div
                        className="absolute bg-white dark:bg-gray-800 border-2 border-primary rounded-md shadow-lg min-w-[80px]"
                        style={{
                          left: label.x,
                          top: label.y,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        {/* Header - read only */}
                        <div className="px-2 py-0.5 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                          <div className="text-xs font-semibold text-gray-900 dark:text-white text-center">
                            {label.text}
                          </div>
                        </div>
                        {/* Body input - editable */}
                        <div className="px-2 py-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => handleKeyPress(e, label.id)}
                            onBlur={() => handleSaveEdit(label.id)}
                            className="w-full text-xs bg-transparent border-none outline-none text-gray-900 dark:text-white text-center"
                            placeholder="Value"
                            autoFocus
                          />
                        </div>
                      </div>
                    ) : (
                      // Normal mode - show label
                      <div
                        className={`absolute rounded-md text-xs font-medium shadow-lg transition-colors min-w-[80px] ${
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
                        }}
                        onClick={(event) => handleLabelClickForConnection(label.id, event)}
                        onMouseDown={(event) => handleMouseDown(label.id, event)}
                      >
                        {/* Header */}
                        <div className="px-2 py-0.5 border-b border-white/20 font-semibold text-center text-xs">
                          {label.text}
                        </div>
                        {/* Body */}
                        <div className="px-2 py-1 text-center text-xs">
                          {label.value}
                        </div>
                      </div>
                    )}
                    
                    {/* Mini action buttons */}
                    {selectedLabelId === label.id && (
                      <div
                        className="absolute flex space-x-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-1"
                        style={{
                          left: label.x,
                          top: label.y - 40,
                          transform: 'translateX(-50%)',
                        }}
                      >
                        <button
                          onClick={(event) => handleEditLabel(label.id, event)}
                          className="w-6 h-6 flex items-center justify-center text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={(event) => handleDeleteLabel(label.id, event)}
                          className="w-6 h-6 flex items-center justify-center text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Delete"
                        >
                          <DeleteIcon />
                        </button>
                        <button
                          onClick={(event) => handleConnectLabel(label.id, event)}
                          className="w-6 h-6 flex items-center justify-center text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                          title="Connect"
                        >
                          <ConnectIcon />
                        </button>
                        <button
                          onClick={(event) => handleMoveLabel(label.id, event)}
                          className="w-6 h-6 flex items-center justify-center text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded transition-colors"
                          title="Move"
                        >
                          <MoveIcon />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SentraCoreSectionOne;

