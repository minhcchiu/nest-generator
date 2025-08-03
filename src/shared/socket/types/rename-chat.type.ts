export type RenameChat = {
  chatId: string;
  newChatName: string;

  senderId: string;
  receiverIds: string[];
};
