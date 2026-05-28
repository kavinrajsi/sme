const Users = {
  slug: "users",
  auth: true,
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
        msg: `[users.create access] hasUser=${hasUser} email=${req?.user?.email || "(none)"} collection=${req?.user?.collection || "(none)"}`,
      });
      return hasUser;
    },
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
};

export default Users;
