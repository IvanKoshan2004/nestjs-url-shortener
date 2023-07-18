export async function controllerTryCatchWrapper(
    callback: () => any,
    options: {
        successMessage?: string;
        errorMessage?: string;
        showError: boolean;
    } = {
        successMessage: 'Action successful',
        errorMessage: 'Error occured',
        showError: true,
    },
): Promise<{ message: string; status: string; data?: any; error?: string }> {
    try {
        return { message: options.successMessage, status: 'ok', data: await callback() };
    } catch (error) {
        return { message: options.errorMessage, status: 'error', error: options.showError ? error : '' };
    }
}
