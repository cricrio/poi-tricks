import { Form } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import { Button } from "~/modules/ui";

export function LogoutButton() {
    const { t } = useTranslation("auth");

    return (
        <Form action="/logout" method="post">
            <Button variant="outline" data-test-id="logout" type="submit">
                {t("logout.action")}
            </Button>
        </Form>
    );
}
