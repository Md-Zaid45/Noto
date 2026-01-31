export function getImageUrl(files) {
  let url = null;
  if (files && files.length > 0) {
    for (let item of files) {
      if (item.type.startsWith("image")) url = URL.createObjectURL(item);
    }
  }
  if (url) return url;
}
