/** Options for a single snackbar notification (see `appSnackbarController.show()`). */
export interface SnackbarOptions {
    message: string;
    actionLabel?: string;
    onAction?: () => void;
    duration?: number; // default 4000ms
    type?: number; // default 4000ms
};

/** Visual style of a snackbar. */
export enum SnackbarType {
    SUCCESS,
    ERROR
}

/**
 * Global pub/sub controller for the single `AppSnackbar.vue` instance
 * mounted in App.vue. Any model/service anywhere in the app calls
 * `appSnackbarController.show({...})` (e.g. after a successful save) and the
 * mounted snackbar component - subscribed via `subscribe()` - renders it,
 * without any prop drilling.
 *
 * @example
 * appSnackbarController.show({ message: i18n.global.t(AppLabels.SNACKBAR_BOOK_UPDATED) });
 */
export class AppSnackbarController {
    private listeners: ((options: SnackbarOptions | null) => void)[] = [];

    /** Broadcast a snackbar to show. */
    show(options: SnackbarOptions) {
        this.emit(options);
    }

    /** Broadcast "hide the current snackbar". */
    clear() {
        this.emit(null);
    }

    /** Register a listener (typically the AppSnackbar component); returns an unsubscribe function. */
    subscribe(listener: (options: SnackbarOptions | null) => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    }

    private emit(options: SnackbarOptions | null) {
        this.listeners.forEach((listener) => listener(options));
    }
}

export const appSnackbarController = new AppSnackbarController();
