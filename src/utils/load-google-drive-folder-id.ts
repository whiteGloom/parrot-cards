export async function loadGoogleDriveFolderId() {
  const existingParentFolder = await gapi.client.drive.files.list({
    q: 'mimeType = \'application/vnd.google-apps.folder\' and trashed = false and \'root\' in parents and name = \'Parrot Cards\'',
    fields: 'files(id, name, mimeType, parents)',
    pageSize: 1,
  });

  if (!existingParentFolder.result.files?.length) {
    const newFolder = await gapi.client.drive.files.create({
      resource: {
        name: 'Parrot Cards',
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id, name, mimeType, parents',
    });
    return newFolder.result.id;
  }
  else {
    return existingParentFolder.result.files[0].id;
  }
}
