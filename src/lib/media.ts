export const VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "m4v", "ogv", "ogg"];

export const isVideoUrl = (url?: string | null): boolean => {
  if (!url) return false;
  const clean = url.split("?")[0].split("#")[0].toLowerCase();
  const ext = clean.split(".").pop();
  return !!ext && VIDEO_EXTENSIONS.includes(ext);
};

export const isVideoFile = (file: File): boolean => {
  if (file.type?.startsWith("video/")) return true;
  return isVideoUrl(file.name);
};
