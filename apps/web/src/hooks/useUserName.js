import { useLocalStorage } from './useLocalStorage.js';

export function useUserName() {
  const [userName, setUserName] = useLocalStorage('vityu_username', 'Vityu Lover');
  return [userName, setUserName];
}