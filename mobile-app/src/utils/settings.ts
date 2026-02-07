import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@quiz_settings';

export type QuestionCountOption = 5 | 10 | 20 | 'all';

interface Settings {
  defaultQuestionCount: QuestionCountOption;
}

const DEFAULT_SETTINGS: Settings = {
  defaultQuestionCount: 10,
};

// 設定を取得
export const getSettings = async (): Promise<Settings> => {
  try {
    const jsonValue = await AsyncStorage.getItem(SETTINGS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : DEFAULT_SETTINGS;
  } catch (e) {
    console.error('Failed to load settings:', e);
    return DEFAULT_SETTINGS;
  }
};

// 設定を保存
export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(SETTINGS_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
};

// デフォルト問題数を取得
export const getDefaultQuestionCount = async (): Promise<QuestionCountOption> => {
  const settings = await getSettings();
  return settings.defaultQuestionCount;
};

// デフォルト問題数を設定
export const setDefaultQuestionCount = async (count: QuestionCountOption): Promise<void> => {
  const settings = await getSettings();
  settings.defaultQuestionCount = count;
  await saveSettings(settings);
};