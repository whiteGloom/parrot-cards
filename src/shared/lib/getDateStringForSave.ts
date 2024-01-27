export function getDateStringForSave() {
  const date = new Date();

  const dateString = `${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear()}`;

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const timeString = `${hours > 9 ? hours : `0${hours}`}.${minutes > 9 ? minutes : `0${minutes}`}`;

  return `${dateString}-${timeString}`;
}
