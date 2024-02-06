import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";

import globalStyle from "./styles/global.css";

export const links: LinksFunction = () => [
    {
        rel: "stylesheet preload prefetch",
        href: globalStyle,
        as: "style",
    },
];

export const meta: MetaFunction = () => [
    { title: "PoiTricks" },
    { name: "description", content: "PoiTricks" },
];

export default function App() {
    return (
        <html className="dark h-full">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1.0,maximum-scale=1.0"
                />
                <Meta />
                <Links />
            </head>
            <body className="h-full">
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}
