import fs from 'fs';
import path from 'path';

export interface SentraCoreConfiguration {
  id: string;
  name: string;
  description: string;
  labels: any[];
  connections: any[];
  selected_option: string;
  created_at: string;
  updated_at: string;
}

class SentraCoreService {
  private configurations: SentraCoreConfiguration[] = [];
  private readonly dataDir: string;
  private readonly filePath: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
    this.filePath = path.join(this.dataDir, 'sentra-core-configurations.json');
    this.loadConfigurations();
  }

  private loadConfigurations(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf8');
        this.configurations = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading configurations:', error);
      this.configurations = [];
    }
  }

  private saveConfigurations(): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.configurations, null, 2));
    } catch (error) {
      console.error('Error saving configurations:', error);
    }
  }

  getAllConfigurations(): SentraCoreConfiguration[] {
    this.loadConfigurations(); // Reload fresh data
    return this.configurations;
  }

  getConfigurationById(id: string): SentraCoreConfiguration | null {
    this.loadConfigurations(); // Reload fresh data
    return this.configurations.find(config => config.id === id) || null;
  }

  createConfiguration(configData: Omit<SentraCoreConfiguration, 'id' | 'created_at' | 'updated_at'>): SentraCoreConfiguration {
    const newConfiguration: SentraCoreConfiguration = {
      id: Date.now().toString(),
      ...configData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.configurations.push(newConfiguration);
    this.saveConfigurations();
    return newConfiguration;
  }

  updateConfiguration(id: string, configData: Partial<Omit<SentraCoreConfiguration, 'id' | 'created_at'>>): SentraCoreConfiguration | null {
    const index = this.configurations.findIndex(config => config.id === id);
    
    if (index === -1) {
      return null;
    }

    const updatedConfiguration: SentraCoreConfiguration = {
      ...this.configurations[index],
      ...configData,
      updated_at: new Date().toISOString()
    };

    this.configurations[index] = updatedConfiguration;
    this.saveConfigurations();
    return updatedConfiguration;
  }

  deleteConfiguration(id: string): boolean {
    const index = this.configurations.findIndex(config => config.id === id);
    
    if (index === -1) {
      return false;
    }

    this.configurations.splice(index, 1);
    this.saveConfigurations();
    return true;
  }
}

// Export a singleton instance
export const sentraCoreService = new SentraCoreService(); 