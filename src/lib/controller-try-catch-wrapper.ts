import { Response } from 'express';
export async function controllerTryCatchWrapper(
    callback: (messages?: { errorMessage?; successMessage? }) => any,
    options: {
        res?: Response;
        successMessage?: string;
        errorMessage?: string;
        showError?: boolean;
    } = {},
): Promise<{ message: string; status: string; data?: any; error?: string }> {
    const modifiedMessages: { errorMessage?; successMessage? } = {};
    const defaultOptions = {
        successMessage: 'Action successful',
        errorMessage: 'Error occured',
        showError: true,
    };
    options = Object.assign({}, defaultOptions, options);
    let response;
    try {
        const data = await callback(modifiedMessages);
        response = { message: options.successMessage, status: 'ok', data };
        if (modifiedMessages.successMessage) {
            response.message = modifiedMessages.successMessage;
        }
    } catch (error) {
        response = { message: options.errorMessage, status: 'error', error: options.showError ? error : '' };
        if (modifiedMessages.errorMessage) {
            response.message = modifiedMessages.errorMessage;
        }
    } finally {
        if (options.res) {
            options.res.json(response);
        }
        return response;
    }
}
