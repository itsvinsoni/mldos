
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Settings } from '../types';
import * as api from '../services/localApi';

interface SettingsContextType {
  settings: Settings;
  saveSettings: (newSettings: Settings) => Promise<void>;
  loading: boolean;
}

const defaultSettings: Settings = {
  appName: 'College OS',
  themeColor: '#FB923C',
};

export const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  saveSettings: async () => {},
  loading: true,
});

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const savedSettings = await api.getSettings();
      if (savedSettings) {
        setSettings(savedSettings);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const saveSettings = async (newSettings: Settings) => {
    setSettings(newSettings);
    await api.saveSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, saveSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};
