export async function saveImage(file) {
    if (!file) return null;
    
    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Make API call to save the image
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      return data.filePath; // Return the path where the image was saved
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  }