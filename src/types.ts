declare module '@yandex/ymaps3-types/import' {
    interface Import {
        (pkg: 'ymaps3-resizer'): Promise<typeof import('./index')>;
    }
}

export {};
