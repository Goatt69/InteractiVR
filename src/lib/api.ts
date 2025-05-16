import { VocabularyItem } from '@/app/types/vocabulary';
import { Config_URL } from '@/config/config_url';

export async function fetchVocabularyByObjectId(objectId: number): Promise<VocabularyItem[]> {
  const res = await fetch(`${Config_URL}/vocabulary/object/${objectId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch vocabulary');
  }
  return res.json();
}

