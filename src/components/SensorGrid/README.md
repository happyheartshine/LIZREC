# SensorGrid Component

A comprehensive sensor data analysis and labeling tool for LiDAR and IMU data.

## Features

### 🚀 Core Functionality

- **Sensor Data Upload**: Support for CSV and JSON format sensor logs
- **Timeline Visualization**: Interactive timeline with playhead control
- **Manual Labeling**: Point and range labeling with categories
- **Data Export**: Export labeled data in CSV or JSON format
- **Configuration Management**: Load and manage analysis configurations

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
2. Select CSV or JSON files containing sensor data
3. Files are automatically parsed and displayed
4. Timeline range is updated based on data timestamps

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
    "x": 1.234,
    "y": 2.345,
    "z": 3.456,
    "intensity": 128,
    "range": 4.567
  }
]
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
- `sample_imu_data.csv`: Example IMU sensor data

## Technical Details

- Built with React and TypeScript
- Uses Tailwind CSS for styling
- Responsive design with mobile support
- File parsing handles various CSV and JSON formats
- Timeline rendering with SVG for smooth interactions
- Export functionality with proper file handling

## Future Enhancements

- Real-time sensor data streaming
- Advanced visualization options (3D plots, heatmaps)
- Machine learning integration for automated labeling
- Cloud storage integration
- Collaborative labeling features
- Advanced filtering and search capabilities 