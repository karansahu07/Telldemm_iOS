import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonicModule, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Keyboard } from '@capacitor/keyboard';
import { FirebaseChatService } from 'src/app/services/firebase-chat.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { getDatabase, ref, get } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

interface Message{
  key?: any;
  message_id : string;
  sender_id : string;
  sender_phone : string;
  sender_name : string;
  receiver_id? : string;
  receiver_phone? : string;
  type? : "text" | "audio" | "video" | "image";
  text? : string;
  url? : string;
  delivered : boolean;
  read : boolean;
  timestamp : string;
  time? : string;
}

@Component({
  selector: 'app-chatting-screen',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './chatting-screen.page.html',
  styleUrls: ['./chatting-screen.page.scss']
})
export class ChattingScreenPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  @ViewChild(IonContent, { static: false }) ionContent!: IonContent;

  messages: Message[] = [];
  groupedMessages: { date: string; messages: Message[] }[] = [];

  messageText = '';
  receiverId = '';
  senderId = '';
  sender_phone = '';
  sender_name = '';
  receiver_phone = '';
  private messageSub?: Subscription;
  showSendButton = false;
  private keyboardListeners: any[] = [];

  private chatService = inject(FirebaseChatService);
  private route = inject(ActivatedRoute);
  private platform = inject(Platform);
  private encryptionService = inject(EncryptionService);
  private router = inject(Router);

  roomId = '';
  limit = 10;
  page = 0;
  isLoadingMore = false;
  hasMoreMessages = true;
  chatType: 'private' | 'group' = 'private';
  groupName = '';
  isGroup: any;
  receiver_name = '';

  async ngOnInit() {
  // Enable proper keyboard scrolling
  Keyboard.setScroll({ isDisabled: false });
  await this.initKeyboardListeners();

  // Load sender (current user) details
  this.senderId = localStorage.getItem('userId') || '';
  this.sender_phone = localStorage.getItem('phone_number') || '';
  this.sender_name = localStorage.getItem('name') || '';
  this.receiver_name = localStorage.getItem('receiver_name') || '';

  // Get query parameters
  const rawId = this.route.snapshot.queryParamMap.get('receiverId') || '';
  const chatTypeParam = this.route.snapshot.queryParamMap.get('isGroup');
  const phoneFromQuery = this.route.snapshot.queryParamMap.get('receiver_phone');

  // Determine chat type
  this.chatType = chatTypeParam === 'true' ? 'group' : 'private';

  if (this.chatType === 'group') {
    // Group chat
    this.roomId = decodeURIComponent(rawId);
    await this.fetchGroupName(this.roomId);
  } else {
    // Individual chat
    this.receiverId = decodeURIComponent(rawId);
    this.roomId = this.getRoomId(this.senderId, this.receiverId);

    // Use receiver_phone from query or fallback to localStorage
    this.receiver_phone = phoneFromQuery || localStorage.getItem('receiver_phone') || '';
    // Store for reuse when navigating to profile
    localStorage.setItem('receiver_phone', this.receiver_phone);
  }

  // Reset unread count and mark messages as read
  await this.chatService.resetUnreadCount(this.roomId, this.senderId);
  await this.markMessagesAsRead();

  // Load and render messages
  this.loadFromLocalStorage();
  this.listenForMessages();

  // Scroll to bottom after short delay
  setTimeout(() => this.scrollToBottom(), 100);
}


  private async markMessagesAsRead() {
    const lastMessage = this.messages[this.messages.length - 1];
    if (lastMessage && lastMessage.sender_id !== this.senderId) {
      await this.chatService.resetUnreadCount(this.roomId, this.senderId);
    }
  }

  async fetchGroupName(groupId: string) {
    try {
      const db = getDatabase();
      const groupRef = ref(db, `groups/${groupId}`);
      const snapshot = await get(groupRef);

      if (snapshot.exists()) {
        const groupData = snapshot.val();
        this.groupName = groupData.name || 'Group';
      } else {
        this.groupName = 'Group';
      }
    } catch (error) {
      console.error('Error fetching group name:', error);
      this.groupName = 'Group';
    }
  }

  ngAfterViewInit() {
    if (this.ionContent) {
      this.ionContent.ionScroll.subscribe(async (event: any) => {
        if (event.detail.scrollTop < 50 && this.hasMoreMessages && !this.isLoadingMore) {
          this.page += 1;
          this.loadMessagesFromFirebase(true);
        }
      });
    }
  }

  getRoomId(userA: string, userB: string): string {
    return userA < userB ? `${userA}_${userB}` : `${userB}_${userA}`;
  }


  async listenForMessages() {
  this.messageSub = this.chatService.listenForMessages(this.roomId).subscribe(async (data) => {
    const decryptedMessages: Message[] = [];

    for (const msg of data) {
      const decryptedText = await this.encryptionService.decrypt(msg.text);
      decryptedMessages.push({ ...msg, text: decryptedText });

      // ✅ Mark as delivered if current user is the receiver and not already delivered
      console.log(msg);
      if (
        msg.receiver_id === this.senderId && !msg.delivered
      ) {
        this.chatService.markDelivered(this.roomId, msg.key);
      }
    }

    this.messages = decryptedMessages;
    this.groupedMessages = this.groupMessagesByDate(decryptedMessages);
    this.saveToLocalStorage();

    const last = decryptedMessages[decryptedMessages.length - 1];
    if (last) {
      localStorage.setItem(`lastMsg_${this.roomId}`, JSON.stringify({
        text: last.text,
        timestamp: last.timestamp
      }));
    }

    setTimeout(() => {
      this.scrollToBottom();
      this.observeVisibleMessages(); // 👁️ Call visibility tracking after messages rendered
    }, 100);
  });
}


observeVisibleMessages() {
  const allMessageElements = document.querySelectorAll('[data-msg-key]');

  allMessageElements.forEach((el: any) => {
    const msgKey = el.getAttribute('data-msg-key');
    const msgIndex = this.messages.findIndex(m => m.key === msgKey);
    if (msgIndex === -1) return;

    const msg = this.messages[msgIndex];
    console.log(msg);

    if (!msg.read && msg.receiver_id === this.senderId) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // ✅ Mark as read when visible
            this.chatService.markRead(this.roomId, msgKey);
            observer.unobserve(entry.target); // stop observing
          }
        });
      }, {
        threshold: 1.0
      });

      observer.observe(el);
    }
  });
}

  groupMessagesByDate(messages: Message[]) {
  const grouped: { [date: string]: any[] } = {};

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  messages.forEach(msg => {
    const timestamp = new Date(msg.timestamp); // convert to Date object

    // Format time (e.g., "6:15 PM")
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const timeStr = `${formattedHours}:${formattedMinutes} ${ampm}`;
    msg.time = timeStr;

    // Label logic
    const isToday =
      timestamp.getDate() === today.getDate() &&
      timestamp.getMonth() === today.getMonth() &&
      timestamp.getFullYear() === today.getFullYear();

    const isYesterday =
      timestamp.getDate() === yesterday.getDate() &&
      timestamp.getMonth() === yesterday.getMonth() &&
      timestamp.getFullYear() === yesterday.getFullYear();

    let label = '';
    if (isToday) {
      label = 'Today';
    } else if (isYesterday) {
      label = 'Yesterday';
    } else {
      // Format as DD/MM/YYYY
      const dd = timestamp.getDate().toString().padStart(2, '0');
      const mm = (timestamp.getMonth() + 1).toString().padStart(2, '0');
      const yyyy = timestamp.getFullYear();
      label = `${dd}/${mm}/${yyyy}`;
    }

    if (!grouped[label]) {
      grouped[label] = [];
    }
    grouped[label].push(msg);
  });

  return Object.keys(grouped).map(date => ({
    date,
    messages: grouped[date]
  }));
}


  async loadFromLocalStorage() {
    const cached = localStorage.getItem(this.roomId);
    const rawMessages = cached ? JSON.parse(cached) : [];
    const decryptedMessages = [];

    for (const msg of rawMessages) {
      const decryptedText = await this.encryptionService.decrypt(msg.text);
      decryptedMessages.push({ ...msg, text: decryptedText });
    }

    this.messages = decryptedMessages;
    this.groupedMessages = this.groupMessagesByDate(decryptedMessages);
  }

  async sendMessage() {
    if (!this.messageText.trim()) return;
    console.log(this.sender_phone);
    console.log("fdgsg", this.senderId);
    const date = new Date();
    const plainText = this.messageText.trim();
    const encryptedText = await this.encryptionService.encrypt(plainText);

    const message: Message = {
      sender_id: this.senderId,
      text: encryptedText,
      timestamp: String(new Date()),
      sender_phone: this.sender_phone,
      sender_name: this.sender_name,
      receiver_id: '',
      receiver_phone: this.receiver_phone,
      delivered: false,
      read: false,
      message_id: uuidv4()
    };

    console.log(message);

    if (this.chatType === 'private') {
      message.receiver_id = this.receiverId;
    }

    this.chatService.sendMessage(this.roomId, message, this.chatType, this.senderId);

    this.messageText = '';
    this.showSendButton = false;
    this.scrollToBottom();
  }

  loadMessagesFromFirebase(isPagination = false) {}

  goToProfile() {
  const queryParams: any = {
    receiverId: this.chatType === 'group' ? this.roomId : this.receiverId,
    receiver_phone: this.receiver_phone,
    isGroup: this.chatType === 'group'
  };

  this.router.navigate(['/profile-screen'], { queryParams });
}


  saveToLocalStorage() {
    localStorage.setItem(this.roomId, JSON.stringify(this.messages));
  }

  scrollToBottom() {
    if (this.ionContent) {
      setTimeout(() => {
        this.ionContent.scrollToBottom(300);
      }, 100);
    }
  }

  onInputChange() {
    this.showSendButton = this.messageText?.trim().length > 0;
  }

  onInputFocus() {
    setTimeout(() => {
      this.adjustFooterPosition();
      this.scrollToBottom();
    }, 300);
  }

  onInputBlur() {
    setTimeout(() => {
      this.resetFooterPosition();
    }, 300);
  }

  goToCallingScreen() {
    this.router.navigate(['/calling-screen']);
  }

  async initKeyboardListeners() {
    if (this.platform.is('capacitor')) {
      try {
        const showListener = await Keyboard.addListener('keyboardWillShow', (info) => {
          this.handleKeyboardShow(info.keyboardHeight);
        });

        const hideListener = await Keyboard.addListener('keyboardWillHide', () => {
          this.handleKeyboardHide();
        });

        this.keyboardListeners.push(showListener, hideListener);
      } catch (error) {
        this.setupFallbackKeyboardDetection();
      }
    } else {
      this.setupFallbackKeyboardDetection();
    }
  }

  ngOnDestroy() {
    this.keyboardListeners.forEach(listener => listener?.remove());
    this.messageSub?.unsubscribe();
  }

// ... keyboard adjustment methods (same as your existing implementation)
  private handleKeyboardShow(keyboardHeight: number) {
    const footer = document.querySelector('.footer-fixed') as HTMLElement;
    const chatMessages = document.querySelector('.chat-messages') as HTMLElement;
    const ionContent = document.querySelector('ion-content') as HTMLElement;

    if (footer) footer.style.bottom = `${keyboardHeight}px`;
    if (chatMessages) chatMessages.style.paddingBottom = `${keyboardHeight + 80}px`;
    if (ionContent) ionContent.style.paddingBottom = `${keyboardHeight}px`;

    setTimeout(() => this.scrollToBottom(), 350);
  }

  private handleKeyboardHide() {
    const footer = document.querySelector('.footer-fixed') as HTMLElement;
    const chatMessages = document.querySelector('.chat-messages') as HTMLElement;
    const ionContent = document.querySelector('ion-content') as HTMLElement;

    if (footer) footer.style.bottom = '0px';
    if (chatMessages) chatMessages.style.paddingBottom = '80px';
    if (ionContent) ionContent.style.paddingBottom = '0px';
  }

  private setupFallbackKeyboardDetection() {
    let initialViewportHeight = window.visualViewport?.height || window.innerHeight;
    let initialChatPadding = 80;

    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const heightDifference = initialViewportHeight - currentHeight;

      const footer = document.querySelector('.footer-fixed') as HTMLElement;
      const chatMessages = document.querySelector('.chat-messages') as HTMLElement;
      const ionContent = document.querySelector('ion-content') as HTMLElement;

      if (heightDifference > 150) {
        if (footer) footer.style.bottom = `${heightDifference}px`;
        if (chatMessages) chatMessages.style.paddingBottom = `${heightDifference + initialChatPadding}px`;
        if (ionContent) ionContent.style.paddingBottom = `${heightDifference}px`;
        setTimeout(() => this.scrollToBottom(), 310);
      } else {
        if (footer) footer.style.bottom = '0px';
        if (chatMessages) chatMessages.style.paddingBottom = `${initialChatPadding}px`;
        if (ionContent) ionContent.style.paddingBottom = '0px';
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    } else {
      window.addEventListener('resize', handleViewportChange);
    }
  }

  private adjustFooterPosition() {
    const footer = document.querySelector('.footer-fixed') as HTMLElement;
    const chatMessages = document.querySelector('.chat-messages') as HTMLElement;
    if (footer) footer.classList.add('keyboard-active');
    if (chatMessages) chatMessages.classList.add('keyboard-active');
  }

  private resetFooterPosition() {
    const footer = document.querySelector('.footer-fixed') as HTMLElement;
    const chatMessages = document.querySelector('.chat-messages') as HTMLElement;
    if (footer) footer.classList.remove('keyboard-active');
    if (chatMessages) chatMessages.classList.remove('keyboard-active');
  }
}
