import { LightningElement,wire } from 'lwc';
import getStudents from '@salesforce/apex/StudentBrowser.getStudents';
import { publish, MessageContext } from 'lightning/messageService';
import { NavigationMixin } from 'lightning/navigation';
import SELECTED_STUDENT_CHANNEL from '@salesforce/messageChannel/SelectedStudentChannel__c';
export default class StudentBrowser extends NavigationMixin(LightningElement) {
    @wire(MessageContext) messageContext;
    students = [];
    cols = [{
            fieldName: "Name",
            label: "Name"
        },
        {
            fieldName: "Title",
            label: "Title",
            hiddenOnMobile: true
        },
        {
            fieldName: "Phone",
            label: "Phone",
            type: "phone"
        },
        {
            fieldName: "Email",
            label: "E-Mail",
            type: "email"
        }
    ];
    selectedDeliveryId = '';
    selectedInstructorId = '';
    handleRowClick(event) {
        const studentId = event.detail.pk;
        this.updateSelectedStudent(studentId);
    }
    handleFilterChange(event){
        this.selectedDeliveryId = event.detail.deliveryId;
        this.selectedInstructorId = event.detail.instructorId;
        this.dispatchEvent(new CustomEvent('loading', {bubbles:true, composed:true }));
    }
    handleRowDblClick(event) {
            const studentId = event.detail.pk;
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: studentId,
                    objectApiName: 'Contact',
                    actionName: 'edit'
                }
            });
    }
    
    

    handleStudentSelected(event) {
        const studentId = event.detail.studentId;
        this.updateSelectedStudent(studentId);
    }

    updateSelectedStudent(studentId) {
        const grid =
            this.template.querySelector('c-responsive-datatable');
        const gallery =
            this.template.querySelector('c-student-tiles');
        if (gallery) {
            gallery.setSelectedStudent(studentId);
            
        }
        if (grid) {
            grid.setSelectedRecord(studentId);
            
        }
        publish(this.messageContext,
            SELECTED_STUDENT_CHANNEL, {
                studentId: studentId
            });
        alert("Student ID to be published: "+studentId);    
    }
    
    @wire(getStudents, {
        instructorId: '$selectedInstructorId',
        courseDeliveryId: '$selectedDeliveryId'
    })
    wired_getStudents(result) {
        this.students = result;
        this.dispatchEvent(new CustomEvent('doneloading', {
            bubbles: true,
            composed: true
        }));
    }
    
}