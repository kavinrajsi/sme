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
      const tokenSnippet = match
        ? `${match[1].slice(0, 16)}…${match[1].slice(-8)}`
        : "(none)";
      let jwtErr = null;
      let jwtPayload = null;
      if (match) {
        try {
          const { jwtVerify } = await import("jose");
          const secret = new TextEncoder().encode(req?.payload?.secret || "");
          const verified = await jwtVerify(match[1], secret);
          jwtPayload = verified.payload;
        } catch (e) {
          jwtErr = e?.code || e?.message || String(e);
        }
      }
      const debug = {
        hasUser: Boolean(req?.user),
        origin: req?.headers?.get?.("origin") || "(none)",
        host: req?.headers?.get?.("host") || "(none)",
        secret_len: req?.payload?.secret?.length || 0,
        token: tokenSnippet,
        jwt_err: jwtErr || "(none)",
        jwt_id: jwtPayload?.id ?? "(none)",
        jwt_collection: jwtPayload?.collection ?? "(none)",
        jwt_exp: jwtPayload?.exp
          ? new Date(jwtPayload.exp * 1000).toISOString()
          : "(none)",
      };
      req?.payload?.logger?.info({ msg: `[users.create v4] ${JSON.stringify(debug)}` });
      if (!req?.user) {
        // Surface the same info in the response so the admin toast / DevTools
        // Network tab shows it without needing a Vercel-logs trip.
        const err = new Error(`Forbidden — ${JSON.stringify(debug)}`);
        err.status = 403;
        throw err;
      }
      return true;
    },
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
};

export default Users;
