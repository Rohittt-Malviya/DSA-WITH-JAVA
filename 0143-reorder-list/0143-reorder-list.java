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
    public void reorderList(ListNode head) {
      // ListNode dummy=new ListNode(-1);
        ListNode t=head;
        ListNode s=head;
        ListNode f=head;
        while(f.next!=null&&f.next.next!=null){
            s=s.next;
            f=f.next.next;
        }
        //s=s.next;
       // t=s.next;
        
        ListNode h2=s.next;
        s.next=null;
        h2=reverse(h2);
        ListNode tt=h2;
        while(tt!=null){
            ListNode n1=t.next;
            ListNode n2=tt.next;
            t.next=tt;
            tt.next=n1;
            t=n1;
            tt=n2;
            //t.next=tt;
        }
       // head=dummy.next;
    }
    public ListNode reverse(ListNode head){
        ListNode prev=null;
        ListNode curr=head;
        ListNode fwd=null;
        while(curr!=null){
            fwd=curr.next;
            curr.next=prev;
            prev=curr;
            curr=fwd;
        }return prev;
    } 
}