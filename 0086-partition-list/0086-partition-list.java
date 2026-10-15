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
    public ListNode partition(ListNode head, int x) {
        ListNode temp=head;
        ListNode temp1=new ListNode(-1);
        ListNode t1=temp1;
        ListNode temp2=new ListNode(-1);
       // if(head==null || head.next==null)return head;
        ListNode t2=temp2;
        while(temp!=null){
           // ListNode nex=temp.next;
            if(temp.val<x){
                t1.next=temp;
                t1=t1.next;
            }else{
                t2.next=temp;
                t2=t2.next;
            }
            temp=temp.next;
            
        }
        t1.next=temp2.next;
            t2.next=null;
        
        
        //t1.next=temp2;
        return temp1.next;

    }
}