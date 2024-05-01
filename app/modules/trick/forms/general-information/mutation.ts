import { makeDomainFunction } from "domain-functions";

import { schema } from "./schema";

const mutation = makeDomainFunction(schema)(
    async (values) =>
        console.log(values) /* or anything else, like saveMyValues(values) */,
);

export { mutation };
