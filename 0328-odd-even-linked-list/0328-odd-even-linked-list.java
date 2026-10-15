/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode oddEvenList(ListNode head) {
        ListNode temp1=new ListNode(-1);
        ListNode temp2=new ListNode(-1);
        ListNode t1=temp1;
        ListNode t2=temp2;
        ListNode temp=head;
        int count=1;
        if(head==null)return head;
        ListNode y=new ListNode(-1);
        while(temp!=null){
            
            if(count%2!=0){
                t1.next=temp;
                t1=t1.next;
                
            }else{
                t2.next=temp;
                t2=t2.next;

            }
            count++;
            temp=temp.next;
           
        } t1.next=null;
            t2.next=null;
            temp1=temp1.next;
            temp2=temp2.next;
            
                t1.next=temp2;
               // t2.next=temp1;
            return temp1;
            
            

           
            

        
    }
}