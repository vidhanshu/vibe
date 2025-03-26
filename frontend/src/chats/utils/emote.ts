export function isOnlyEmojis(message: string): boolean {
  message = message.trim();
  const emojiRegex = /^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u;
  return emojiRegex.test(message);
}
