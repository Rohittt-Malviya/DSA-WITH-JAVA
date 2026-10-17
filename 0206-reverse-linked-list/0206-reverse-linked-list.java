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
    public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode current = head;
    ListNode fwd;
    
    while (current != null) {
        fwd = current.next;      // Save next node
        current.next = prev;      // Reverse the link
        prev = current;           // Move prev forward
        current = fwd;           // Move current forward
    }
   
    
    return prev;  // New head of reversed list
}
}