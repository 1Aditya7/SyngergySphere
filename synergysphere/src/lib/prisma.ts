// Temporary stub to imports resolve in dev.
const notReady = () => {
  throw new Error("Prisma is not configured on this branch. Merge auth-chat/setup first.");
};

export const prisma: any = new Proxy({}, {
  get() { return notReady; }
});
