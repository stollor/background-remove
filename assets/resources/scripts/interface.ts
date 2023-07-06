import { SpriteFrame } from 'cc';

export interface ImageFileInput {
	src: ImageData | ArrayBuffer | Uint8Array | Blob | URL | string;
	fileName: string;
}

export interface imageFileOutput {
	spriteFrame: SpriteFrame;
	url: string;
	blob: Blob;
}
