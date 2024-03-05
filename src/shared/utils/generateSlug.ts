export function generateSlug(title: string, postId: string): string {
  const titlePart = title.slice(0, 10).toLowerCase().replace(/ /g, '-');
  const idPart = postId.slice(0, 8);
  const slug = `${titlePart}-${idPart}`;
  return slug;
}
