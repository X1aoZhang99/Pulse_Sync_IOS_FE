import React, { useEffect, useState,useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { Audio } from "expo-av";
import { RootStackParamList } from "../types/navigation";
import Timer from "../components/Timer";
import { BPMData } from "../types/bpm";
import { fetchBPMData } from "../services/api";
import BPMChart from "../components/BPMChart";
import { useAudioPlayer } from 'expo-audio';
import { saveMeditationSession } from '../stores/actions/historyActions';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addBPMSession } from '../stores/reducers/bpmHistoryReducer';
import { current } from "@reduxjs/toolkit";

type MeditationScreenProps = {
  route: RouteProp<RootStackParamList, "Meditation">;

};

export default function MeditationScreen({ route }: MeditationScreenProps) {
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timer,setTimer] = useState(60);
  const [plotbpmData, setPlotBpmData] = useState<number[]>();
  // const audioFile  = route.params.audioFile;
  const {type,audioFile} = route.params;
  const [lastbpmData, setLastBpmData] = useState<number[]>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Store interval ID
  const isActive = useRef(true); // Control flag


  // const  navigation = useNavigation();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   return sound
  //     ? () => {
  //         sound.unloadAsync();
  //       }
  //     : undefined;
      
  // }, [sound]);

  const fetchAndAppendBPMData = async () => {
    try {
      const bpmdataReceived = await fetchBPMData();
      console.log("bpmdataReceivd",bpmdataReceived);
      const newValues = bpmdataReceived.data.map(Number); // Convert to numbers
      setLastBpmData((prevData) => [...prevData, ...newValues]); // Append new data
    } catch (error) {
      console.error("Error fetching BPM data:", error);
    }
  };
  useEffect(() => {
    return () => {
      // Cleanup sound and interval on unmount
      if (sound) sound.unloadAsync();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sound]);

  const startFetchingBPMData = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(fetchAndAppendBPMData, 1000); // Fetch every second
    }
  };
  const stopFetchingBPMData = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const bpmdataReceived = await fetchBPMData();
        const newValues = bpmdataReceived.data.map(Number); // Convert to numbers
        console.log('newValues', newValues);
        const lastnewvalues = newValues[9];
        setLastBpmData((prevData) => (prevData ? [...prevData, lastnewvalues] : [lastnewvalues])); // Append new data

      } catch (error) {
        console.error('Error fetching BPM data:', error);
      }
    }, 1000);
    return () => {clearInterval(interval);
      isActive.current = false;
    };
  })


  const playSound = async () => {
    try {
      switch (audioFile) {
      
        case "relax.mp3":
          const { sound: audioSound } = await Audio.Sound.createAsync(
            require("/Users/shelton/Documents/my-class/INFO7210/Pulse_Sync_IOS_FE/assets/audio/relax.mp3"),
            { shouldPlay: true }
          );
          setSound(audioSound);
          break;
        case "sleep.mp3":
          setTimer(600);
          const { sound: audioSound1 } = await Audio.Sound.createAsync(
            require("/Users/shelton/Documents/my-class/INFO7210/Pulse_Sync_IOS_FE/assets/audio/sleep.mp3"),
            { shouldPlay: true }
          );
          setSound(audioSound1);

          break;
        case "rest.mp3":
          setTimer(180);
          const { sound: audioSound2 } = await Audio.Sound.createAsync(
            require("/Users/shelton/Documents/my-class/INFO7210/Pulse_Sync_IOS_FE/assets/audio/rest.mp3"),
            { shouldPlay: true }
          );
          setSound(audioSound2);

          break;
        default:
      }
      setIsPlaying(true);
      // const audioFilesaddress :string = ``;
      // const player = useAudioPlayer(audioFilesaddress);
      // player.play();
      
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };
  // const playSoundTest = async () => {
  // }

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      stopFetchingBPMData(); // Stop fetching BPM data
    }
  };
  console.log('data',lastbpmData);
  console.log('plotbpmData',plotbpmData);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {type.charAt(0).toUpperCase() + type.slice(1)} Meditation
      </Text>

      {finished && plotbpmData ? <BPMChart BPMdata={plotbpmData}/> : null}

      {isPlaying ? (
        <Timer
          duration={timer}
          onComplete={() => {
            if (!finished) {
              setFinished(true);
              stopSound();
              setPlotBpmData(lastbpmData);
              console.log("plotbpmData",plotbpmData);
              const avglastBpm = lastbpmData?.reduce((acc,curr)=>acc + curr , 0) /lastbpmData?.length;
              console.log(avglastBpm)
              dispatch(addBPMSession(Math.round(avglastBpm)))
              // fetchBPMData().then((bpmdata: BPMData[]) => {
              //   const newBpmData = bpmdata.data.map(Number);
              //   setLastBpmData(newBpmData);
              //   const avglastBpm = newBpmData.reduce((acc, curr) => acc + curr, 0) / newBpmData.length;
              //   console.log('avglastBpm', avglastBpm);
              //   dispatch(addBPMSession(Math.round(avglastBpm)));
              // });
            }
          }}
        />
      ) : null}

      {!finished ? (
        <TouchableOpacity
          style={styles.button}
          onPress={isPlaying ? stopSound : playSound}
        >
          <Text style={styles.buttonText}>
            {isPlaying ? "Stop Audio" : "Start Audio"}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    padding: 20,
    paddingTop: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 0,
  },
  button: {
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
