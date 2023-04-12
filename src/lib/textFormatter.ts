export function formatPreview(str: string): string {
  let lines = str.split(/\r\n|\r|\n/);
  if (lines.length > 2) {
    return lines[0] + lines[1] + "\n...";
  } else if (str.length > 120) {
    return str.slice(0, 120) + "...";
  } else {
    return str;
  }
}
