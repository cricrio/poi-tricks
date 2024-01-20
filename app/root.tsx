import type {
	LinksFunction,
	LoaderFunction,
	MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
	Links,
	Link,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next";

import { i18nextServer } from "~/integrations/i18n";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import globalStyle from "./styles/global.css";
import { getBrowserEnv } from "./utils/env";
import { LogoutButton, getAuthSession } from "./modules/auth";

export const links: LinksFunction = () => [
	{
		rel: "stylesheet preload prefetch",
		href: tailwindStylesheetUrl,
		as: "style",
	},
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

export const loader: LoaderFunction = async ({ request }) => {
	const locale = await i18nextServer.getLocale(request);
	const session = await getAuthSession(request);
	return json({
		locale,
		env: getBrowserEnv(),
		connected: Boolean(session?.userId),
	});
};

export default function App() {
	const { env, locale, connected } = useLoaderData<typeof loader>();
	const { i18n } = useTranslation();

	useChangeLanguage(locale);

	return (
		<html lang={locale} dir={i18n.dir()} className="h-full dark">
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
				<div className="flex justify-between p-8">
					<Link to="/" className="text-2xl">
						PoiTricks
					</Link>
					{connected ? (
						<LogoutButton />
					) : (
						<Link to="/login">Login</Link>
					)}
				</div>
				<Outlet />
				<ScrollRestoration />
				<script
					dangerouslySetInnerHTML={{
						__html: `window.env = ${JSON.stringify(env)}`,
					}}
				/>
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
