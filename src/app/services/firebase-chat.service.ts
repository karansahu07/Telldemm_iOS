import { Injectable } from '@angular/core';
import {
  Database,
  ref,
  push,
  onValue,
  set,
  get,
  child,
  runTransaction
} from '@angular/fire/database';
import { Observable } from 'rxjs';
import { getDatabase, update } from 'firebase/database';

@Injectable({ providedIn: 'root' })
export class FirebaseChatService {
  constructor(private db: Database) {}

  async sendMessage(roomId: string, message: any, chatType: string, senderId: string) {
    const messagesRef = ref(this.db, `chats/${roomId}`);
    await push(messagesRef, message);

    if (chatType === 'private') {
      // Increment unread for receiver only
      const receiverId = message.receiver_id;
      if (receiverId && receiverId !== senderId) {
        this.incrementUnreadCount(roomId, receiverId);
      }
    } else if (chatType === 'group') {
      // Increment unread for all members except sender
      const groupSnapshot = await get(ref(this.db, `groups/${roomId}/members`));
      const members = groupSnapshot.val();
      if (members) {
        Object.keys(members).forEach(memberId => {
          if (memberId !== senderId) {
            this.incrementUnreadCount(roomId, memberId);
          }
        });
      }
    }
  }

  listenForMessages(roomId: string): Observable<any[]> {
    return new Observable(observer => {
      const messagesRef = ref(this.db, `chats/${roomId}`);
      onValue(messagesRef, snapshot => {
        const data = snapshot.val();
        const messages = data ? Object.entries(data).map(([key, val]) => ({ key, ...(val as any) })) : [];
        observer.next(messages);
      });
    });
  }

  async createGroup(groupId: string, groupName: string, members: any[]) {
  const db = getDatabase();
  const groupRef = ref(db, `groups/${groupId}`);

  const groupData = {
    name: groupName,
    groupId,
    members: members.reduce((acc, member) => {
      acc[member.user_id] = {
        name: member.name,
        phone_number: member.phone_number
      };
      return acc;
    }, {}),
    createdAt: String(new Date()),
  };

  await set(groupRef, groupData);
}



  async getGroupInfo(groupId: string): Promise<any> {
    const snapshot = await get(child(ref(this.db), `groups/${groupId}`));
    return snapshot.exists() ? snapshot.val() : null;
  }

//   async getGroupInfo(groupId: string): Promise<any> {
//   const groupRef = ref(this.db, `groups/${groupId}`);
//   const snapshot = await get(groupRef);
//   return snapshot.exists() ? snapshot.val() : null;
// }


  async getGroupsForUser(userId: string): Promise<string[]> {
    const snapshot = await get(child(ref(this.db), 'groups'));
    const allGroups = snapshot.val();
    const userGroups: string[] = [];

    if (allGroups) {
      Object.entries(allGroups).forEach(([groupId, groupData]: any) => {
        if (groupData.members?.[userId]) {
          userGroups.push(groupId);
        }
      });
    }

    return userGroups;
  }

//   async getGroupsForUser(userId: string): Promise<string[]> {
//   const snapshot = await get(child(ref(this.db), 'groups'));
//   const allGroups = snapshot.val();
//   const userGroups: string[] = [];

//   if (allGroups) {
//     Object.entries(allGroups).forEach(([groupId, groupData]: [string, any]) => {
//       if (groupData.members?.[userId]) {
//         userGroups.push(groupId);
//       }
//     });
//   }

//   return userGroups;
// }


  incrementUnreadCount(roomId: string, receiverId: string) {
    const unreadRef = ref(this.db, `unreadCounts/${roomId}/${receiverId}`);
    return runTransaction(unreadRef, count => (count || 0) + 1);
  }

  resetUnreadCount(roomId: string, userId: string) {
    const unreadRef = ref(this.db, `unreadCounts/${roomId}/${userId}`);
    return set(unreadRef, 0);
  }

  listenToUnreadCount(roomId: string, userId: string): Observable<number> {
    return new Observable(observer => {
      const unreadRef = ref(this.db, `unreadCounts/${roomId}/${userId}`);
      onValue(unreadRef, snapshot => {
        const val = snapshot.val();
        observer.next(val || 0);
      });
    });
  }

  async getGroupMembers(groupId: string): Promise<string[]> {
    const snapshot = await get(ref(this.db, `groups/${groupId}/members`));
    const membersObj = snapshot.val();
    return membersObj ? Object.keys(membersObj) : [];
  }

 // 👇 Call when message arrives on receiver's device
  markDelivered(roomId: string, messageKey: string) {
    const messageRef = ref(this.db, `chats/${roomId}/${messageKey}`);
    // console.log("sdffsdd",messageRef);
    update(messageRef, { delivered: true });
  }

  // 👇 Call only when message is visibly seen
  markRead(roomId: string, messageKey: string) {
    const messageRef = ref(this.db, `chats/${roomId}/${messageKey}`);
    update(messageRef, { read: true });
  }
}