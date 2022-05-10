import { LightningElement } from 'lwc';
import getAll from '@salesforce/apex/TripReportBrowser.getAll';

export default class TripReportBrowser extends LightningElement {
	selectedRecordId = 0;
	cols = [
		{
			fieldName:'Date__c', 
			label: 'Date',
			hiddenOnMobile:true
		},
		{
			fieldName:'Name', 
			label: 'Name'
		},
		{
			fieldName:'ReviewType__c', 
			label: 'Type'
		},
		{
			fieldName:'InstructorName', 
			label: 'Instructor'
		},
		{
			fieldName:'Rating__c', 
			label: 'Rating'
		}
	];

	tripReports;

	connectedCallback() {
		getAll()
		.then((result) => {
			let data = result;
			this.tripReports = [];
			if (data) {
				this.tripReports = data.map ( (report) => ({ 
					Id: report.Id,
					Name: report.Name,
					Date__c: report.Date__c,
					Rating__c: report.Rating__c, 
					Review__c: report.Review__c, 
					ReviewType__c: report.ReviewType__c, 
					InstructorName: (typeof report.Instructor__r === 'undefined') ? '' : report.Instructor__r.Name 
				}));
			} 
		});
	}
	handleRowClick(event) {
		this.selectedRecordId = event.detail.pk;
	}
	handleRowDblClick() {
		this.changeTripReportMode('edit');
	}
	changeTripReportMode(newMode) {
		const eventDetail = {
			mode: newMode
		}
		if (newMode === 'edit') {
			eventDetail.Id = this.selectedRecordId;
		}
		const evt = new CustomEvent('tripreportmodechange', {
			detail: eventDetail
		});
		this.dispatchEvent(evt);
	}
	onBtnNewClick() {
		this.changeTripReportMode("add");
	}
	onBtnEditClick() {
		this.changeTripReportMode('edit');
	}
	

}