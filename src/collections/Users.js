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
    create: async ({ req }) => {
      const cookieHeader = req?.headers?.get?.("cookie") || "";
      const match = cookieHeader.match(/payload-token=([^;]+)/);
      const tokenSnippet = match ? `${match[1].slice(0, 20)}…${match[1].slice(-10)}` : "(none)";
      let jwtErr = null;
      if (match) {
        try {
          const { jwtVerify } = await import("jose");
          const secret = new TextEncoder().encode(req?.payload?.secret || "");
          await jwtVerify(match[1], secret);
        } catch (e) {
          jwtErr = e?.message || String(e);
        }
      }
      req?.payload?.logger?.info({
        msg: `[users.create v3] hasUser=${Boolean(req?.user)} origin=${req?.headers?.get?.("origin") || "(none)"} secret_len=${req?.payload?.secret?.length} token=${tokenSnippet} jwt_err=${jwtErr || "(none)"}`,
      });
      return Boolean(req?.user);
    },
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
};

export default Users;
