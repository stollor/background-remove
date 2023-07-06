import { _decorator, CCFloat, Component, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('utils/FitWidthHeight')
export class FitWidthHeight extends Component {
	@property(CCFloat) ratio: number = 1;
	start() {
		this.node.parent.on(Node.EventType.SIZE_CHANGED, this.onSizeChange, this);
	}

	protected onEnable(): void {
		this.onSizeChange();
	}

	onSizeChange() {
		let parentWidth = this.node.parent.getComponent(UITransform).width;
		let parentheight = this.node.parent.getComponent(UITransform).height;
		let selfWidth = this.node.getComponent(UITransform).width;
		let selfHeight = this.node.getComponent(UITransform).height;
		let scaleWidth = (parentWidth * this.ratio) / selfWidth;
		let scaleHeight = (parentheight * this.ratio) / selfHeight;
		let scale = scaleWidth > scaleHeight ? scaleHeight : scaleWidth;
		this.node.setScale(scale, scale, 1);
	}
}
