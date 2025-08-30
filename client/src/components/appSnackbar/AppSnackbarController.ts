export interface SnackbarOptions {
    message: string;
    actionLabel?: string;
    onAction?: () => void;
    duration?: number; // default 4000ms
    type?: number; // default 4000ms
};

export enum SnackbarType {
    SUCCESS,
    ERROR
}

export class AppSnackbarController {
    private listeners: ((options: SnackbarOptions | null) => void)[] = [];

    show(options: SnackbarOptions) {
        this.emit(options);
    }

    clear() {
        this.emit(null);
    }

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
