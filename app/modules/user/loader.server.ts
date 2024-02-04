import {
    json,
    type ActionFunctionArgs,
    type LoaderFunctionArgs,
} from "@remix-run/node";

import type {
    ActionExtendedFunction,
    ActionExtendedFunctionArgs,
    LoaderExtendedFunction,
    LoaderExtendedFunctionArgs,
} from "~/utils/loader";

import { requireAuthSession, type AuthSession } from "../auth";

type AuthSessionContext = {
    authSession: AuthSession;
};

type ConnectedActionFunctionArgs =
    ActionExtendedFunctionArgs<AuthSessionContext>;
type ConnectedLoaderFunctionArgs =
    LoaderExtendedFunctionArgs<AuthSessionContext>;
    
function requireUserLoader(
    loader?:
        | ActionExtendedFunction<AuthSessionContext>
        | LoaderExtendedFunction<AuthSessionContext>,
) {
    console.log(loader);
    return async function (args: LoaderFunctionArgs | ActionFunctionArgs) {
        const authSession = await requireAuthSession(args.request);
        return loader
            ? loader({
                  ...args,
                  context: {
                      ...args.context,
                      authSession,
                  },
              })
            : () =>
                  json({
                      connected: true,
                  });
    };
}

export type { ConnectedActionFunctionArgs, ConnectedLoaderFunctionArgs };

export { requireUserLoader };
