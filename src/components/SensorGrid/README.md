# SensorGrid Component

A comprehensive sensor data analysis and labeling tool for LiDAR and IMU data.

## Features

### 🚀 Core Functionality

- **Sensor Data Upload**: Support for CSV, JSON, and YAML format sensor logs
- **Interactive Graph Visualization**: Real-time charts with multiple chart types
- **Timeline Visualization**: Interactive timeline with playhead control
- **Manual Labeling**: Point and range labeling with categories
- **Data Export**: Export labeled data in CSV or JSON format
- **Configuration Management**: Load and manage analysis configurations

### 📊 Graph Visualization

- **Multiple Chart Types**: Line charts, bar charts, and scatter plots
- **Dynamic Data Selection**: Choose which sensor fields to visualize
- **Real-time Updates**: Charts update automatically when data is loaded
- **Interactive Controls**: Zoom, pan, and hover tooltips
- **Multi-field Support**: Display multiple sensor readings simultaneously
- **Time-based X-axis**: Automatic timestamp formatting

### 📊 Timeline Controls

- **Playback Controls**: Play, pause, and seek through sensor data
- **Speed Control**: Adjust playback speed (0.5x to 5x)
- **Zoom Control**: Zoom in/out on timeline (0.1x to 5x)
- **Interactive Timeline**: Click to seek to specific timestamps

### 🏷️ Labeling System

- **Label Categories**: Event, Anomaly, Milestone, Note
- **Labeling Modes**: 
  - Point Label: Mark specific moments
  - Range Label: Mark time ranges
  - None: Disable labeling for navigation only
- **Visual Labels**: Color-coded labels on timeline
- **Label Management**: Add, remove, and select labels

### 📁 File Support

- **CSV Format**: Standard comma-separated values
- **JSON Format**: Structured JSON data
- **YAML Format**: YAML configuration files
- **Sensor Types**: LiDAR and IMU data detection
- **Multiple Files**: Upload and manage multiple sensor files

### 🎨 User Interface

- **Two-Column Layout**: 
  - Left: Sensor data and labeling tools
  - Right: Configuration and analysis graphs
- **Dark Mode Support**: Full dark/light theme compatibility
- **Responsive Design**: Works on desktop and mobile devices
- **Toast Notifications**: User feedback for actions

## Usage

### Uploading Sensor Data

1. Click the file upload area
2. Select CSV, JSON, or YAML files containing sensor data
3. Files are automatically parsed and displayed
4. Timeline range is updated based on data timestamps
5. Graph visualization appears automatically

### Graph Visualization

1. **Chart Type Selection**: Choose between Line, Bar, or Scatter charts
2. **Data Field Selection**: Select which sensor fields to display
3. **Interactive Features**: 
   - Hover over data points for detailed information
   - Zoom and pan on charts
   - Legend toggles for individual data series
4. **Real-time Updates**: Charts update when new data is loaded

### Labeling Data

1. Select labeling mode (Point or Range)
2. Choose a category for the label
3. Enter label text
4. Click on timeline or use "Add Label" button
5. Labels appear on timeline with color coding

### Timeline Navigation

1. Use play/pause button to control playback
2. Drag the timeline slider to seek
3. Adjust playback speed as needed
4. Use zoom controls to focus on specific time ranges

### Exporting Data

1. Create labels on the timeline
2. Click "Export CSV" or "Export JSON"
3. File is automatically downloaded
4. Contains all label information with timestamps

## Data Format

### CSV Format Example

```csv
timestamp,x,y,z,intensity,range
0.0,1.234,2.345,3.456,128,4.567
0.1,1.245,2.356,3.467,130,4.578
```

### JSON Format Example

```json
[
  {
    "timestamp": 0.0,
    "accel_x": 0.123,
    "accel_y": 0.234,
    "accel_z": 9.81,
    "gyro_x": 0.001,
    "gyro_y": 0.002,
    "gyro_z": 0.003
  }
]
```

### YAML Format Example

```yaml
- timestamp: 0.0
  temperature: 25.5
  humidity: 45.2
  pressure: 1013.25
  voltage: 12.1
  current: 2.3
  power: 27.83

- timestamp: 0.1
  temperature: 25.6
  humidity: 45.3
  pressure: 1013.26
  voltage: 12.2
  current: 2.4
  power: 29.28
```

## Configuration

The right panel allows loading analysis configurations that can be used to:
- Apply predefined analysis parameters
- Load saved labeling schemes
- Configure visualization settings
- Set up automated detection rules

## Sample Data

Sample files are provided in the `public` directory:
- `sample_lidar_data.csv`: Example LiDAR point cloud data
- `sample_imu_data.json`: Example IMU sensor data
- `sample_sensor_data.yaml`: Example YAML sensor data

## Technical Details

- Built with React and TypeScript
- Uses Recharts for graph visualization
- Uses js-yaml for YAML parsing
- Uses Tailwind CSS for styling
- Responsive design with mobile support
- File parsing handles various CSV, JSON, and YAML formats
- Timeline rendering with SVG for smooth interactions
- Export functionality with proper file handling

## Dependencies

- `recharts`: Chart visualization library
- `js-yaml`: YAML parsing library
- `@types/js-yaml`: TypeScript definitions for js-yaml

## Future Enhancements

- Real-time sensor data streaming
- Advanced visualization options (3D plots, heatmaps)
- Machine learning integration for automated labeling
- Cloud storage integration
- Collaborative labeling features
- Advanced filtering and search capabilities
- Custom chart configurations
- Data preprocessing and filtering
- Statistical analysis tools 