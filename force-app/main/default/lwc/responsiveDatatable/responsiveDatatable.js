import {
	LightningElement,
	api,
	wire
} from 'lwc';
import {
	subscribe,
	MessageContext
} from 'lightning/messageService';
import SELECTED_STUDENT_CHANNEL from '@salesforce/messageChannel/SelectedStudentChannel__c';

export default class ResponsiveDatatable extends LightningElement {
	@api columnConfig;
	recordId;
	@api pkField;
	rows;
	_selectedRow;
	subscription;
	studentId;
	@wire(MessageContext) messageContext;
	connectedCallback() {
		if (this.subscription) {
			return;
		}
		this.subscription = subscribe(
			this.messageContext,
			SELECTED_STUDENT_CHANNEL,
			(message) => {
				this.setSelectedRecord(message)
			}
		);
		
	}
	handleStudentChange(message) {
		this.studentId = message.studentId;


	}


	highlightSelectedRow(target) {

		if (this._selectedRow) {

			this._selectedRow.classList.remove("slds-is-selected");
		}
		target.classList.add("slds-is-selected");
		this._selectedRow = target;

	}
	@api setSelectedRecord(recordId) {
		const mySelector = `tr[data-pk='${recordId}']`;
		const selectedRow = this.template.querySelector(mySelector);
		if (selectedRow) {
			this.highlightSelectedRow(selectedRow);
		}
	}
	onRowClick(event) {
		const target = event.currentTarget;
		const evt = new CustomEvent('rowclick', {
			detail: {
				pk: target.getAttribute('data-pk')
			}
		});
		this.dispatchEvent(evt);
		this.highlightSelectedRow(target);
	}
	@api
	get rowData() {
		return this.rows;
	}
	set rowData(value) {
		if (typeof value !== "undefined") {
			this.rows = this.reformatRows(value);
		}
	}
	onRowDblClick(event) {
		const target = event.currentTarget;
		const evt = new CustomEvent('rowdblclick', {
			detail: {
				pk: target.getAttribute('data-pk')
			}
		});
		this.dispatchEvent(evt);
	}
	reformatRows = function (rowData) {
		let colItems = this.columnConfig;
		let reformattedRows = [];

		for (let i = 0; i < rowData.length; i++) {
			let rowDataItems = [];
			for (let j = 0; j < colItems.length; j++) {
				let colClass = '';
				if (colItems[j].hiddenOnMobile) {
					colClass = 'hiddenOnMobile';
				}
				rowDataItems.push({
					value: rowData[i][colItems[j].fieldName],
					label: colItems[j].label,
					type: colItems[j].type,
					class: colClass,
					columnId: 'col' + j + '-' + rowData[i][this.pkField],
					isPhone: (colItems[j].type === 'phone'),
					isEmail: (colItems[j].type === 'email'),
					isOther: (colItems[j].type !== 'phone' && colItems[j].type !== 'email')
				});
			}
			reformattedRows.push({
				data: rowDataItems,
				pk: rowData[i][this.pkField]
			});
		}
		return reformattedRows;
	}

}