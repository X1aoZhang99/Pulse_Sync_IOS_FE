import { BPMData } from '../types/bpm';

export async function fetchBPMData(): Promise<BPMData[]> {
  try {
    const response = await fetch('http://192.168.0.246:3000/api/pulse/latest',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching BPM data:', error);
    throw error;
  }
}
export async function startGpio(): Promise<void> {
  try {
    const response = await fetch('http://192.168.0.246:3000/api/raw-data/gpio/start',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log("response",data);
    if (!response.ok) {
      throw new Error('Network response was not ok1');
    }
    return await response.json();
  } catch (error) {
    console.error('Error starting BPM data:', error);
    throw error;
  }
}