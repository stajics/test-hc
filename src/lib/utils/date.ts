export const formatReleaseDate = (date?: string) => {
  return date
    ? new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown release date";
};
