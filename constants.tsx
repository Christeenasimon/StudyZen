
import React from 'react';

export const QUIZ_QUESTIONS = [
  { id: 1, text: "I feel emotionally drained by my studies.", weight: 1.5 },
  { id: 2, text: "I have trouble concentrating on lectures or readings.", weight: 1.2 },
  { id: 3, text: "I feel like I'm working more but achieving less.", weight: 1.3 },
  { id: 4, text: "I've become less interested in social activities I used to enjoy.", weight: 1.4 },
  { id: 5, text: "I feel physically exhausted even after sleeping.", weight: 1.5 },
  { id: 6, text: "Small tasks feel overwhelming to start.", weight: 1.2 },
  { id: 7, text: "I find myself being cynical or irritable about schoolwork.", weight: 1.3 },
  { id: 8, text: "I worry about my future academic success constantly.", weight: 1.1 },
  { id: 9, text: "I feel isolated from my classmates or peers.", weight: 1.0 },
  { id: 10, text: "I experience headaches or tension frequently during study sessions.", weight: 1.2 },
];

export const SMART_BREAKS = [
  { id: 'memory', title: 'Memory Flip', desc: 'Find the nature pairs!', icon: '🎴' },
  { id: 'bubble', title: 'Bubble Pop', desc: 'Pop away your worries.', icon: '🫧' },
  { id: 'pattern', title: 'Pattern Repeat', desc: 'Follow the Zen sequence.', icon: '🔁' },
  { id: 'click', title: 'Calm Click', desc: 'Only tap the Green seeds.', icon: '🎯' },
  { id: 'puzzle', title: 'Brain Reset', desc: 'Slide the tiles to calm.', icon: '🧩' },
  { id: 'math', title: 'Quick Math', desc: 'Easy sums for focus.', icon: '➕' },
  { id: 'scramble', title: 'Word Scramble', desc: 'Unscramble peace words.', icon: '🔤' },
  { id: 'stresstap', title: 'Stress Meter', desc: 'Tap to release pressure.', icon: '🌡️' },
  { id: 'color', title: 'Color Therapy', desc: 'Fill the world with color.', icon: '🎨' },
  { id: 'breath', title: 'Guided Breath', desc: 'Sync with the circle.', icon: '🌬️' },
  { id: 'reaction', title: 'Quick Catch', desc: 'Tap when the light turns Green.', icon: '⚡' },
  { id: 'dot', title: 'Dot Tracker', desc: 'Follow the floating light.', icon: '🟣' },
  { id: 'shape', title: 'Shape Match', desc: 'Match the cute shapes.', icon: '⭐' },
  { id: 'gratitude', title: 'Gratitude Catch', desc: 'Click the positive vibes.', icon: '🤲' }
];

export const EMOTIONAL_RESPONSES: Record<string, string[]> = {
  STRESS: [
    "I hear you. Academic pressure is intense. Let's try to break things down into tiny pieces.",
    "Stress is your body trying to help you, but it's okay to tell it to slow down. Have you tried breathing?",
    "You are doing a lot. It's okay to feel overwhelmed."
  ],
  MOTIVATION: [
    "Your worth isn't tied to your productivity today. It's okay to rest.",
    "A small step is still a step forward. What's one tiny thing we can do?",
    "Remember why you started, but also remember that your health is the engine that gets you there."
  ],
  OVERTHINKING: [
    "Our minds can be loud. Let's ground ourselves: what are 3 things you can see right now?",
    "Thoughts are just clouds passing. You don't have to follow every one.",
    "Let's focus on what we can control right now: your next breath."
  ],
  GENERAL: [
    "I'm here for you. How else can I support you?",
    "That sounds tough. Take a moment to acknowledge that you're trying your best.",
    "You're not alone in feeling this way."
  ]
};
