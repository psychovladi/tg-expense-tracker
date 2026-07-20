import {
  getCloudStorageItem,
  setCloudStorageItem,
  deleteCloudStorageItem,
  getCloudStorageKeys,
} from '@telegram-apps/sdk-react';
import type { Expense } from '../types';

/**
 * Telegram CloudStorage caps a value at 4096 characters and a user at 1024
 * keys total (see https://core.telegram.org/bots/webapps#cloudstorage).
 * A single JSON blob for the whole expense history would eventually blow
 * past the 4096-char value limit, so history is bucketed one CloudStorage
 * key per month (`exp_YYYY-MM`) — comfortably under both limits for
 * personal-tracker-scale usage, while still needing only one small write
 * per add/delete.
 */
const LOCAL_KEY = 'expenses';
const BUCKET_PREFIX = 'exp_';

const bucketKeyForDate = (isoDate: string) => `${BUCKET_PREFIX}${isoDate.slice(0, 7)}`;

async function cloudGetMany(keys: string[]): Promise<Record<string, string>> {
  if (keys.length === 0) return {};
  try {
    if (!getCloudStorageItem.isAvailable()) return {};
    return await getCloudStorageItem(keys);
  } catch (e) {
    console.warn('CloudStorage read failed', e);
    return {};
  }
}

async function cloudSetBucket(key: string, expenses: Expense[]): Promise<void> {
  try {
    if (expenses.length === 0) {
      if (deleteCloudStorageItem.isAvailable()) await deleteCloudStorageItem(key);
      return;
    }
    if (!setCloudStorageItem.isAvailable()) return;
    await setCloudStorageItem(key, JSON.stringify(expenses));
  } catch (e) {
    console.warn('CloudStorage write failed', e);
  }
}

function loadLocal(): Expense[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to parse locally stored expenses', e);
    return [];
  }
}

function saveLocal(expenses: Expense[]): void {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(expenses));
}

/**
 * Loads the full expense history, preferring Telegram CloudStorage (synced
 * across the user's devices) and falling back to the local cache when
 * CloudStorage is unavailable (e.g. running in a plain browser).
 */
export async function loadAllExpenses(): Promise<Expense[]> {
  try {
    if (getCloudStorageKeys.isAvailable()) {
      const allKeys = await getCloudStorageKeys();
      const bucketKeys = allKeys.filter((k) => k.startsWith(BUCKET_PREFIX));
      if (bucketKeys.length > 0) {
        const values = await cloudGetMany(bucketKeys);
        const merged: Expense[] = [];
        for (const raw of Object.values(values)) {
          if (!raw) continue;
          try {
            const bucket = JSON.parse(raw);
            if (Array.isArray(bucket)) merged.push(...bucket);
          } catch {
            // skip a corrupted bucket rather than losing the whole history
          }
        }
        saveLocal(merged);
        return merged;
      }
    }
  } catch (e) {
    console.warn('CloudStorage listing failed, using local cache', e);
  }
  return loadLocal();
}

/**
 * Persists the full list locally and pushes only the CloudStorage bucket(s)
 * touched by the given dates (add = 1 date, delete = 1 date) — cheap writes
 * instead of re-uploading the whole history on every change.
 */
export async function persistExpenses(fullList: Expense[], touchedDates: string[]): Promise<void> {
  saveLocal(fullList);

  const touchedBuckets = new Set(touchedDates.map(bucketKeyForDate));
  await Promise.all(
    Array.from(touchedBuckets).map((bucketKey) => {
      const bucketExpenses = fullList.filter((e) => bucketKeyForDate(e.date) === bucketKey);
      return cloudSetBucket(bucketKey, bucketExpenses);
    }),
  );
}
