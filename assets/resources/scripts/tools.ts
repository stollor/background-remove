import removeBackground, { Config } from '@imgly/background-removal/dist/browser.js';
//import { Config } from '@imgly/background-removal';
import { ImageAsset, SpriteFrame, Texture2D } from 'cc';

export class tools {
	public static removeBg(image_src: ImageData | ArrayBuffer | Uint8Array | Blob | URL | string) {
		return new Promise((resolve, reject) => {
			let config: Config = {
				progress: (key, current, total) => {
					//console.log(`Downloading ${key}: ${current} of ${total}`);
				},
				debug: false,
				fetchArgs: {
					mode: 'cors',
				},
			};
			let startTime = Date.now();
			console.log('开始时间：', startTime);
			//@ts-ignore
			removeBackground.default(image_src, config).then((blob: Blob) => {
				const url = URL.createObjectURL(blob);
				console.log(url);
				this.blodToSpriteFrame(blob).then((spriteFrame: SpriteFrame) => {
					console.log(`耗时：${(Date.now() - startTime) / 1000} 秒`);
					resolve({
						spriteFrame: spriteFrame,
						url: url,
						blob: blob,
					});
				});
			});
		});
	}

	/**
	 * 下载文件 In Browser
	 */
	public static saveFileInBrowser(blob: Blob, fileName: string) {
		let URL = window.URL || window[`webkitURL`];
		let objectUrl = URL.createObjectURL(blob);
		if (fileName) {
			var a = document.createElement('a');
			a.href = objectUrl;
			a.download = fileName;
			document.body.appendChild(a);
			a.click();
			a.remove();
		} else {
			window.location.href = objectUrl;
		}
		URL.revokeObjectURL(objectUrl);
	}

	public static blodToSpriteFrame(blob: Blob) {
		return new Promise((resolve, reject) => {
			this.blobToImageData(blob).then((imageData: ImageData) => {
				this.imageDataToSprieFram(imageData).then((spriteFrame: SpriteFrame) => {
					resolve(spriteFrame);
				});
			});
		});
	}

	public static blobToImageData(blob) {
		return new Promise((resolve, reject) => {
			const url = URL.createObjectURL(blob);
			const img = new Image();
			img.onload = () => {
				URL.revokeObjectURL(url);
				const canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;
				const ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0);
				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
				resolve(imageData);
			};
			img.onerror = reject;
			img.src = url;
		});
	}

	public static imageDataToSprieFram(imageData: ImageData) {
		return new Promise((resolve, reject) => {
			let imageAsset = new ImageAsset();
			imageAsset.reset({
				_data: imageData.data,
				width: imageData.width,
				height: imageData.height,
				format: Texture2D.PixelFormat.RGBA8888,
				_compressed: false,
			});
			let spriteFrame = new SpriteFrame();
			const tex = new Texture2D();
			tex.image = imageAsset;
			spriteFrame.texture = tex;
			spriteFrame.packable = false;
			resolve(spriteFrame);
		});
	}

	public static Base64ToBlob(base64In: string): Blob {
		// 假设image_src是一个Base64编码的字符串
		const base64 = base64In.split(',')[1];
		const binary = atob(base64);
		const array = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) {
			array[i] = binary.charCodeAt(i);
		}
		const blob = new Blob([array], { type: 'image/png' });
		return blob;
	}
}
