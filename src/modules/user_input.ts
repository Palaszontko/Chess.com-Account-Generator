export function getUserInput(question: string): Promise<string> {
    return new Promise((resolve) => {
      const stdin = process.openStdin();
      process.stdout.write(question);
  
      stdin.addListener('data', (data) => {
        const input = data.toString().trim();
        resolve(input);
      });
    });
  }
  