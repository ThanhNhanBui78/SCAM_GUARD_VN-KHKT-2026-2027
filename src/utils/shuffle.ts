// Trả về bản sao đã xáo trộn (Fisher-Yates). Dùng để đáp án đúng không luôn nằm cùng một vị trí.
export function shuffled<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
