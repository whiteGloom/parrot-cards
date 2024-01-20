export const saveToFileSystem = (data: string, fileName: string, type: string): void => {
  const file = new Blob([data], {type});
  const fileUrl = URL.createObjectURL(file);

  const saveLinkButton = document.createElement('a');

  saveLinkButton.href = fileUrl;
  saveLinkButton.download = fileName;
  saveLinkButton.style.display = 'none';

  document.body.appendChild(saveLinkButton);
  saveLinkButton.click();
  document.body.removeChild(saveLinkButton);
};

