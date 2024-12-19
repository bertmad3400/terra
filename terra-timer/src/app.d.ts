// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			title: string;
			desc?: string;
		}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '@fortawesome/free-solid-svg-icons/index.es' {
	export * from '@fortawesome/free-solid-svg-icons';
}

declare module '@fortawesome/free-regular-svg-icons/index.es' {
	export * from '@fortawesome/free-regular-svg-icons';
}

declare module '@fortawesome/free-brands-svg-icons/index.es' {
	export * from '@fortawesome/free-brands-svg-icons';
}

export {};
