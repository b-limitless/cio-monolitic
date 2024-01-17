
export function generateUniqueNumber() {
    const usedIds = new Set();
    while (true) {
      const randomNumber = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit number
      const uniqueNumber = randomNumber.toString();
  
      if (!usedIds.has(uniqueNumber)) {
        usedIds.add(uniqueNumber);
        return uniqueNumber;
      }
    }
  }