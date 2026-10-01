export type EmotionLevel = 1 | 2 | 3 | 4 | 5;

export interface EmotionOption {
  level: EmotionLevel;
  emoji: string;
  label: string;
  color: string;
}

export interface CharacterRole {
  name: string;
  roleTitle: string;
  avatar: string;
  description: string;
}

export interface ScriptLine {
  speaker: string;
  avatar?: string;
  actionOrTone: string;
  text: string;
  tip?: string;
}

export interface Quest {
  id: number;
  title: string;
  category: '규칙/약속' | '배려/언어' | '우정/소통' | '협동/양보' | '감정조절';
  difficulty: 1 | 2 | 3;
  icon: string;
  summary: string;
  roles: CharacterRole[];
  script: ScriptLine[];
  keyLearning: string;
}

export interface AgentProfile {
  name: string;
  avatar: string;
  title: string;
}

export interface MissionReport {
  agentName: string;
  agentAvatar: string;
  quest: Quest;
  beforeEmotion: EmotionLevel;
  afterEmotion: EmotionLevel;
  reflection: string;
  completedAt: string;
}
