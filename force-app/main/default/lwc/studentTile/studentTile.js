import { LightningElement, api } from 'lwc';
export default class StudentTile extends LightningElement {
   
    @api selectedStudentId = '';
    @api student = {
    };
    get tileSelected() {
        return (this.selectedStudentId===this.student.Id)
        ? "tile selected" : "tile";
        }
    studentClick(){
        alert("Student Clicked: "+this.student.Name);
        const evt = new CustomEvent('studentselected', {
            bubbles: true, composed: true,
            detail: { studentId: this.student.Id }
            });
            this.dispatchEvent(evt) ;
        }
    
        /*renderedCallback() {
            console.log('rendering student ' + this.student.Id);
        }*/

}