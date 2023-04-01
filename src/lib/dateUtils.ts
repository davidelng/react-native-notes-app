export function dateFormatter(date: string) {
  let timestamp: Date | string = new Date(date);
  let now = new Date();
  let delta = Math.floor(
    (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)
  );

  if (delta < 1) {
    let minuti = Math.floor((now.getTime() - timestamp.getTime()) / 60000);
    timestamp = minuti > 1 ? minuti + " minuti fa" : "Meno di un minuto fa";
  } else if (delta === 1) {
    timestamp = "Un'ora fa";
  } else if (delta < 24) {
    timestamp = delta + " ore fa";
  } else {
    timestamp = timestamp.toLocaleString("it-IT", {
      hour: "numeric",
      minute: "numeric",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return timestamp;
}

export function getDateForCreation() {
  return new Date().toLocaleDateString("it-IT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
