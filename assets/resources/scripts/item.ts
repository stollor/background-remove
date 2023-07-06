import { _decorator, Button, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { FitWidthHeight } from './fit-width-height';
import { ImageFileInput, imageFileOutput } from './interface';
import { tools } from './tools';
const { ccclass, property } = _decorator;

@ccclass('Item')
export class Item extends Component {
	@property(Sprite) spOld: Sprite;
	@property(Sprite) spNew: Sprite;
	@property(Node) nodeDown: Node;
	@property(Node) nodeClose: Node;
	@property(Label) labelTime: Label;

	private _downCB: Function = null;

	private _startTime: number = null;
	get startTime() {
		if (!this._startTime) {
			this._startTime = Date.now();
		}
		return this._startTime;
	}

	start() {
		this.nodeDown.on(Button.EventType.CLICK, this.onClickDown, this);
		this.nodeClose.on(Button.EventType.CLICK, this.onClickClose, this);
	}

	onClickDown() {
		this._downCB && this._downCB();
	}

	onClickClose() {
		this.node.destroy();
	}

	run(data: ImageFileInput) {
		this.schedule(this.updateTime, 0.5);
		console.log(data);
		//@ts-ignore
		tools.blodToSpriteFrame(tools.Base64ToBlob(data.src)).then((spriteFrame: SpriteFrame) => {
			this.spOld.spriteFrame = spriteFrame;
			this.scheduleOnce(() => {
				this.spOld.getComponent(FitWidthHeight).onSizeChange();
			});
		});
		tools.removeBg(data.src).then((data: imageFileOutput) => {
			this.spNew.spriteFrame = data.spriteFrame;
			this.scheduleOnce(() => {
				this.spNew.getComponent(FitWidthHeight).onSizeChange();
			});
			this.nodeDown.getComponent(Button).interactable = true;
			this._downCB = () => {
				tools.saveFileInBrowser(data.blob, 'removebg.png');
			};
			this.unschedule(this.updateTime);
		});
	}

	updateTime() {
		this.labelTime.string = `耗时\n ${~~(Date.now() - this.startTime) / 1000} 秒`;
	}
}
