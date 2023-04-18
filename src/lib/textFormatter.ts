export function formatPreview(str: string): string {
  str = str.trim();
  let lines = str.split(/\r\n|\r|\n/);
  if (lines.length > 2) {
    return lines[0] + "\n" + lines[1] + "\n...";
  } else if (str.length > 120) {
    return str.slice(0, 140) + "...";
  } else {
    return str;
  }
}
