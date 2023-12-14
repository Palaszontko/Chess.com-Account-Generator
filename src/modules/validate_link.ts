export function validateChessGameLink(input: string): boolean {
    const regex = /^https:\/\/www\.chess\.com\/game\/live\/\d+$/;
  
    return regex.test(input);
  }