'use server';

import { createShare } from './firebase/firestore';
import { headers } from 'next/headers';

export async function createShareLink(userId: string) {
  if (!userId) {
    return { error: 'You must be logged in to share records.' };
  }
  try {
    const shareId = await createShare(userId);
    const host = headers().get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const shareUrl = `${protocol}://${host}/share/${shareId}`;
    return { url: shareUrl, error: null };
  } catch (error) {
    return { url: null, error: 'Failed to create share link.' };
  }
}
