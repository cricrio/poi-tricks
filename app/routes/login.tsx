import * as React from "react";

import type {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useNavigation, useSearchParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { parseFormAny, useZorm } from "react-zorm";
import { z } from "zod";

import { i18nextServer } from "~/integrations/i18n";
import {
    createAuthSession,
    getAuthSession,
    signInWithEmail,
    ContinueWithEmailForm,
} from "~/modules/auth";
import { Input, Label } from "~/modules/ui";
import { ROUTES } from "~/routes";
import { assertIsPost, isFormProcessing } from "~/utils";

export async function loader({ request }: LoaderFunctionArgs) {
    const authSession = await getAuthSession(request);
    const t = await i18nextServer.getFixedT(request, "auth");
    const title = t("login.title");

    if (authSession) return redirect(ROUTES.home);

    return json({ title });
}

const LoginFormSchema = z.object({
    email: z
        .string()
        .email("invalid-email")
        .transform((email) => email.toLowerCase()),
    password: z.string().min(8, "password-too-short"),
    redirectTo: z.string().optional(),
});

export async function action({ request }: ActionFunctionArgs) {
    assertIsPost(request);
    const formData = await request.formData();
    const result = await LoginFormSchema.safeParseAsync(parseFormAny(formData));

    if (!result.success) {
        return json(
            {
                errors: result.error,
            },
            { status: 400 },
        );
    }

    const { email, password, redirectTo } = result.data;

    const authSession = await signInWithEmail(email, password);

    if (!authSession) {
        return json(
            { errors: { email: "invalid-email-password", password: null } },
            { status: 400 },
        );
    }

    return createAuthSession({
        request,
        authSession,
        redirectTo: redirectTo || "/",
    });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
    {
        title: data?.title,
    },
];

export default function LoginPage() {
    const zo = useZorm("NewQuestionWizardScreen", LoginFormSchema);
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") ?? undefined;

    const navigation = useNavigation();
    const disabled = isFormProcessing(navigation.state);
    const { t } = useTranslation("auth");

    return (
        <div className="flex min-h-full flex-col justify-center">
            <div className="mx-auto w-full max-w-md px-8">
                <Form ref={zo.ref} method="post" className="space-y-6" replace>
                    <div>
                        <label
                            htmlFor={zo.fields.email()}
                            className="block text-sm font-medium"
                        >
                            {t("login.email")}
                        </label>

                        <div className="mt-1">
                            <Input
                                data-test-id="email"
                                required
                                autoFocus={true}
                                name={zo.fields.email()}
                                type="email"
                                autoComplete="email"
                                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                                disabled={disabled}
                            />
                            {zo.errors.email()?.message && (
                                <div
                                    className="pt-1 text-red-700"
                                    id="email-error"
                                >
                                    {zo.errors.email()?.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label
                            htmlFor={zo.fields.password()}
                            className="block text-sm font-medium"
                        >
                            {t("register.password")}
                        </Label>
                        <div className="mt-1">
                            <Input
                                data-test-id="password"
                                name={zo.fields.password()}
                                type="password"
                                autoComplete="new-password"
                                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                                disabled={disabled}
                            />
                            {zo.errors.password()?.message && (
                                <div
                                    className="pt-1 text-red-700"
                                    id="password-error"
                                >
                                    {zo.errors.password()?.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <input
                        type="hidden"
                        name={zo.fields.redirectTo()}
                        value={redirectTo}
                    />
                    <button
                        data-test-id="login"
                        type="submit"
                        className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
                        disabled={disabled}
                    >
                        {t("login.action")}
                    </button>
                    <div className="flex items-center justify-center">
                        <div className="text-center text-sm text-gray-500">
                            <Link
                                className="text-blue-500 underline"
                                to="/forgot-password"
                            >
                                {t("login.forgotPassword")}?
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="text-center text-sm text-gray-300">
                            {t("login.dontHaveAccount")}{" "}
                            <Link
                                className="text-blue-500 underline"
                                to={{
                                    pathname: "/join",
                                    search: searchParams.toString(),
                                }}
                            >
                                {t("login.signUp")}
                            </Link>
                        </div>
                    </div>
                </Form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="rounded bg-white p-2 text-gray-600">
                                {t("login.orContinueWith")}
                            </span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <ContinueWithEmailForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
