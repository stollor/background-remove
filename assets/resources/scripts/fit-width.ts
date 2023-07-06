import { _decorator, CCFloat, Component, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('utils/FitWidth')
export class FitWidth extends Component {
	@property(CCFloat) ratio: number = 1;
	start() {
		this.node.parent.on(Node.EventType.SIZE_CHANGED, this.onSizeChange, this);
	}

	protected onEnable(): void {
		this.onSizeChange();
	}

	onSizeChange() {
		let parentWidth = this.node.parent.getComponent(UITransform).width;
		let selfWidth = this.node.getComponent(UITransform).width;
		let scale = (parentWidth * this.ratio) / selfWidth;
		this.node.setScale(scale, scale, 1);
	}
}
