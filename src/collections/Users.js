const jwtCookieStrategy = {
  name: "jwt-cookie",
  authenticate: async ({ headers, payload }) => {
    try {
      const cookieHeader = headers.get("cookie") || headers.get("Cookie") || "";
      const match = cookieHeader.match(/payload-token=([^;]+)/);
      if (!match) return { user: null };
      const { jwtVerify } = await import("jose");
      const secret = new TextEncoder().encode(payload.secret);
      const { payload: decoded } = await jwtVerify(match[1], secret);
      if (!decoded?.id || !decoded?.collection) return { user: null };
      const user = await payload.findByID({
        collection: decoded.collection,
        id: decoded.id,
      });
      if (!user) return { user: null };
      user.collection = decoded.collection;
      user._strategy = "jwt-cookie";
      return { user };
    } catch (err) {
      payload.logger.info({ msg: `[jwt-cookie strategy] ${err?.message || err}` });
      return { user: null };
    }
  },
};

const Users = {
  slug: "users",
  auth: {
    useSessions: false,
    strategies: [jwtCookieStrategy],
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
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
};

export default Users;
