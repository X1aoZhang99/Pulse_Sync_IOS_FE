export type RootStackParamList = {
  Home: undefined;
  Meditation: {
    type: 'relax' | 'sleep' | 'rest';
    audioFile: string;
  };
};