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
    public ListNode swapNodes(ListNode head, int k) {
        ListNode f=head;
        ListNode s=head;
        for(int i=1;i<=k;i++){
            f=f.next;
        }
        
        while(f!=null){
            f=f.next;
            s=s.next;
        }
        f=head;
        for(int i=1;i<=k-1;i++){
            f=f.next;
        }
        int temp=f.val;
        f.val=s.val;
        s.val=temp;
        return head;
    }
}