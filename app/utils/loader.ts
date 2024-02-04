import type {
    ActionFunction,
    ActionFunctionArgs,
    AppLoadContext,
    LoaderFunction,
    LoaderFunctionArgs,
} from "@remix-run/node";

type LoaderExtendedFunctionArgs<T> = LoaderFunctionArgs & {
    context: AppLoadContext & T;
};

type ActionExtendedFunctionArgs<T> = ActionFunctionArgs & {
    context: AppLoadContext & T;
};

type ActionExtendedFunction<T> = (
    args: ActionExtendedFunctionArgs<T>,
) => ReturnType<ActionFunction>;

type LoaderExtendedFunction<T> = (
    args: LoaderExtendedFunctionArgs<T>,
) => ReturnType<LoaderFunction>;

export type {
    ActionExtendedFunction,
    LoaderExtendedFunction,
    ActionExtendedFunctionArgs,
    LoaderExtendedFunctionArgs,
};
