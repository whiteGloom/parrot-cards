export const saveToFileSystem = (data: string, fileName: string, type: string): void => {
  const file = new Blob([data], {type});
  const fileUrl = URL.createObjectURL(file);

  const saveLinkButton = document.createElement('a');
  saveLinkButton.style.display = 'none';
  document.body.appendChild(saveLinkButton);
  saveLinkButton.href = fileUrl;
  saveLinkButton.download = fileName;
  saveLinkButton.click();
  document.body.removeChild(saveLinkButton);
};

