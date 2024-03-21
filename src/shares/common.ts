export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function generateRandomUsername(): string {
  const usernameLength = Math.floor(Math.random() * 10) + 5;
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let username = "";

  // Generate random username
  for (let i = 0; i < usernameLength; i++) {
    username += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return username;
}

export function generateRandomEmail(): string {
  const domainLength = Math.floor(Math.random() * 5) + 5; // Random length between 5 and 9

  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let username = "";
  let domain = "";

  // Generate random username
  username = generateRandomUsername();

  // Generate random domain
  for (let i = 0; i < domainLength; i++) {
    domain += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return `${username}@${domain}.com`;
}

export function generateRandomString(): string {
  const domainLength = Math.floor(Math.random() * 5) + 5; // Random length between 5 and 9

  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let string = "";
  // Generate random domain
  for (let i = 0; i < domainLength; i++) {
    string += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return string;
}
