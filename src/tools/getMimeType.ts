export default function getMimeType(extension: string) {
  if (!extension) throw new Error('Extension must be defined');
  if (extension[0] === ".") {
    extension = extension.substring(1);
  }
  const type = {
    "bmp": "image/bmp",
    "gif": "image/gif",
    "ico": "image/vnd.microsoft.icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "svg": "image/svg+xml",
    "tif": "image/tiff",
    "tiff": "image/tiff",
    "webp": "image/webp",
    "pdf": "application/pdf",
  }[extension.toLowerCase()]

  if (!type) {
    throw new Error(`Extension "${extension}" is not supported`);
  }

  return type;
}