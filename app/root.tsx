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

import { LogoutButton, getAuthSession } from "./modules/auth";
import type { UserWithSavedTrick } from "./modules/user";
import {
	UserProvider,
	tryGetUserByIdWithSavedTricks,
	UserShield,
	Avatar,
} from "./modules/user";
import { ROUTES } from "./routes";
import globalStyle from "./styles/global.css";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getBrowserEnv } from "./utils/env";

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
	const user = await tryGetUserByIdWithSavedTricks(session?.userId);

	return json({
		locale,
		env: getBrowserEnv(),
		user,
	});
};

export default function App() {
	const { env, locale, user } = useLoaderData<typeof loader>();
	const { i18n } = useTranslation();

	useChangeLanguage(locale);

	return (
		<html lang={locale} dir={i18n.dir()} className="dark h-full">
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
				<UserProvider user={user}>
					<div className="flex justify-between p-8">
						<Link to={ROUTES.home()} className="text-2xl">
							PoiTricks
						</Link>
						<UserShield
							notConnected={<Link to="/login">Login</Link>}
						>
							{(user: UserWithSavedTrick) => (
								<div className="flex items-center gap-5">
									<LogoutButton />
									<Link to={ROUTES.me()}>
										<Avatar {...user} />
									</Link>
								</div>
							)}
						</UserShield>
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
				</UserProvider>
			</body>
		</html>
	);
}
