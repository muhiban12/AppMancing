// utils/fileUpload.ts
export const createFormData = (
  fields: { [key: string]: any },
  files: { [key: string]: any } = {}
): FormData => {
  const formData = new FormData();
  
  // Add regular fields
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !value.uri) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  // Add files
  Object.entries(files).forEach(([key, file]) => {
    if (file && file.uri) {
      const fileObject = {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.fileName || file.name || `${key}_${Date.now()}.jpg`
      };
      formData.append(key, fileObject as any);
    }
  });
  
  return formData;
};