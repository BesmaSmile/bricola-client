export function formatPhone(phoneNumber) {
  let formattedNumber = '';
  const cleaned = clean(phoneNumber);
  if (cleaned.length > 0) {
    formattedNumber = `${cleaned.substring(0, 3)}`;
  }
  if (cleaned.length > 3) {
    formattedNumber += ` ${cleaned.substring(3, 5)}`;
  }
  if (cleaned.length > 5) {
    formattedNumber += ` ${cleaned.substring(5, 7)}`;
  }
  if (cleaned.length > 7) {
    formattedNumber += ` ${cleaned.substring(7, 9)}`;
  }
  return formattedNumber;
}

export function clean(phoneNumber) {
  return phoneNumber.replace(/\D/g, '');
}
