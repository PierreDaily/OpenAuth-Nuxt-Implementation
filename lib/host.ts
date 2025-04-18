export const generateUrl = (path: string) => {
  return new URL(path, "http://localhost:3000").toString();
};
