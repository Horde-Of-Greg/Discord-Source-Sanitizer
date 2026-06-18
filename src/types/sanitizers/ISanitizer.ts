export interface ISanitizer {
    exec(messageContent: string): string;
}
