export const generateFallbackAvatar = (name: string | null) => {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";
  const hue = name ? name.charCodeAt(0) % 360 : 200; // Generate a consistent color based on name
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><rect width='40' height='40' fill='hsl(${hue}, 50%, 60%)'/><text x='50%' y='50%' font-size='16' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='Arial'>${initials}</text></svg>`;
};
