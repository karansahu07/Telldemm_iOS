// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { IonicModule, PopoverController } from '@ionic/angular';
// import { FooterTabsComponent } from "../components/footer-tabs/footer-tabs.component";
// import { Router } from '@angular/router';
// import { MenuPopoverComponent } from '../components/menu-popover/menu-popover.component';
// import { FormsModule } from '@angular/forms';
// @Component({
//   selector: 'app-home-screen',
//   templateUrl: './home-screen.page.html',
//   styleUrls: ['./home-screen.page.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule, FooterTabsComponent, FormsModule]
// })
// export class HomeScreenPage implements OnInit {

//   constructor(private router: Router, private popoverCtrl: PopoverController) {}

//   ngOnInit() {}

//   searchText: string = '';
//   selectedFilter: string = 'all'; 

//   chatList = [
//     { name: 'Alice', message: 'Hello', messageStatus: 'sent', unread: false, time: '10:00 AM', unreadCount: 0, group: false },
//     { name: 'Alice', message: 'Hello again', messageStatus: 'seen', unread: false, time: '10:30 AM', unreadCount: 0, group: false },
//     { name: 'Bob', message: 'How are you?', messageStatus: 'received', unread: true, time: '11:00 AM', unreadCount: 2, group: false },
//     { name: 'Group Chat', message: 'Welcome all!', messageStatus: 'received', unread: true, time: '12:00 PM', unreadCount: 4, group: true },
//     { name: 'Charlie', message: 'Ping me later', messageStatus: 'sent', unread: false, time: '1:15 PM', unreadCount: 0, group: false }
//   ];

//   get filteredChats() {
//     let filtered = this.chatList;


//     if (this.selectedFilter === 'read') {
//       filtered = filtered.filter(chat => !chat.unread);
//     } else if (this.selectedFilter === 'unread') {
//       filtered = filtered.filter(chat => chat.unread);
//     } else if (this.selectedFilter === 'groups') {
//       filtered = filtered.filter(chat => chat.group);
//     }

//     if (this.searchText.trim() !== '') {
//       const searchLower = this.searchText.toLowerCase();
//       filtered = filtered.filter(chat =>
//         chat.name.toLowerCase().includes(searchLower) ||
//         chat.message.toLowerCase().includes(searchLower)
//       );
//     }

//     return filtered;
//   }

//   get totalUnreadCount(): number {
//     return this.chatList.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
//   }

//   setFilter(filter: string) {
//     this.selectedFilter = filter;
//   }

//   openChat(chat: any) {
//     this.router.navigate(['/chatting-screen']);
//   }

//   async presentPopover(ev: any) {
//     const popover = await this.popoverCtrl.create({
//       component: MenuPopoverComponent,
//       event: ev,
//       translucent: true,
//     });
//     await popover.present();
//   }

// }



// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { IonicModule, PopoverController } from '@ionic/angular';
// import { FooterTabsComponent } from "../components/footer-tabs/footer-tabs.component";
// import { Router } from '@angular/router';
// import { MenuPopoverComponent } from '../components/menu-popover/menu-popover.component';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-home-screen',
//   templateUrl: './home-screen.page.html',
//   styleUrls: ['./home-screen.page.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule, FooterTabsComponent, FormsModule]
// })
// export class HomeScreenPage implements OnInit {

//   constructor(private router: Router, private popoverCtrl: PopoverController) { }

//   ngOnInit() { }

//   searchText: string = '';
//   selectedFilter: string = 'all'; // default selected tab


//   currUserId: string | null = localStorage.getItem("userId");

//   chatList = [
//     { name: 'Alice', userId: '9138152160', message: 'Hello', messageStatus: 'sent', unread: false, time: '10:00 AM', unreadCount: 0, group: false },
//     // { name: 'smith', userId: '9034223456', message: 'Hello again', messageStatus: 'seen', unread: false, time: '10:30 AM', unreadCount: 0, group: false },
//     { name: 'Bob', userId: '9034223457', message: 'How are you?', messageStatus: 'received', unread: true, time: '11:00 AM', unreadCount: 2, group: false },
//     // { name: 'Group Chat', userId: 'groupchat456', message: 'Welcome all!', messageStatus: 'received', unread: true, time: '12:00 PM', unreadCount: 4, group: true },
//     // { name: 'karan', userId: '9138152160', message: 'Ping me later', messageStatus: 'sent', unread: false, time: '1:15 PM', unreadCount: 0, group: false }
//   ].filter(u => u.userId != this.currUserId);

//   get filteredChats() {
//     let filtered = this.chatList;

//     // Step 1: Apply tab filter
//     if (this.selectedFilter === 'read') {
//       filtered = filtered.filter(chat => !chat.unread);
//     } else if (this.selectedFilter === 'unread') {
//       filtered = filtered.filter(chat => chat.unread);
//     } else if (this.selectedFilter === 'groups') {
//       filtered = filtered.filter(chat => chat.group);
//     }

//     // Step 2: Apply search filter
//     if (this.searchText.trim() !== '') {
//       const searchLower = this.searchText.toLowerCase();
//       filtered = filtered.filter(chat =>
//         chat.name.toLowerCase().includes(searchLower) ||
//         chat.message.toLowerCase().includes(searchLower)
//       );
//     }

//     return filtered;
//   }

//   get totalUnreadCount(): number {
//     return this.chatList.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
//   }

//   setFilter(filter: string) {
//     this.selectedFilter = filter;
//   }

//   openChat(chat: any) {
//     // 1. Set current userId in localStorage (replace with actual login/session logic if needed)
//     // localStorage.setItem('userId', 'bob123'); // This is the logged-in user
//     // console.log('userId');

//     // 2. Navigate to chat screen with receiverId in queryParams
//     console.log(chat.userId);
//     this.router.navigate(['/chatting-screen'], {
//       queryParams: { receiverId: chat.userId }
//     });
//   }

//   async presentPopover(ev: any) {
//     const popover = await this.popoverCtrl.create({
//       component: MenuPopoverComponent,
//       event: ev,
//       translucent: true,
//     });
//     await popover.present();
//   }
// }



// import { CommonModule } from '@angular/common';
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { IonicModule, PopoverController } from '@ionic/angular';
// import { FooterTabsComponent } from "../components/footer-tabs/footer-tabs.component";
// import { Router } from '@angular/router';
// import { MenuPopoverComponent } from '../components/menu-popover/menu-popover.component';
// import { FormsModule } from '@angular/forms';
// import { SocketService } from '../services/socket.service'; // ✅ import your service
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-home-screen',
//   templateUrl: './home-screen.page.html',
//   styleUrls: ['./home-screen.page.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule, FooterTabsComponent, FormsModule]
// })
// export class HomeScreenPage implements OnInit, OnDestroy {
//   constructor(
//     private router: Router,
//     private popoverCtrl: PopoverController,
//     private socketService: SocketService // ✅ inject socket service
//   ) {}

//   searchText: string = '';
//   selectedFilter: string = 'all';
//   currUserId: string | null = localStorage.getItem("userId");
//   private messageSub: Subscription | undefined;

//   chatList = [
//     { name: 'Alice', phone: '9138152160', message: 'Hello', messageStatus: 'sent', unread: false, time: '10:00 AM', unreadCount: 0, group: false },
//     { name: 'Bob', phone: '9034223457', message: 'How are you?', messageStatus: 'received', unread: true, time: '11:00 AM', unreadCount: 2, group: false },
//   ].filter(u => u.phone != this.currUserId);

//   ngOnInit() {
//     this.listenToMessages(); // ✅ Listen when component loads
//   }

//   ngOnDestroy(): void {
//     if (this.messageSub) {
//       this.messageSub.unsubscribe();
//     }
//   }

//   listenToMessages() {
//     //comment by khusha
//     // this.messageSub = this.socketService.onMessage().subscribe((msg) => {
//     //   const { senderId, message } = msg;

//     //   const chat = this.chatList.find(c => c.userId === senderId);
//     //   if (chat) {
//     //     chat.message = message;
//     //     chat.unread = true;
//     //     chat.unreadCount += 1;
//     //     chat.time = new Date().toLocaleTimeString(); // Update to current time
//     //   } else {
//     //     // Optional: If message is from unknown user, add new chat card
//     //     this.chatList.push({
//     //       name: senderId, // You can replace this with actual user lookup
//     //       userId: senderId,
//     //       message: message,
//     //       messageStatus: 'received',
//     //       unread: true,
//     //       unreadCount: 1,
//     //       time: new Date().toLocaleTimeString(),
//     //       group: false
//     //     });
//     //   }
//     // });
//   }

//   get filteredChats() {
//     let filtered = this.chatList;

//     if (this.selectedFilter === 'read') {
//       filtered = filtered.filter(chat => !chat.unread);
//     } else if (this.selectedFilter === 'unread') {
//       filtered = filtered.filter(chat => chat.unread);
//     } else if (this.selectedFilter === 'groups') {
//       filtered = filtered.filter(chat => chat.group);
//     }

//     if (this.searchText.trim() !== '') {
//       const searchLower = this.searchText.toLowerCase();
//       filtered = filtered.filter(chat =>
//         chat.name.toLowerCase().includes(searchLower) ||
//         chat.message.toLowerCase().includes(searchLower)
//       );
//     }

//     return filtered;
//   }

//   get totalUnreadCount(): number {
//     return this.chatList.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
//   }

//   setFilter(filter: string) {
//     this.selectedFilter = filter;
//   }

//   openChat(chat: any) {
//     this.router.navigate(['/chatting-screen'], {
//       queryParams: { receiverId: chat.userId }
//     });
//   }

//   async presentPopover(ev: any) {
//     const popover = await this.popoverCtrl.create({
//       component: MenuPopoverComponent,
//       event: ev,
//       translucent: true,
//     });
//     await popover.present();
//   }
// }



// import { CommonModule } from '@angular/common';
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { IonicModule, PopoverController } from '@ionic/angular';
// import { FooterTabsComponent } from "../components/footer-tabs/footer-tabs.component";
// import { Router } from '@angular/router';
// import { MenuPopoverComponent } from '../components/menu-popover/menu-popover.component';
// import { FormsModule } from '@angular/forms';
// import { SocketService } from '../services/socket.service';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-home-screen',
//   templateUrl: './home-screen.page.html',
//   styleUrls: ['./home-screen.page.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule, FooterTabsComponent, FormsModule]
// })
// export class HomeScreenPage implements OnInit, OnDestroy {

//   constructor(
//     private router: Router,
//     private popoverCtrl: PopoverController,
//     private socketService: SocketService
//   ) {}

//   searchText: string = '';
//   selectedFilter: string = 'all';
//   currUserId: string | null = localStorage.getItem("phone_number");
//   private messageSub: Subscription | undefined;

//   chatList = [
//     { name: 'Alice', phone: '+919138152160', message: 'Hello', messageStatus: 'sent', unread: false, time: '10:00 AM', unreadCount: 0, group: false },
//     { name: 'Bob', phone: '+919034223457', message: 'How are you?', messageStatus: 'received', unread: true, time: '11:00 AM', unreadCount: 2, group: false },
//   ];

//   ngOnInit() {
//     // Remove current user's own number from chat list
//     this.chatList = this.chatList.filter(chat => chat.phone !== this.currUserId);

//     // Setup message listener
//     this.listenToMessages();
//   }

//   ngOnDestroy(): void {
//     if (this.messageSub) {
//       this.messageSub.unsubscribe();
//     }
//   }

//   listenToMessages() {
//     this.socketService.onMessageReceived((msg) => {
//       const { senderId, receiverId, message } = msg;

//       // Only update if current user is the receiver
//       if (receiverId !== this.currUserId) return;

//       const existingChat = this.chatList.find(c => c.phone === senderId);

//       if (existingChat) {
//         existingChat.message = message;
//         existingChat.unread = true;
//         existingChat.unreadCount += 1;
//         existingChat.time = new Date().toLocaleTimeString();
//       } else {
//         this.chatList.push({
//           name: senderId, // You can replace this with actual name lookup if available
//           phone: senderId,
//           message: message,
//           messageStatus: 'received',
//           unread: true,
//           unreadCount: 1,
//           time: new Date().toLocaleTimeString(),
//           group: false
//         });
//       }
//     });
//   }

//   get filteredChats() {
//     let filtered = this.chatList;

//     if (this.selectedFilter === 'read') {
//       filtered = filtered.filter(chat => !chat.unread);
//     } else if (this.selectedFilter === 'unread') {
//       filtered = filtered.filter(chat => chat.unread);
//     } else if (this.selectedFilter === 'groups') {
//       filtered = filtered.filter(chat => chat.group);
//     }

//     if (this.searchText.trim() !== '') {
//       const searchLower = this.searchText.toLowerCase();
//       filtered = filtered.filter(chat =>
//         chat.name.toLowerCase().includes(searchLower) ||
//         chat.message.toLowerCase().includes(searchLower)
//       );
//     }

//     return filtered;
//   }

//   get totalUnreadCount(): number {
//     return this.chatList.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
//   }

//   setFilter(filter: string) {
//     this.selectedFilter = filter;
//   }

//   openChat(chat: any) {
//     this.router.navigate(['/chatting-screen'], {
//       queryParams: { receiverId: chat.phone }
//     });
//   }

//   async presentPopover(ev: any) {
//     const popover = await this.popoverCtrl.create({
//       component: MenuPopoverComponent,
//       event: ev,
//       translucent: true,
//     });
//     await popover.present();
//   }
// }



// import { CommonModule } from '@angular/common';
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { IonicModule, PopoverController } from '@ionic/angular';
// import { FooterTabsComponent } from "../components/footer-tabs/footer-tabs.component";
// import { Router } from '@angular/router';
// import { MenuPopoverComponent } from '../components/menu-popover/menu-popover.component';
// import { FormsModule } from '@angular/forms';
// import { SocketService } from '../services/socket.service';
// import { ApiService } from '../services/api/api.service';
// // import { Camera, CameraResultType } from '@capacitor/camera';
// //import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
// import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
// // import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
// import { BarcodeScanner } from '@capacitor-community/barcode-scanner';


// @Component({
//   selector: 'app-home-screen',
//   templateUrl: './home-screen.page.html',
//   styleUrls: ['./home-screen.page.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule, FooterTabsComponent, FormsModule]
// })
// export class HomeScreenPage implements OnInit, OnDestroy {

//   constructor(
//     private router: Router,
//     private popoverCtrl: PopoverController,
//     private socketService: SocketService,
//     private apiService: ApiService
//   ) {}

//   searchText: string = '';
//   selectedFilter: string = 'all';
//   currUserId: string | null = localStorage.getItem("phone_number");
//   // capturedImage: string | undefined;
//   // scannedResult: string = '';
//   scannedText: string = '';


//   chatList: any[] = [];
//   galleryImages: string[] = [];
// capturedImage: string = '';

//   ngOnInit() {
//     this.fetchAllUsers();
//     this.listenToMessages();
//   }

//   ngOnDestroy(): void {
//     // No need to unsubscribe if not using observable subscription
//   }

//   // fetchAllUsers() {
//   //   this.apiService.getAllUsers().subscribe({
//   //     next: (users: any[]) => {
//   //       this.chatList = users
//   //         .filter((user: any) => user.phone_number !== this.currUserId)
//   //         .map((user: any) => ({
//   //           name: user.name || user.phone_number,
//   //           phone: user.phone_number,
//   //           message: 'No messages yet',
//   //           messageStatus: 'sent',
//   //           unread: false,
//   //           time: '',
//   //           unreadCount: 0,
//   //           group: false
//   //         }));
//   //     },
//   //     error: (err: any) => {
//   //       console.error("Failed to fetch users", err);
//   //     }
//   //   });
//   // }


// fetchAllUsers() {
//   // Show only Alice and Bob excluding current user
//   const allUsers = [
//     { name: 'Alice', phone_number: '+919138152160', message: 'Hello', messageStatus: 'sent', unread: false, time: '10:00 AM', unreadCount: 0, group: false },
//     { name: 'Bob', phone_number: '+919034223457', message: 'How are you?', messageStatus: 'received', unread: true, time: '11:00 AM', unreadCount: 2, group: false }
//   ];

//   this.chatList = allUsers.filter(u => u.phone_number !== this.currUserId);
// }

//   listenToMessages() {
//     this.socketService.onMessageReceived((msg) => {
//       const { senderId, receiverId, message } = msg;

//       if (receiverId !== this.currUserId) return;

//       const existingChat = this.chatList.find(c => c.phone === senderId);

//       if (existingChat) {
//         existingChat.message = message;
//         existingChat.unread = true;
//         existingChat.unreadCount += 1;
//         existingChat.time = new Date().toLocaleTimeString();
//       } else {
//         this.chatList.push({
//           name: senderId,
//           phone: senderId,
//           message: message,
//           messageStatus: 'received',
//           unread: true,
//           unreadCount: 1,
//           time: new Date().toLocaleTimeString(),
//           group: false
//         });
//       }
//     });
//   }

//   get filteredChats() {
//     let filtered = this.chatList;

//     if (this.selectedFilter === 'read') {
//       filtered = filtered.filter(chat => !chat.unread);
//     } else if (this.selectedFilter === 'unread') {
//       filtered = filtered.filter(chat => chat.unread);
//     } else if (this.selectedFilter === 'groups') {
//       filtered = filtered.filter(chat => chat.group);
//     }

//     if (this.searchText.trim() !== '') {
//       const searchLower = this.searchText.toLowerCase();
//       filtered = filtered.filter(chat =>
//         chat.name.toLowerCase().includes(searchLower) ||
//         chat.message.toLowerCase().includes(searchLower)
//       );
//     }

//     return filtered;
//   }

//   get totalUnreadCount(): number {
//     return this.chatList.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
//   }

//   setFilter(filter: string) {
//     this.selectedFilter = filter;
//   }

//   openChat(chat: any) {
//     this.router.navigate(['/chatting-screen'], {
//       queryParams: { receiverId: chat.phone }
//     });
//   }

//   async presentPopover(ev: any) {
//     const popover = await this.popoverCtrl.create({
//       component: MenuPopoverComponent,
//       event: ev,
//       translucent: true,
//     });
//     await popover.present();
//   }

//   goToContact() {
//   this.router.navigate(['/contact-screen']);
// }
// // async takePicture() {
// //     try {
// //       const image = await Camera.getPhoto({
// //         quality: 90,
// //         allowEditing: true,
// //         resultType: CameraResultType.Uri,
// //       });

// //       this.capturedImage = image.webPath!;
// //     } catch (error) {
// //       console.error('Camera error:', error);
// //     }
// //   }

// //camera
// async openCamera() {
//   try {
//     const image = await Camera.getPhoto({
//       source: CameraSource.Camera, 
//       quality: 90,
//       resultType: CameraResultType.Uri,
//     });

//     this.capturedImage = image.webPath!;
//   } catch (error) {
//     console.error('Camera error:', error);
//   }
// }


// //bar-code
// async scanBarcode() {
//   const status = await BarcodeScanner.checkPermission({ force: true });

//   if (!status.granted) {
//     alert('Camera permission is required.');
//     return;
//   }

//   await BarcodeScanner.hideBackground(); // Optional: hides webview background
//   document.body.classList.add('scanner-active'); // Add styling

//   const result = await BarcodeScanner.startScan(); // Starts scanning

//   if (result.hasContent) {
//     alert(`Scanned: ${result.content}`);
//   } else {
//     alert('No barcode found.');
//   }

//   await BarcodeScanner.showBackground(); // Restore webview
//   document.body.classList.remove('scanner-active');
// }

// }





// import { CommonModule } from '@angular/common';
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { IonicModule, PopoverController } from '@ionic/angular';
// import { FooterTabsComponent } from "../components/footer-tabs/footer-tabs.component";
// import { Router } from '@angular/router';
// import { MenuPopoverComponent } from '../components/menu-popover/menu-popover.component';
// import { FormsModule } from '@angular/forms';
// import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
// import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
// import { ApiService } from '../services/api/api.service';
// import { Platform } from '@ionic/angular';

// @Component({
//   selector: 'app-home-screen',
//   templateUrl: './home-screen.page.html',
//   styleUrls: ['./home-screen.page.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule, FooterTabsComponent, FormsModule]
// })
// export class HomeScreenPage implements OnInit, OnDestroy {

//   constructor(
//     private router: Router,
//     private popoverCtrl: PopoverController,
//     private service: ApiService,
//     private platform: Platform
//   ) { }

//   searchText: string = '';
//   selectedFilter: string = 'all';
//   currUserId: string | null = localStorage.getItem("phone_number");
//   scannedText: string = '';
//   capturedImage: string = '';

//   chatList: any[] = [];
//   galleryImages: string[] = [];

//   ngOnInit() {
//     // this.fetchAllUsers();
//     this.getAllUsers();

//     if (this.platform.is('ios')) {
//       document.body.classList.add('is-ios');
//     }

//   }

//   ngOnDestroy(): void {
//     // Nothing to clean up in this version
//   }

//   // fetchAllUsers() {
//   //   const allUsers = [
//   //     {
//   //       name: 'Karan',
//   //       receiver_Id: '9138152160',
//   //       phone_number: '+919138152160',
//   //       message: 'Hello',
//   //       messageStatus: 'sent',
//   //       unread: false,
//   //       time: '10:00 AM',
//   //       unreadCount: 0,
//   //       group: false
//   //     },
//   //     {
//   //       name: 'Khushboo',
//   //       receiver_Id: '7700075618',
//   //       phone_number: '+917700075618',
//   //       message: 'How are you?',
//   //       messageStatus: 'received',
//   //       unread: true,
//   //       time: '11:00 AM',
//   //       unreadCount: 2,
//   //       group: false
//   //     },
//   //     {
//   //       name: 'khushi',
//   //       receiver_Id: '7700075619',
//   //       phone_number: '+917700075619',
//   //       message: '?',
//   //       messageStatus: 'received',
//   //       unread: true,
//   //       time: '1:00 AM',
//   //       unreadCount: 2,
//   //       group: false
//   //     }
//   //   ];

//   //   const currentUser = this.currUserId?.toString();
//   //   this.chatList = allUsers.filter(u => u.phone_number !== currentUser);
//   // }

//   getAllUsers() {
//     const currentUserPhone = localStorage.getItem('phone_number'); // e.g. "+919138152160"

//     this.service.getAllUsers().subscribe((users: any[]) => {
//       users.forEach(user => {
//         // Compare with phone number from localStorage
//         if (user.phone_number !== currentUserPhone) {
//           this.service.getUserProfilebyId(user.user_id.toString()).subscribe((profile: any) => {
//             const receiverId = profile.phone_number;

//             // Add to chatList with receiver_Id
//             this.chatList.push({
//               ...user,
//               receiver_Id: receiverId
//             });
//           });
//         }
//       });
//     });
//   }



//   // getAllUsers() {
//   //     this.service.getAllUsers().subscribe((users: any[]) => {
//   //       const currentUser = this.currUserId?.toString();
//   //       this.chatList = users.filter(u => u.phone_number !== currentUser);
//   //     });
//   //   }

//   get filteredChats() {
//     let filtered = this.chatList;

//     if (this.selectedFilter === 'read') {
//       filtered = filtered.filter(chat => !chat.unread);
//     } else if (this.selectedFilter === 'unread') {
//       filtered = filtered.filter(chat => chat.unread);
//     } else if (this.selectedFilter === 'groups') {
//       filtered = filtered.filter(chat => chat.group);
//     }

//     if (this.searchText.trim() !== '') {
//       const searchLower = this.searchText.toLowerCase();
//       filtered = filtered.filter(chat =>
//         chat.name.toLowerCase().includes(searchLower) ||
//         chat.message.toLowerCase().includes(searchLower)
//       );
//     }

//     return filtered;
//   }

//   get totalUnreadCount(): number {
//     return this.chatList.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
//   }

//   setFilter(filter: string) {
//     this.selectedFilter = filter;
//   }

//   // openChat(chat: any) {
//   //   console.log("receiver_id",chat.receiver_Id);
//   //   this.router.navigate(['/chatting-screen'], {
//   //     queryParams: { receiverId: chat.receiver_Id }
//   //   });
//   // }


//   openChat(chat: any) {
//     let rawPhone = chat.receiverId || chat.receiver_Id;

//     // Remove "+91" or any non-digit characters and take last 10 digits
//     const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);

//     console.log("Cleaned receiverId:", cleanPhone);

//     this.router.navigate(['/chatting-screen'], {
//       queryParams: { receiverId: cleanPhone }
//     });
//   }

//   async presentPopover(ev: any) {
//     const popover = await this.popoverCtrl.create({
//       component: MenuPopoverComponent,
//       event: ev,
//       translucent: true,
//     });
//     await popover.present();
//   }

//   goToContact() {
//     this.router.navigate(['/contact-screen']);
//   }

//   async openCamera() {
//     try {
//       const image = await Camera.getPhoto({
//         source: CameraSource.Camera,
//         quality: 90,
//         resultType: CameraResultType.Uri,
//       });

//       this.capturedImage = image.webPath!;
//     } catch (error) {
//       console.error('Camera error:', error);
//     }
//   }

//   async scanBarcode() {
//     const status = await BarcodeScanner.checkPermission({ force: true });

//     if (!status.granted) {
//       alert('Camera permission is required.');
//       return;
//     }

//     await BarcodeScanner.hideBackground();
//     document.body.classList.add('scanner-active');

//     const result = await BarcodeScanner.startScan();

//     if (result.hasContent) {
//       alert(`Scanned: ${result.content}`);
//     } else {
//       alert('No barcode found.');
//     }

//     await BarcodeScanner.showBackground();
//     document.body.classList.remove('scanner-active');
//   }
// }




import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { FooterTabsComponent } from "../components/footer-tabs/footer-tabs.component";
import { Router } from '@angular/router';
import { MenuPopoverComponent } from '../components/menu-popover/menu-popover.component';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ApiService } from '../services/api/api.service';
import { Platform } from '@ionic/angular';

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
    private platform: Platform
  ) { }

  searchText: string = '';
  selectedFilter: string = 'all';
  currUserId: string | null = localStorage.getItem("phone_number");
  scannedText: string = '';
  capturedImage: string = '';

  chatList: any[] = [];
  galleryImages: string[] = [];

  ngOnInit() {
    this.getAllUsers();

    if (this.platform.is('ios')) {
      document.body.classList.add('is-ios');
    }
  }

  ngOnDestroy(): void {}

  getAllUsers() {
    const currentUserPhone = localStorage.getItem('phone_number');

    this.service.getAllUsers().subscribe((users: any[]) => {
      users.forEach(user => {
        if (user.phone_number !== currentUserPhone) {
          this.service.getUserProfilebyId(user.user_id.toString()).subscribe((profile: any) => {
            const receiverId = profile.phone_number;

            this.chatList.push({
              ...user,
              receiver_Id: receiverId
            });
          });
        }
      });
    });
  }

  get filteredChats() {
    let filtered = this.chatList;

    if (this.selectedFilter === 'read') {
      filtered = filtered.filter(chat => !chat.unread);
    } else if (this.selectedFilter === 'unread') {
      filtered = filtered.filter(chat => chat.unread);
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

    return filtered;
  }

  get totalUnreadCount(): number {
    return this.chatList.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

  openChat(chat: any) {
    let rawPhone = chat.receiverId || chat.receiver_Id;
    const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);
    this.router.navigate(['/chatting-screen'], {
      queryParams: { receiverId: cleanPhone }
    });
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: MenuPopoverComponent,
      event: ev,
      translucent: true,
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
        resultType: CameraResultType.Uri,
      });

      this.capturedImage = image.webPath!;
    } catch (error) {
      console.error('Camera error:', error);
    }
  }

  async scanBarcode() {
    const status = await BarcodeScanner.checkPermission({ force: true });

    if (!status.granted) {
      alert('Camera permission is required.');
      return;
    }

    await BarcodeScanner.hideBackground();
    document.body.classList.add('scanner-active');

    const result = await BarcodeScanner.startScan();

    if (result.hasContent) {
      alert(`Scanned: ${result.content}`);
    } else {
      alert('No barcode found.');
    }

    await BarcodeScanner.showBackground();
    document.body.classList.remove('scanner-active');
  }
}
