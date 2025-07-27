import { Client, Databases, Query } from 'appwrite';

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

const databases = new Databases(client);

export type PartyDetails = {
  title: string;
  thumbnail: string;
  location: string;
  description: string;
  headcount: number;
  superLats: string[];
  preferences: string;
  date: string;
  time: string;
  type: string;
};

export async function getGuestData(inviteId: string): Promise<PartyDetails| null> {
  try {
    const response = await databases.listDocuments(
      '6777521b00342adf566c',
      '677752fb000bbef5c3ae',
      [Query.equal('$id', atob(inviteId))]
    );
        const doc = response.documents[0];

    if (!doc) return null;

    return {
      title: doc.title,
      thumbnail: doc.thumbnail,
      location: doc.location,
      description: doc.description,
      headcount: doc.headcount,
      superLats: doc.superLats,
      preferences: doc.preferences,
      date: doc.date,
      time: doc.time,
      type: doc.type,
    };
  } catch (error) {
    return null;
  }
}
