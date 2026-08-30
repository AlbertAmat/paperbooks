/** Options for a single snackbar notification (see `appSnackbarController.show()`). */
export interface SnackbarOptions {
    /** Text shown in the snackbar. */
    message: string;
    /** Label for the optional action button, e.g. "Undo". */
    actionLabel?: string;
    /** Callback invoked when the action button is clicked. */
    onAction?: () => void;
    /** How long the snackbar stays visible, in milliseconds (default 4000ms). */
    duration?: number; // default 4000ms
    /** Visual style (`SnackbarType`); defaults to `SnackbarType.SUCCESS`. */
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
    /** Subscribed listeners notified on every `show()`/`clear()` call. */
    private listeners: ((options: SnackbarOptions | null) => void)[] = [];

    /**
     * Broadcast a snackbar to show.
     * @param options Snackbar content/behavior.
     */
    show(options: SnackbarOptions) {
        this.emit(options);
    }

    /** Broadcast "hide the current snackbar". */
    clear() {
        this.emit(null);
    }

    /**
     * Register a listener (typically the AppSnackbar component).
     * @param listener Called with the latest options, or null when cleared.
     * @returns An unsubscribe function.
     */
    subscribe(listener: (options: SnackbarOptions | null) => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    }

    /** @param options Options to broadcast to every subscriber, or null to clear. */
    private emit(options: SnackbarOptions | null) {
        this.listeners.forEach((listener) => listener(options));
    }
}

/** Singleton instance shared by every part of the app. */
export const appSnackbarController = new AppSnackbarController();
