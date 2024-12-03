import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { BPMData } from '../types/bpm';
import { fetchBPMData,startGpio } from '../services/api';
import History from '../components/History';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [bpmData, setBpmData] = useState<BPMData[]>();
  // const [hisavgbpm, setHisAvgBPM] = useState<number | null>(null);

  useEffect(() => {
    const startGpio1 = async () => {
      try {
        startGpio();
      } catch (error) {
        console.error('Error fetching BPM data:', error);
      }
    };
    startGpio1();
    const interval = setInterval(async () => {
      try {
        const bpmdataReceived = await fetchBPMData();
        const newValues = bpmdataReceived.data.map(Number); // Convert to numbers
        console.log('newValues', newValues);
        setBpmData(newValues); // Append new data
      } catch (error) {
        console.error('Error fetching BPM data:', error);
      }
    }, 5000);
    return () => clearInterval(interval);
    
  }, []);

  const meditationSessions = [
    { type: 'relax', title: 'Relaxation', audioFile: 'relax.mp3' },
    { type: 'sleep', title: 'Sleep', audioFile: 'sleep.mp3' },
    { type: 'rest', title: 'Rest', audioFile: 'rest.mp3' },
  ] as const;
  const avgBpm : Number = bpmData?.reduce((acc, curr) => acc + curr, 0) / bpmData?.length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Your BPM Data</Text>
        <Text> current BPM:{avgBpm.toPrecision(4)}</Text>
      </View>

      <View style={styles.sessionsContainer}>
        <Text style={styles.subtitle}>Meditation Sessions</Text>
        {meditationSessions.map((session) => (
          <TouchableOpacity
            key={session.type}
            style={styles.sessionButton}
            onPress={() => navigation.navigate('Meditation', {
              type: session.type,
              audioFile: session.audioFile,
            })}
          >
            <Text style={styles.buttonText}>{session.title}</Text>
          </TouchableOpacity>
        ))}
        <History />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  chartContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sessionsContainer: {
    padding: 15,
  },
  sessionButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

