export function isAISender(sender: any) {
  return (
    !!sender &&
    typeof sender === "object" &&
    "name" in sender &&
    ["AI", "HORDE_AI"].includes(sender.name)
  );
}

export function isUserSender(sender: any) {
  return (
    !!sender &&
    typeof sender === "object" &&
    "_id" in sender
  );
}
