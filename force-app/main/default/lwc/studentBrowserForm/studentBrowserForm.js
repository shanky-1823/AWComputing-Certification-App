import {LightningElement,wire} from 'lwc';
import getInstructors from '@salesforce/apex/StudentBrowserForm.getInstructors';
import getDeliveriesByInstructor from '@salesforce/apex/StudentBrowserForm.getDeliveriesByInstructor';
import { NavigationMixin } from 'lightning/navigation';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';
export default class StudentBrowserForm extends NavigationMixin(LightningElement ) {
    selectedInstructorId = '';
    deliveries = [];
    selectedDeliveryId = '';
    instructors = [];
    isButtonDisabled = true;
    error;
    onInstructorChange(event) {
        this.selectedDeliveryId = '';
        this.selectedInstructorId = event.target.value;
        this.isButtonDisabled = (this.selectedInstructorId ===
            '');
        this.notifyParent();
    }
    onAddNewDelivery() {
        // Opens the new Course Delivery record modal dialog
        // with the selected InstructorId prepopulated
        const pageInfo = {
            type: "standard__objectPage",
            attributes: {
                objectApiName: "Course_Delivery__c",
                actionName: "new"
            },
            state: {
                defaultFieldValues: encodeDefaultFieldValues({
                    Instructor__c: this.selectedInstructorId
                })
            }
        };
        this[NavigationMixin.Navigate](pageInfo);
    }
    onDeliveryChange(event) {
        this.selectedDeliveryId = event.target.value;
        this.notifyParent();
    }
    notifyParent() {
        const evt = new CustomEvent('filterchange', {
            detail: {
                instructorId: this.selectedInstructorId,
                deliveryId: this.selectedDeliveryId,
            }
        });
        this.dispatchEvent(evt);
    }

    @wire(getInstructors)
    wired_getInstructors({
        error,
        data
    }) {
        this.instructors = [];
        if (data) {
            this.instructors.push({
                value: '',
                label: 'Select an instructor'
            });
            data.forEach(instructor => {
                this.instructors.push({
                    value: instructor.Id,
                    label: instructor.Name
                });
            });
        } else if (error) {
            this.error = error;
        }
    }
    @wire(getDeliveriesByInstructor, {
        instructorId: '$selectedInstructorId'
    })
    wired_getDeliveriesByInstructor({
            error,
            data
        }) {
            this.deliveries = [];
            if (data && data.length) {
            this.deliveries = data.map(delivery => ({
                value: delivery.Id,
                label: `${delivery.Start_Date__c}
                ${delivery.Location__c} ${delivery.Attendee_Count__c}
                students`
            }));
            this.deliveries.unshift({
                value: '',
                label: 'Any Delivery'
            });
        } else if (error) {
            this.error = error;
        }
    }
}