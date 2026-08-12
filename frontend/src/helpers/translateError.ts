export function translateError(message: string): string {
  if (!message) return "Ocorreu um erro inesperado. Tente novamente.";

  // Pattern check for Category already exists
  if (message.startsWith('Category "') && message.endsWith('" already exists.')) {
    const name = message.substring(10, message.length - 17);
    return `A categoria "${name}" já existe.`;
  }

  // Pattern check for Food already exists
  if (message.startsWith('Food "') && message.endsWith('" already exists.')) {
    const name = message.substring(6, message.length - 17);
    return `O alimento "${name}" já existe.`;
  }

  // Pattern check for User already exists
  if (message.startsWith('User "') && message.endsWith('" already exists.')) {
    const identifier = message.substring(6, message.length - 17);
    return `O usuário "${identifier}" já está cadastrado.`;
  }

  // Credentials are not valid
  if (message.toLowerCase().includes("credentials are not valid")) {
    return "E-mail ou senha incorretos.";
  }

  // Start date must be before end date
  if (message.toLowerCase().includes("start date must be before end date")) {
    return "A data de início deve ser anterior à data de término.";
  }

  // Quantity consumed cannot be greater than quantity served
  if (message.toLowerCase().includes("quantity consumed cannot be greater than quantity served")) {
    return "A quantidade consumida não pode ser maior que a quantidade servida.";
  }

  return message; // Fallback to raw message if no translation pattern matches
}
