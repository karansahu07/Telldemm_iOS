import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { FooterTabsComponent } from '../components/footer-tabs/footer-tabs.component';
import { Router } from '@angular/router';
import { MenuPopoverComponent } from '../components/menu-popover/menu-popover.component';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ApiService } from '../services/api/api.service';
import { FirebaseChatService } from '../services/firebase-chat.service';
import { Subscription } from 'rxjs';
import { EncryptionService } from '../services/encryption.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.page.html',
  styleUrls: ['./home-screen.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FooterTabsComponent, FormsModule]
})
export class HomeScreenPage implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private popoverCtrl: PopoverController,
    private service: ApiService,
    private firebaseChatService: FirebaseChatService,
    private encryptionService: EncryptionService
  ) { }

  searchText = '';
  selectedFilter = 'all';
  currUserId: string | null = localStorage.getItem('phone_number');
  senderUserId: string | null = localStorage.getItem('userId');

  // currUserId: string | null = localStorage.getItem('phone_number')?.replace(/^(\+91|91)/, '') || null; for one to one chat notification
  scannedText = '';
  capturedImage = '';
  chatList: any[] = [];
  toggleGroupCreator = false;
  newGroupName = '';
  unreadSubs: Subscription[] = [];

  ngOnInit() {
    this.getAllUsers();
    this.loadUserGroups(); // Optional group loading
    console.log("fdgmnkfmkmk:", this.currUserId);
  }

  ngOnDestroy() {
    this.unreadSubs.forEach(sub => sub.unsubscribe());
  }

  getAllUsers() {
    const currentSenderId = this.senderUserId;
    console.log("dfjsdjidgf", currentSenderId)
    if (!currentSenderId) return;

    this.service.getAllUsers().subscribe((users: any[]) => {
      users.forEach(user => {
        const receiverId = user.user_id.toString();
        const receiver_phone = user.phone_number.toString();
        const receiver_name = user.name.toString();
        console.log("receiver phone", receiver_phone);

        if (receiverId !== currentSenderId) {
          const roomId = this.getRoomId(currentSenderId, receiverId);
          console.log("ROOM ID", roomId);

          const chat = {
            ...user,
            name: user.name,
            receiver_Id: receiverId,
            receiver_phone: receiver_phone,
            group: false,
            message: '',
            time: '',
            unreadCount: 0,
            unread: false
          };

          console.log("chaat:", chat);

          this.chatList.push(chat);

          // Listen to messages in this room
          this.firebaseChatService.listenForMessages(roomId).subscribe(async (messages) => {
            // console.log("messahes jdfdhjk",messages);
            if (messages.length > 0) {
              const lastMsg = messages[messages.length - 1];
              // console.log(lastMsg);

              if (
                lastMsg.receiver_id === currentSenderId && !lastMsg.delivered
              ) {
                this.firebaseChatService.markDelivered(roomId, lastMsg.key);
              }

              try {
                const decryptedText = await this.encryptionService.decrypt(lastMsg.text);
                chat.message = decryptedText;
              } catch (e) {
                chat.message = '[Encrypted]';
              }

              // chat.time = lastMsg.timestamp?.split(', ')[1] || '';
              if (lastMsg.timestamp) {
                chat.time = this.formatTimestamp(lastMsg.timestamp);
              }
              console.log("kktime dkefjg", chat.time);
            }
          });

          // Listen to unread message count
          const sub = this.firebaseChatService
            .listenToUnreadCount(roomId, currentSenderId)
            .subscribe((count: number) => {
              chat.unreadCount = count;
              chat.unread = count > 0;
            });

          this.unreadSubs.push(sub);
        }
      });

    });
  }

  async loadUserGroups() {
  const userid = this.senderUserId;
  if (!userid) return;

  const groupIds = await this.firebaseChatService.getGroupsForUser(userid);
  console.log('Groups for user:', groupIds);

  for (const groupId of groupIds) {
    const groupInfo = await this.firebaseChatService.getGroupInfo(groupId);
    if (!groupInfo || !groupInfo.members || !groupInfo.members[userid]) continue;

    const groupName = groupInfo.name || 'Unnamed Group';

    const groupChat = {
      name: groupName,
      receiver_Id: groupId,
      group: true,
      message: '',
      time: '',
      unread: false,
      unreadCount: 0
    };

    this.chatList.push(groupChat);

    // ✅ Listen for latest messages
    this.firebaseChatService.listenForMessages(groupId).subscribe(async (messages) => {
      if (messages.length > 0) {
        const lastMsg = messages[messages.length - 1];

        try {
          const decryptedText = await this.encryptionService.decrypt(lastMsg.text);
          groupChat.message = decryptedText;
        } catch (e) {
          groupChat.message = '[Encrypted]';
        }

        if (lastMsg.timestamp) {
          groupChat.time = this.formatTimestamp(lastMsg.timestamp);
        }
      }
    });

    // ✅ Listen for unread count
    const sub = this.firebaseChatService
      .listenToUnreadCount(groupId, userid)
      .subscribe((count: number) => {
        groupChat.unreadCount = count;
        groupChat.unread = count > 0;
      });

    this.unreadSubs.push(sub);
  }
}


 
  
//   async loadUserGroups() {

//     // console.log("calling this function")
//   const userId = this.senderUserId;
//   if (!userId) return;

//   // Step 1: Get group IDs the user belongs to
//   const groupIds = await this.firebaseChatService.getGroupsForUser(userId);

//   // Step 2: Loop over each group ID
//   for (const groupId of groupIds) {
//     const groupInfo = await this.firebaseChatService.getGroupInfo(groupId);

//     console.log("group info", groupInfo)

//     if (!groupInfo || !groupInfo.members || !groupInfo.members[userId]) continue;

//     // Step 3: Create chat object
//     const groupChat = {
//       name: groupInfo.name || 'Unnamed Group',
//       receiver_Id: groupId,
//       group: true,
//       message: '',
//       time: '',
//       unread: false,
//       unreadCount: 0,
//     };

//     this.chatList.push(groupChat);

//     // Step 4: Listen for new messages
//     this.firebaseChatService.listenForMessages(groupId).subscribe(async (messages) => {
//       if (messages.length > 0) {
//         const lastMsg = messages[messages.length - 1];

//         try {
//           const decryptedText = await this.encryptionService.decrypt(lastMsg.text);
//           groupChat.message = decryptedText;
//         } catch (e) {
//           groupChat.message = '[Encrypted]';
//         }

//         if (lastMsg.timestamp) {
//           groupChat.time = this.formatTimestamp(lastMsg.timestamp);
//         }
//       }
//     });

//     // Step 5: Listen for unread count
//     const sub = this.firebaseChatService
//       .listenToUnreadCount(groupId, userId)
//       .subscribe((count: number) => {
//         groupChat.unreadCount = count;
//         groupChat.unread = count > 0;
//       });

//     this.unreadSubs.push(sub);
//   }
// }




    // this function shows time and date on chat
  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }); // e.g., "11:45 AM"
    } else if (isYesterday) {
      return 'Yesterday';
    } else if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { day: 'numeric', month: 'short' }); // e.g., "Jul 1"
    } else {
      return date.toLocaleDateString(); // e.g., "01/07/2024"
    }
  }



  get filteredChats() {
    let filtered = this.chatList;

    if (this.selectedFilter === 'read') {
      filtered = filtered.filter(chat => !chat.unread && !chat.group);
    } else if (this.selectedFilter === 'unread') {
      filtered = filtered.filter(chat => chat.unread && !chat.group);
    } else if (this.selectedFilter === 'groups') {
      filtered = filtered.filter(chat => chat.group);
    }

    if (this.searchText.trim() !== '') {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(chat =>
        chat.name?.toLowerCase().includes(searchLower) ||
        chat.message?.toLowerCase().includes(searchLower)
      );
    }

    // Sort by unread count (you can extend to use last message time later)
    return filtered.sort((a, b) => b.unreadCount - a.unreadCount);
  }

  get totalUnreadCount(): number {
    return this.chatList.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

  openChat(chat: any) {
    const receiverId = chat.receiver_Id;
    const receiver_phone = chat.receiver_phone;
    const receiver_name = chat.name;
    localStorage.setItem('receiver_name', receiver_name);
    if (chat.group) {
      this.router.navigate(['/chatting-screen'], {
        queryParams: { receiverId, isGroup: true }
      });
    } else {
      const cleanPhone = receiverId.replace(/\D/g, '').slice(-10);
      // console.log("lkklkklkl", )
      localStorage.setItem('receiver_phone', receiver_phone);
      this.router.navigate(['/chatting-screen'], {
        queryParams: { receiverId: cleanPhone, receiver_phone }
      });
    }
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: MenuPopoverComponent,
      event: ev,
      translucent: true
    });
    await popover.present();
  }

  goToContact() {
    this.router.navigate(['/contact-screen']);
  }

  async openCamera() {
    try {
      const image = await Camera.getPhoto({
        source: CameraSource.Camera,
        quality: 90,
        resultType: CameraResultType.Uri
      });
      this.capturedImage = image.webPath!;
    } catch (error) {
      console.error('Camera error:', error);
    }
  }

  // async scanBarcode() {
  //   const status = await BarcodeScanner.checkPermission({ force: true });
  //   if (!status.granted) {
  //     alert('Camera permission is required.');
  //     return;
  //   }

  //   await BarcodeScanner.hideBackground();
  //   document.body.classList.add('scanner-active');

  //   const result = await BarcodeScanner.startScan();
  //   if (result.hasContent) {
  //     this.scannedText = result.content;
  //   } else {
  //     alert('No barcode found.');
  //   }

  //   await BarcodeScanner.showBackground();
  //   document.body.classList.remove('scanner-active');
  // }



async scanBarcode() {
  try {
    if (!Capacitor.isNativePlatform()) {
      alert('Barcode scanning only works on a real device.');
      return;
    }

    const permission = await BarcodeScanner.checkPermission({ force: true });
    if (!permission.granted) {
      alert('Camera permission is required to scan barcodes.');
      return;
    }

    await BarcodeScanner.prepare(); // Setup camera preview
    await BarcodeScanner.hideBackground(); // Hide app background to show camera
    document.body.classList.add('scanner-active');

    // Start scanning
    const result = await BarcodeScanner.startScan();

    if (result?.hasContent) {
      console.log('Scanned Result:', result.content);
      this.scannedText = result.content;
    } else {
      alert('No barcode found.');
    }

  } catch (error) {
    console.error('Barcode Scan Error:', error);
    alert('Something went wrong during scanning.');
  } finally {
    // Always restore background and clean up
    await BarcodeScanner.showBackground();
    await BarcodeScanner.stopScan(); // <-- Ensure scanner is stopped
    document.body.classList.remove('scanner-active');
  }
}



  getRoomId(a: string, b: string): string {
    return a < b ? `${a}_${b}` : `${b}_${a}`;
  }
}
