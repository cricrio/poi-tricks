import { createHash } from "node:crypto";

import type { User } from "~/database";
import { db } from "~/database";
import type { AuthSession } from "~/modules/auth";
import {
	createEmailAuthAccount,
	signInWithEmail,
	deleteAuthAccount,
} from "~/modules/auth";

export async function getUserByEmail(email: User["email"]) {
	return db.user.findUnique({ where: { email: email?.toLowerCase() } });
}

export async function tryGetUserById(id?: string) {
	if (!id) return null;
	return db.user.findUnique({ where: { id } });
}

const getGravatorImageUrl = (email: string) => {
	const hash = createHash("sha256")
		.update(email.trim().toLowerCase())
		.digest("hex");
	return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};

async function createUser(
	{ email, userId }: Pick<AuthSession, "userId" | "email">,
	picture: string,
) {
	return db.user
		.create({
			data: {
				email,
				picture,
				id: userId,
			},
		})
		.then((user) => user)
		.catch(() => null);
}

export async function tryCreateUser(
	{ email, userId }: Pick<AuthSession, "userId" | "email">,
	picture: string,
) {
	const user = await createUser(
		{
			userId,
			email,
		},
		picture,
	);

	// user account created and have a session but unable to store in User table
	// we should delete the user account to allow retry create account again
	if (!user) {
		await deleteAuthAccount(userId);
		return null;
	}

	return user;
}

export async function createUserAccount(
	email: string,
	password: string,
): Promise<AuthSession | null> {
	const authAccount = await createEmailAuthAccount(email, password);

	// ok, no user account created
	if (!authAccount) return null;

	const authSession = await signInWithEmail(email, password);

	// user account created but no session 😱
	// we should delete the user account to allow retry create account again
	if (!authSession) {
		await deleteAuthAccount(authAccount.id);
		return null;
	}

	const picture = getGravatorImageUrl(email);
	const user = await tryCreateUser(authSession, picture);

	if (!user) return null;

	return authSession;
}
