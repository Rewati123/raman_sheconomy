import { put } from "@vercel/blob";

async function saveImage(file) {
  if (!file) return null;

  const fileExtension = extname(file.name);
  const fileName = `${Date.now()}${fileExtension}`;

  const { url } = await put(fileName, file, {
    access: "public",  
  });

  return url; 
}
