import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type TimerProps = {
  duration: number;
  onComplete: () => void;
};

export default function Timer({ duration, onComplete }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{timeLeft}s</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4a90e2',
  },
  timer: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
});