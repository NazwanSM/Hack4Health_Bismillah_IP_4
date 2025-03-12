// Definisikan tipe untuk Service Worker
interface ServiceWorkerRegistration {
    pushManager: {
        subscribe(options: {
            userVisibleOnly: boolean;
            applicationServerKey: Uint8Array;
        }): Promise<PushSubscription>;
        getSubscription(): Promise<PushSubscription | null>;
    };
    update(): void;
    unregister(): Promise<boolean>;
}

interface ServiceWorkerContainer {
    register(scriptURL: string, options?: RegistrationOptions): Promise<ServiceWorkerRegistration>;
    getRegistration(scope?: string): Promise<ServiceWorkerRegistration | undefined>;
    getRegistrations(): Promise<ReadonlyArray<ServiceWorkerRegistration>>;
}

interface Navigator {
    serviceWorker: ServiceWorkerContainer;
}

interface WindowEventMap {
    online: Event;
    offline: Event;
}