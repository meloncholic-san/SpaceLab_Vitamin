const GUEST_KEY = 'guest_id';

export function getGuestId() {
  let guestId = localStorage.getItem(GUEST_KEY);

  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem(GUEST_KEY, guestId);
  }

  return guestId;
}