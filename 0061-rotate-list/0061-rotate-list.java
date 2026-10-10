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
    public ListNode rotateRight(ListNode head, int k) {
        ListNode s=head;
        ListNode f=head;
        ListNode temp=head;
        int len=0;
        if( head==null||head.next==null)return head;
        while(temp!=null){
            temp=temp.next;
            len++;
        }k%=len;
        if(k==0)return head;
        for(int i=1;i<=k+1;i++){
            f=f.next;
        }
        while(f!=null ){
            s=s.next;
            f=f.next;
        }
        ListNode a=s.next;
        s.next=null;
        ListNode t=a;
        while(t.next!=null){
            t=t.next;
        }
        t.next=head;
        return a;
    }
}