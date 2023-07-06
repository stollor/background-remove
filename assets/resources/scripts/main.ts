import { _decorator, Component, instantiate, Node } from 'cc';
import { ImageFileInput } from './interface';
import { Item } from './item';
const { ccclass, property } = _decorator;

@ccclass('main')
export class main extends Component {
	@property(Node) nodeItem: Node;
	@property(Node) nodeContent: Node;
	start() {
		window.addEventListener('dragover', (event: DragEvent) => {
			event.preventDefault();
		});
		window.addEventListener('drop', (event: DragEvent) => {
			event.preventDefault();
			const file = event.dataTransfer?.files[0];
			if (file) {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => {
					const image_src = reader.result;
					this.addNew({
						src: image_src,
						fileName: file.name,
					});
				};
			}
		});
	}

	addNew(data: ImageFileInput) {
		let newItem = instantiate(this.nodeItem);
		newItem.parent = this.nodeContent;
		newItem.getComponent(Item).run(data);
	}
}
