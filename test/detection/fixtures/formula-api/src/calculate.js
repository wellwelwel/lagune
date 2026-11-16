export const calculate = (expression) => Function(`return (${expression});`)();
