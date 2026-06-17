// Single source of truth for the online status mapping
export const OnlineStatusMap = {
  1: "Online",
  2: "Idle",
  3: "Do Not Disturb",
  4: "Invisible",
} as const;

// Nifty TypeScript magic: extracts 1 | 2 | 3 | 4 as valid types
export type OnlineStatusId = keyof typeof OnlineStatusMap;

// This is the strict contract for the JSON going over the serialization boudnary, now used by both frontend *and* backend!
export interface UserDTO {
  id: string;
  createdAt: string; // Over the network, this is a string!
  username: string;
  displayName: string | null;
  bio: string | null;
  profilePicURL: string | null;
  onlineStatusId: OnlineStatusId | null;
  onlineStatusUntil: string | null; // Over the network, once again: string!
};