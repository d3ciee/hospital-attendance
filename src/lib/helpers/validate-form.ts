import { z } from "zod";
import type { ZodRawShape, ZodObject } from 'zod';

type ValidateFormReturn<T> = {
    valid: false,
    errors: {
        message: string,
        field: string;
    }[]
} | {
    valid: true,
    data: T
}

const validateForm = <T extends ZodRawShape>(form: FormData, zodSchema: ZodObject<T>): ValidateFormReturn<z.infer<ZodObject<T>>> => {
    const formObject = Object.fromEntries(form.entries());
    const formValues = zodSchema.safeParse(formObject);

    if (formValues.success) {
        return {
            valid: true,
            data: formValues.data
        };
    } else {
        return {
            valid: false,
            errors: formValues.error.errors.map((error) => ({
                message: error.message,
                field: error.path[0].toString()
            }))
        };
    }
}

export default validateForm;