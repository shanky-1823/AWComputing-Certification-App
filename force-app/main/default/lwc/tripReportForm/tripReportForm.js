import { LightningElement } from "lwc";
import utils from "c/utils";

export default class TripReportForm extends LightningElement {
	doSuccess() {
		utils.showToast(this, "Transaction Complete", "Your Trip Report was Saved");
	}
}