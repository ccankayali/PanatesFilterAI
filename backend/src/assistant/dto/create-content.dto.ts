export type MessageRole = 'user' | 'assistant';

export class CreateContentDto {
  content: string;
  threadId: string;
  role: MessageRole;
}
