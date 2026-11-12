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
    public int getDecimalValue(ListNode head) {
        ListNode temp=head;
        int n=0;
        while(temp!=null){
            n=n*2+temp.val;
            temp=temp.next;

        }
        //int num=Integer.parseInt(n,2);
        return n;
    }
}