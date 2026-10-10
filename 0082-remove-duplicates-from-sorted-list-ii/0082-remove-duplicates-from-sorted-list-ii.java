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
    public ListNode deleteDuplicates(ListNode head) {
        ListNode temp=new ListNode(-1);
        ListNode t=temp;
        ListNode i=head;
        while(i!=null){
            if(i.next==null || i.val!=i.next.val){
                t.next=i;
                t=i;
                i=i.next;
            }
            else{
                ListNode j=i.next;
                while(j!=null && j.val==i.val){
                    j=j.next;
                }
                i=j;
            }
        }t.next=i;
        return temp.next;
    }
}