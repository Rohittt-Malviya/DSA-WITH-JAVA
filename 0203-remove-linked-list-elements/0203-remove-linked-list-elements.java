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
    public ListNode removeElements(ListNode head, int val) {
        
        while(head!=null && head.val==val){
            head=head.next;
        }
        if(head==null)return head;
        //if(head.val==val)return null;
        ListNode s=head;
        ListNode f=head.next;
        while(f!=null){
            if(f.val==val){
                s.next=f.next;
                f=f.next;
            }
            else{
                s=f;
                f=f.next;
            }
        }return head;

    }
}