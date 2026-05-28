const Users = {
  slug: "users",
  auth: {
    useSessions: false,
  },
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
  ],
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => {
      const hasUser = Boolean(req?.user);
      req?.payload?.logger?.info({
        msg: `[users.create access v2] hasUser=${hasUser} email=${req?.user?.email || "(none)"} collection=${req?.user?.collection || "(none)"} cookie=${req?.headers?.get?.("cookie")?.includes("payload-token") ? "yes" : "no"}`,
      });
      return hasUser;
    },
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
};

export default Users;
