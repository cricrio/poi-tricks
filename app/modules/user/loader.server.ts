import { json, type LoaderFunctionArgs } from "@remix-run/node";



export function requireUserLoader(loader) {
    console.log(loader);
    return async function (args: LoaderFunctionArgs) {
        const authSession = {};
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


